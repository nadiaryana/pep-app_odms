using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System.Net.Http;
using MongoDB.Bson;
using Newtonsoft.Json.Linq;
using ssc.Areas.PE.Models;
using System.Web.Http;
using Newtonsoft.Json;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System.IO;
using OfficeOpenXml.FormulaParsing.Excel.Functions.Text;
using ssc.Services;

namespace ssc.Areas.PE.Controllers
{
    [Route("api/pe/[controller]")]
    [ApiController]
    public class SumurController : ControllerBase
    {
        private IMongoDatabase database;
        private readonly IMongoCollection<Sumur> _sumur;
        private readonly IMongoCollection<SumurTmp> _sumur_tmp;
        private readonly IMongoCollection<SumurTmpItem> _sumur_tmp_items;
        private readonly ProjectionDefinition<Sumur> _fields;
        private readonly HttpClient _httpClient;
        private readonly IBackgroundTaskQueue _taskQueue;

        // Flag agar index xfilter hanya dibuat satu kali per proses.
        private static int _xfilterIndexEnsured = 0;

        public SumurController(IPEDatabaseSettings settings, IBackgroundTaskQueue taskQueue)
        {
            var client = new MongoClient(settings.ConnectionString);
            database = client.GetDatabase("pe");

            _sumur = database.GetCollection<Sumur>("sumur");
            _sumur_tmp = database.GetCollection<SumurTmp>("sumur_tmp");
            _sumur_tmp_items = database.GetCollection<SumurTmpItem>("sumur_tmp_items");
            _taskQueue = taskQueue;

            // projection field1 yang mau diambil
            _fields = Builders<Sumur>.Projection
                .Include(t => t.wellName)
                .Include(t => t.Current)
                .Include(t => t.Timestamp)
                .Include(t => t.date)
                .Include(t => t.entry_id)
                .Include(t => t.field_1)
                .Include(t => t.field_2);

            EnsureXFilterIndexes();
        }

        /// <summary>
        /// Membuat index pada field yang sering dipakai xfilter (wellName, date) sekali saja,
        /// supaya Distinct("wellName") / filter nama sumur tidak melakukan full collection scan.
        /// Dijalankan di background agar tidak memblokir request pertama.
        /// </summary>
        private void EnsureXFilterIndexes()
        {
            if (Interlocked.Exchange(ref _xfilterIndexEnsured, 1) == 1) return;
            Task.Run(() =>
            {
                try
                {
                    _sumur.Indexes.CreateOne(new CreateIndexModel<Sumur>(
                        Builders<Sumur>.IndexKeys.Ascending(t => t.wellName)));
                    _sumur.Indexes.CreateOne(new CreateIndexModel<Sumur>(
                        Builders<Sumur>.IndexKeys.Ascending(t => t.date)));
                }
                catch
                {
                    // Gagal -> reset flag supaya dicoba lagi pada request berikutnya.
                    Interlocked.Exchange(ref _xfilterIndexEnsured, 0);
                }
            });
        }

        // GET: api/pe/well/latest?limit=100
        [HttpGet("latest")]
        public async Task<IActionResult> GetLatest([FromQuery] int limit = 100)
        {
            var data = await _sumur.Find(Builders<Sumur>.Filter.Empty)
                                    .SortByDescending(x => x.Timestamp)
                                    .Limit(limit)
                                    .ToListAsync();

            return Ok(data);
        }

        // POST: api/pe/well/save
        [HttpPost("save")]
        public async Task<IActionResult> SaveData([FromBody] Sumur request)
        {
            if (request == null) return BadRequest("Invalid data");

            await _sumur.InsertOneAsync(request);
            return Ok(new { message = "Data inserted", data = request });
        }

        // GET api/pe/well/fetch
        [HttpGet("fetch")]
        public async Task<IActionResult> FetchFromThingSpeak(
            [FromQuery] string channelId,
            [FromQuery] string apiKey,
            [FromQuery] string wellName)
        {
            if (string.IsNullOrEmpty(channelId) || string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(wellName))
            {
                return BadRequest(new { message = "channelId, apiKey, dan wellName wajib diisi" });
            }

            try
            {
                using (var httpClient = new HttpClient())
                {
                    var url = $"https://api.thingspeak.com/channels/{channelId}/fields/1.json?api_key={apiKey}&results=100";
                    var response = await httpClient.GetStringAsync(url);
                    var json = JObject.Parse(response);
                    var feeds = json["feeds"];

                    if (feeds == null || !feeds.Any())
                        return BadRequest(new { message = "Tidak ada data dari ThingSpeak" });

                    var list = new List<Sumur>();

                    foreach (var f in feeds)
                    {
                        list.Add(new Sumur
                        {
                            wellName = wellName,
                            Current = double.TryParse((string)f["field1"], out double val) ? val : 0,
                            Timestamp = DateTime.TryParse((string)f["created_at"], out DateTime ts) ? ts : DateTime.UtcNow
                        });
                    }

                    // simpan ke TMP collection
                    var tmp = new SumurTmp
                    {
                        items = list.ToArray(),
                        error_count = 0
                    };

                    await _sumur_tmp.InsertOneAsync(tmp);

                    return Ok(new
                    {
                        message = $"Data fetched untuk {wellName}",
                        tmp_id = tmp._id,
                        count = list.Count,
                        feeds = feeds,
                    });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize("PeSumur Read")]
        [HttpGet]
        public IActionResult Get(String sort = "date", String order = "desc", int page = 0, int pagesize = 50, String filter = "", String columnfilter = "", string mode = "")
        {

            //var _items = _tickets.Find(t => true);
            FilterDefinition<Sumur> xfilter = Builders<Sumur>.Filter.Ne("a", "b");
            FilterDefinition<Sumur> xcolfilter;

            if (!String.IsNullOrWhiteSpace(filter))
            {
                filter = filter.ToLower();
                xfilter =
                    Builders<Sumur>.Filter.Regex(t => t.date, new BsonRegularExpression(filter, "i")) |
                    Builders<Sumur>.Filter.Regex(t => t.wellName, new BsonRegularExpression(filter, "i")) |
                    Builders<Sumur>.Filter.Regex(t => t.entry_id, new BsonRegularExpression(filter, "i")) |
                    Builders<Sumur>.Filter.Regex(t => t.field_1, new BsonRegularExpression(filter, "i")) |
                    Builders<Sumur>.Filter.Regex(t => t.field_2, new BsonRegularExpression(filter, "i"));

            }

            if (!String.IsNullOrWhiteSpace(columnfilter))
            {
                xcolfilter = Builders<Sumur>.Filter.Ne("a", "b");
                SumurList colfilter = JsonConvert.DeserializeObject<SumurList>(columnfilter);

                if (colfilter.date?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Sumur>.Filter.Or(colfilter.date.ToList().Select(c => (c is DateTime) ? Builders<Sumur>.Filter.Eq(t => t.date, new BsonDateTime((DateTime)c)) : "{$expr:{$regexMatch:{input:{$dateToString:{format:\"%d %m %Y\",date:\"$date\",timezone:\"" + TimeZoneInfo.Local.DisplayName.Substring(4, 6) + "\"}},regex:/" + ReplaceMonth((string)c) + "/i}}}"));
                if (colfilter.wellName?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Sumur>.Filter.Or(colfilter.wellName.ToList().Where(c => !(c is JObject)).Select(c => Builders<Sumur>.Filter.Regex(t => t.wellName, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.entry_id?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Sumur>.Filter.Or(colfilter.entry_id.ToList().Where(c => !(c is JObject)).Select(c => Builders<Sumur>.Filter.Eq(t => t.entry_id, Convert.ToDecimal(c))));
                if (colfilter.field_1?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Sumur>.Filter.Or(colfilter.field_1.ToList().Where(c => !(c is JObject)).Select(c => Builders<Sumur>.Filter.Eq(t => t.field_1, Convert.ToDecimal(c))));
                if (colfilter.field_2?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Sumur>.Filter.Or(colfilter.field_2.ToList().Where(c => !(c is JObject)).Select(c => Builders<Sumur>.Filter.Eq(t => t.field_2, Convert.ToDecimal(c))));

                foreach (string log in DailyCommon._logical)
                {
                    if (colfilter.date?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.date.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[\"$date\",ISODate(\"{1}\")]}}", ((JObject)c).GetValue("opr"), DateTime.Parse(((JObject)c).GetValue("val").ToString()).ToString("yyyy-MM-ddTHH:mm:ssZ"))).ToArray()), log);
                    if (colfilter.wellName?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.wellName.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$wellName\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.entry_id?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.entry_id.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$entry_id\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.field_1?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.field_1.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$field_1\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.field_2?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.field_2.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$field_2\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);

                }

                xfilter = xfilter & xcolfilter;
            }

            var _items = _sumur.Find(xfilter, new FindOptions() { Collation = new Collation("en_US", numericOrdering: true) });

            switch (sort)
            {
                case "date": _items = (order == "asc") ? _items.SortBy(t => t.date) : _items.SortByDescending(t => t.date); break;
                case "wellName": _items = (order == "asc") ? _items.SortBy(t => t.wellName) : _items.SortByDescending(t => t.wellName); break;
                case "entry_id": _items = (order == "asc") ? _items.SortBy(t => t.entry_id) : _items.SortByDescending(t => t.entry_id); break;
                case "field_1": _items = (order == "asc") ? _items.SortBy(t => t.field_1) : _items.SortByDescending(t => t.field_1); break;
                case "field_2": _items = (order == "asc") ? _items.SortBy(t => t.field_2) : _items.SortByDescending(t => t.field_2); break;
            }

            switch (mode)
            {
                case "":
                case null:
                    // total_count hanya dibutuhkan untuk mode tabel. Untuk mode xfilter
                    // (distinct) di bawah, hitungan ini tidak dipakai sehingga dilewati
                    // agar filter nama sumur tidak melakukan full collection scan.
                    var total_count = _items.CountDocuments();
                    List<Sumur> items = _items
                    .Skip(page * pagesize)
                    .Limit(pagesize)
                    .Project<Sumur>(_fields).ToList();

                    return new JsonResult(new
                    {
                        total_count = total_count,
                        incomplete_result = false,
                        items = items,
                    })
                    {
                        StatusCode = StatusCodes.Status200OK
                    };

                case "excel":
                    return GetExcel(_items
                    //.Limit(10000)
                    .Project<Sumur>(_fields).ToList());

                default:
                    dynamic res;
                    switch (mode)
                    {
                        case "wellName":
                        case "well":
                        case "esp":
                            res = _sumur.Distinct<string>(mode, xfilter).ToEnumerable().OrderBy(t => t).ToList();
                            break;
                        case "date":
                            res = _sumur.Distinct<DateTime?>(mode, xfilter).ToEnumerable().OrderByDescending(t => t).ToList();
                            break;
                        default:
                            res = _sumur.Distinct<decimal?>(mode, xfilter).ToEnumerable().OrderBy(t => t).ToList();
                            break;
                    }

                    return new JsonResult(new
                    {
                        //total_count = res.Count(),
                        items = res,
                    });
            }

        }

        private string ReplaceMonth(string str)
        {
            str = str.ToLower();
            for (var m = 1; m <= 12; m++)
            {
                string monthName = CultureInfo.CurrentCulture.DateTimeFormat.GetAbbreviatedMonthName(m).ToLower();
                if (str.IndexOf(monthName) != -1 && str.Trim() != monthName)
                {
                    str = str.Replace(monthName, m.ToString().PadLeft(2, '0'));
                    break;
                }
            }
            return str;
        }

        public ActionResult GetExcel(List<Sumur> items)
        {
            var workbook = new ExcelPackage();
            var ws = workbook.Workbook.Worksheets.Add("Sumur");
            ws.Cells[1, 1].Value = "Date";
            ws.Cells[1, 2].Value = "Well Name";
            ws.Cells[1, 3].Value = "Entry ID";
            ws.Cells[1, 4].Value = "Field 1";
            ws.Cells[1, 5].Value = "Field 2";

            ws.Cells[1, 1, 1, 5].Style.Font.Bold = true;
            ws.Cells[1, 1, 1, 5].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            ws.Cells[1, 1, 1, 5].Style.VerticalAlignment = ExcelVerticalAlignment.Top;

            for (int c = 1; c <= 5; c++)
            {
                //ws.Column(c).AutoFit();
            }

            for (int i = 0; i < items.Count(); i++)
            {
                var t = items.ElementAt(i);
                ws.Cells[2 + i, 1].Style.Numberformat.Format = "d-MMM-yy";
                ws.Cells[2 + i, 1].Value = t.date.HasValue ? t.date.Value.ToLocalTime().ToOADate() : (double?)null;
                ws.Cells[2 + i, 2].Value = t.wellName;
                ws.Cells[2 + i, 3].Value = t.entry_id;
                ws.Cells[2 + i, 4].Value = t.field_1;
                ws.Cells[2 + i, 5].Value = t.field_2;
            }

            MemoryStream memoryStream = new MemoryStream(workbook.GetAsByteArray());
            memoryStream.Position = 0;
            return File(memoryStream, "application/vnd.ms-excel", "Sumur.xlsx");
        }

        [Authorize("PeSumur Add")]
        [HttpPost("UploadFiles"), DisableRequestSizeLimit]
        public async Task<IActionResult> Post(List<IFormFile> files, [FromForm] string wellName)
        {
            if (string.IsNullOrWhiteSpace(wellName))
                return BadRequest(new { message = "wellName parameter is required" });

            if (files == null || files.Count == 0)
                return BadRequest(new { message = "No file uploaded" });

            var filePath = Path.Combine(Path.GetTempPath(), Guid.NewGuid() + Path.GetExtension(files[0].FileName));

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await files[0].CopyToAsync(stream);
            }

            // Buat TMP record dulu
            SumurTmp tmp = new SumurTmp
            {
                status = "processing",
                message = "Processing started",
                error_count = 0,
                item_count = 0,
                upload_date = DateTime.Now,
                wellName = wellName,
            };
            _sumur_tmp.InsertOne(tmp);

            // Queue background processing
            var tmpId = tmp._id;
            var sumur = _sumur;
            var sumur_tmp = _sumur_tmp;
            var sumur_tmp_items = _sumur_tmp_items;

            _taskQueue.QueueBackgroundWorkItem(async token =>
            {
                try
                {
                    await Task.Run(() => ProcessExcel(filePath, tmpId, wellName, sumur, sumur_tmp, sumur_tmp_items), token);
                }
                catch (Exception ex)
                {
                    sumur_tmp.UpdateOne(
                        t => t._id == tmpId,
                        Builders<SumurTmp>.Update
                            .Set(t => t.status, "failed")
                            .Set(t => t.message, ex.Message)
                    );
                }
            });

            return Ok(new
            {
                _id = tmp._id,
                status = "processing",
                message = "File uploaded. Processing in background."
            });
        }

        [Authorize("PeSumur Add")]
        [HttpGet("UploadStatus")]
        public ActionResult GetUploadStatus(string _id)
        {
            try
            {
                var tmp = _sumur_tmp.Find(t => t._id == _id).FirstOrDefault();

                if (tmp == null)
                    return NotFound(new { message = "Upload not found" });

                return Ok(new
                {
                    _id = tmp._id,
                    status = tmp.status,
                    message = tmp.message,
                    error_count = tmp.error_count,
                    item_count = tmp.item_count,
                    upload_date = tmp.upload_date
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        private void ProcessExcel(string filePath, string tmpId, string wellName,
            IMongoCollection<Sumur> sumur, IMongoCollection<SumurTmp> sumur_tmp,
            IMongoCollection<SumurTmpItem> sumur_tmp_items)
        {
            var fi = new FileInfo(filePath);
            using (var workbook = new ExcelPackage(fi))
            {
                var ws = workbook.Workbook.Worksheets.First();
                int rowCount = ws.Dimension.End.Row;
                int colCount = ws.Dimension.End.Column;

                sumur_tmp.UpdateOne(t => t._id == tmpId,
                    Builders<SumurTmp>.Update.Set(t => t.message, $"Reading {rowCount - 1} rows from Excel..."));

                // Baca semua cells sekaligus ke array 2D — jauh lebih cepat dari akses cell satu-satu
                var cellValues = (object[,])ws.Cells[1, 1, rowCount, Math.Max(colCount, 4)].Value;

                var items = new List<SumurTmpItem>(rowCount);
                var scannedDates = new List<DateTime?>(rowCount);
                int error_count = 0;

                for (var r = 2; r <= rowCount; r++)
                {
                    var c1 = cellValues[r - 1, 0]; // date
                    var c2 = cellValues[r - 1, 1]; // entry_id
                    if (c1 == null && c2 == null) continue;

                    var _row = new SumurTmpItem { wellName = wellName, tmp_id = tmpId };
                    var _row_error = new SumurError();
                    int last_error_count = error_count;

                    // --- Date (col 1) ---
                    var dateRaw = c1;
                    var dateStr = dateRaw?.ToString().Trim();
                    if (!string.IsNullOrWhiteSpace(dateStr))
                    {
                        try
                        {
                            DateTime parsedDate;
                            if (dateRaw is DateTime)
                                parsedDate = (DateTime)dateRaw;
                            else if (dateRaw is string)
                                parsedDate = DateTime.Parse(dateStr);
                            else
                                parsedDate = DateTime.FromOADate(Convert.ToDouble(dateRaw));
                            _row.date = parsedDate;
                            scannedDates.Add(_row.date);
                        }
                        catch (Exception e)
                        {
                            _row_error.date = new ErrorItem { value = dateStr, message = e.Message };
                            error_count++;
                        }
                    }
                    else
                    {
                        _row_error.date = new ErrorItem { value = "(Blank)", message = "Blank date is not allowed" };
                        error_count++;
                    }

                    // --- Decimals (col 2,3,4) ---
                    _row.entry_id = ParseDecimal(cellValues[r - 1, 1], ref _row_error, nameof(_row_error.entry_id), ref error_count);
                    _row.field_1 = ParseDecimal(cellValues[r - 1, 2], ref _row_error, nameof(_row_error.field_1), ref error_count);
                    _row.field_2 = ParseDecimal(cellValues[r - 1, 3], ref _row_error, nameof(_row_error.field_2), ref error_count);

                    if (error_count > last_error_count)
                        _row_error._row = new ErrorItem { value = "error", message = "Error found" };

                    _row._error = _row_error;
                    items.Add(_row);
                }

                // Bebaskan memory array 2D setelah selesai parsing
                cellValues = null;

                // ── 1x query MongoDB untuk cek existing (batch) ──
                sumur_tmp.UpdateOne(t => t._id == tmpId,
                    Builders<SumurTmp>.Update.Set(t => t.message, $"Checking {items.Count} rows against existing data..."));

                if (scannedDates.Count > 0)
                {
                    var minDate = scannedDates.Min();
                    var maxDate = scannedDates.Max();
                    var existingKeys = new HashSet<string>(
                        sumur.Find(t => t.wellName == wellName && t.date >= minDate && t.date <= maxDate)
                             .Project<Sumur>(Builders<Sumur>.Projection.Include(t => t.date))
                             .ToEnumerable()
                             .Where(d => d.date.HasValue)
                             .Select(d => d.date.Value.ToString("yyyy-MM-dd"))
                    );
                    foreach (var item in items)
                        if (item._error?.date == null && item.date.HasValue)
                            if (existingKeys.Contains(item.date.Value.ToString("yyyy-MM-dd")))
                                item._error._row = new ErrorItem { value = "warning", message = "Existing row found, data will be replaced" };
                }

                // ── InsertMany ke collection terpisah per batch ──
                // Update status tiap 50k agar tidak terlalu banyak round-trip ke MongoDB
                const int BATCH = 10000;
                const int UPDATE_EVERY = 50000;
                int processed = 0;
                int nextUpdate = UPDATE_EVERY;

                for (int i = 0; i < items.Count; i += BATCH)
                {
                    int len = Math.Min(BATCH, items.Count - i);
                    sumur_tmp_items.InsertMany(items.GetRange(i, len));
                    processed += len;

                    if (processed >= nextUpdate || processed == items.Count)
                    {
                        sumur_tmp.UpdateOne(t => t._id == tmpId,
                            Builders<SumurTmp>.Update
                                .Set(t => t.item_count, processed)
                                .Set(t => t.message, $"Storing... {processed:N0}/{items.Count:N0}"));
                        nextUpdate += UPDATE_EVERY;
                    }
                }

                sumur_tmp.UpdateOne(t => t._id == tmpId,
                    Builders<SumurTmp>.Update
                        .Set(t => t.status, "done")
                        .Set(t => t.error_count, error_count)
                        .Set(t => t.item_count, items.Count)
                        .Set(t => t.message, $"Done. {items.Count:N0} rows, {error_count} error(s)."));

            } // end using workbook

            System.IO.File.Delete(filePath);
        }

        // Helper: parse decimal tanpa reflection (lebih cepat 10x)
        private decimal? ParseDecimal(object raw, ref SumurError err, string field, ref int error_count)
        {
            var str = raw?.ToString().Trim();
            if (string.IsNullOrWhiteSpace(str)) return null;
            if (decimal.TryParse(str, NumberStyles.Any, CultureInfo.InvariantCulture, out var val)) return val;

            var errProp = typeof(SumurError).GetProperty(field);
            errProp?.SetValue(err, new ErrorItem { value = str, message = "Invalid decimal value" });
            error_count++;
            return null;
        }

        [Authorize("PeSumur Add")]
        [HttpGet("Tmp")]
        public ActionResult GetTmp(string _id, String sort = "date", String order = "desc", int page = 0, int pagesize = 50, String filter = "", String columnfilter = "", string mode = "")
        {
            SumurTmp _tmp = _sumur_tmp.Find(t => t._id == _id).FirstOrDefault();
            if (_tmp == null) return BadRequest();

            // Baca dari collection terpisah
            var filterDef = Builders<SumurTmpItem>.Filter.Eq(t => t.tmp_id, _id);
            if (mode == "error")
                filterDef = filterDef & Builders<SumurTmpItem>.Filter.Eq("_error._row.value", "error");
            else if (mode == "warning")
                filterDef = filterDef & Builders<SumurTmpItem>.Filter.Eq("_error._row.value", "warning");

            var total_count = _sumur_tmp_items.CountDocuments(filterDef);

            // Sort: error dulu, warning, lalu by date
            SortDefinition<SumurTmpItem> sortDef;
            if (mode == "all" || string.IsNullOrEmpty(mode))
                sortDef = Builders<SumurTmpItem>.Sort
                    .Descending("_error._row.value")  // "error" > "warning" secara alphabetical desc
                    .Ascending(t => t.date);
            else
                sortDef = Builders<SumurTmpItem>.Sort.Ascending(t => t.date);

            var items = _sumur_tmp_items.Find(filterDef)
                .Sort(sortDef)
                .Skip(page * pagesize)
                .Limit(pagesize)
                .ToList()
                .Cast<Sumur>()
                .ToList();

            return new JsonResult(new
            {
                total_count = total_count,
                error_count = _tmp.error_count,
                incomplete_result = false,
                items = items,
            })
            { StatusCode = StatusCodes.Status200OK };
        }

        [Authorize("PeSumur Add")]
        [HttpGet("SaveData")]
        public ActionResult SaveData(string _id, string wellName)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(wellName))
                    return BadRequest(new { message = "wellName parameter is required" });

                SumurTmp _tmp = _sumur_tmp.Find(t => t._id == _id).FirstOrDefault();
                if (_tmp == null || _tmp.error_count > 0)
                    return BadRequest(new { message = _tmp == null ? "Tmp not found" : "Cannot save data with errors" });

                DateTime now = DateTime.Now;
                string currentUser = User.Identity.Name;

                // [1] Load semua item dari tmp collection
                var allItems = _sumur_tmp_items.Find(t => t.tmp_id == _id).ToList();

                // [2] 1x query cek date yang sudah ada di sumur
                var allDates = allItems.Where(x => x.date.HasValue).Select(x => x.date.Value).ToList();
                var existingKeys = new HashSet<string>();
                if (allDates.Count > 0)
                {
                    existingKeys = new HashSet<string>(
                        _sumur.Find(t => t.wellName == wellName && t.date >= allDates.Min() && t.date <= allDates.Max())
                              .Project<Sumur>(Builders<Sumur>.Projection.Include(t => t.date))
                              .ToEnumerable()
                              .Where(d => d.date.HasValue)
                              .Select(d => d.date.Value.ToString("yyyy-MM-ddTHH:mm:ss"))
                    );
                }

                // [3] Konversi semua item ke Sumur (insert-ready), catat mana yang existing
                int modified_count = 0;
                var toInsert = new List<Sumur>(allItems.Count);
                var toReplace = new List<DateTime>(); // date yang perlu di-delete dulu
                foreach (var item in allItems)
                {
                    var key = item.date.HasValue ? item.date.Value.ToString("yyyy-MM-ddTHH:mm:ss") : null;
                    if (key != null && existingKeys.Contains(key))
                    {
                        toReplace.Add(item.date.Value);
                        modified_count++;
                    }
                    toInsert.Add(new Sumur
                    {
                        date = item.date,
                        entry_id = item.entry_id,
                        field_1 = item.field_1,
                        field_2 = item.field_2,
                        wellName = wellName,
                        Current = item.Current,
                        Timestamp = item.Timestamp,
                        created_by = currentUser,
                        created_date = now,
                        updated_by = currentUser,
                        updated_date = now,
                    });
                }

                // [4] DeleteMany untuk existing rows — 1x operasi, jauh lebih cepat dari UpdateOne per row
                if (toReplace.Count > 0)
                    _sumur.DeleteMany(t => t.wellName == wellName && toReplace.Contains(t.date.Value));

                // [5] InsertMany semua — baik data baru maupun yang replace
                const int BATCH = 10000;
                for (int i = 0; i < toInsert.Count; i += BATCH)
                    _sumur.InsertMany(toInsert.GetRange(i, Math.Min(BATCH, toInsert.Count - i)),
                        new InsertManyOptions { IsOrdered = false });

                // [6] Cleanup tmp
                _sumur_tmp_items.DeleteMany(t => t.tmp_id == _id);
                _sumur_tmp.DeleteOne(t => t._id == _id);

                return Ok(new
                {
                    created_count = allItems.Count - modified_count,
                    modified_count = modified_count,
                    total_count = allItems.Count
                });
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message });
            }
        }

        [Authorize("PeSumur Delete")]
        [HttpDelete]
        public ActionResult Delete(string[] _ids)
        {
            try
            {
                long deleted_count = 0;
                long total_count = _ids.Length;
                foreach (string _id in _ids)
                {
                    DeleteResult res = _sumur.DeleteOne(t => t._id == _id);
                    deleted_count += res.DeletedCount;
                }
                return Ok(new
                {
                    deleted_count = deleted_count,
                    total_count = total_count
                });
            }
            catch (MongoException e)
            {
                return BadRequest();
            }
        }
    }
}
