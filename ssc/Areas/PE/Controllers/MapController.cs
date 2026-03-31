using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;
using System.Web.Http;
using MongoDB.Driver;
using MongoDB.Bson;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using ssc.Areas.PE.Models;
using System.Globalization;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System.IO;

namespace ssc.Areas.PE.Controllers
{
    [Route("api/pe/[controller]")]
    [ApiController]
    public class MapController : ControllerBase
    {
        private IMongoDatabase database;
        private readonly IMongoCollection<Map> _map;
        private readonly IMongoCollection<MapTmp> _map_tmp;
        private ProjectionDefinition<Map> _fields;


        public MapController(IPEDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            database = client.GetDatabase("pe");

            _map = database.GetCollection<Map>("map");
            _map_tmp = database.GetCollection<MapTmp>("map_tmp");
            _fields = Builders<Map>.Projection
                // .Include(t => t.date)
                .Include(t => t.wellName)
                .Include(t => t.lat)
                .Include(t => t.lng);
        }

        [Authorize("PeMap Read")]
        [HttpGet]
        public ActionResult Get(String sort = "wellName", String order = "desc", int page = 0, int pagesize = 50, String filter = "", String columnfilter = "", string mode = "")
        {

            //var _items = _tickets.Find(t => true);
            FilterDefinition<Map> xfilter = Builders<Map>.Filter.Ne("a", "b");
            FilterDefinition<Map> xcolfilter;

            if (!String.IsNullOrWhiteSpace(filter))
            {
                filter = filter.ToLower();
                xfilter =
                    // Builders<Map>.Filter.Regex(t => t.date, new BsonRegularExpression(filter, "i")) |
                    Builders<Map>.Filter.Regex(t => t.wellName, new BsonRegularExpression(filter, "i")) |
                    Builders<Map>.Filter.Regex(t => t.lat, new BsonRegularExpression(filter, "i")) |
                    Builders<Map>.Filter.Regex(t => t.lng, new BsonRegularExpression(filter, "i"));
            }

            if (!String.IsNullOrWhiteSpace(columnfilter))
            {
                xcolfilter = Builders<Map>.Filter.Ne("a", "b");
                MapList colfilter = JsonConvert.DeserializeObject<MapList>(columnfilter);

                // if (colfilter.date?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Map>.Filter.Or(colfilter.date.ToList().Select(c => (c is DateTime) ? Builders<Map>.Filter.Eq(t => t.date, new BsonDateTime((DateTime)c)) : "{$expr:{$regexMatch:{input:{$dateToString:{format:\"%d %m %Y\",date:\"$date\",timezone:\"" + TimeZoneInfo.Local.DisplayName.Substring(4, 6) + "\"}},regex:/" + ReplaceMonth((string)c) + "/i}}}"));
                if (colfilter.wellName?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Map>.Filter.Or(colfilter.wellName.ToList().Where(c => !(c is JObject)).Select(c => Builders<Map>.Filter.Regex(t => t.wellName, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.lat?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Map>.Filter.Or(colfilter.lat.ToList().Where(c => !(c is JObject)).Select(c => Builders<Map>.Filter.Regex(t => t.lat, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.lng?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Map>.Filter.Or(colfilter.lng.ToList().Where(c => !(c is JObject)).Select(c => Builders<Map>.Filter.Regex(t => t.lng, new BsonRegularExpression((string)c, "i"))));

                foreach (string log in DailyCommon._logical)
                {
                    // if (colfilter.date?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.date.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[\"$date\",ISODate(\"{1}\")]}}", ((JObject)c).GetValue("opr"), DateTime.Parse(((JObject)c).GetValue("val").ToString()).ToString("yyyy-MM-ddTHH:mm:ssZ"))).ToArray()), log);
                    if (colfilter.wellName?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.wellName.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$wellName\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.lat?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.lat.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$lat\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.lng?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.lng.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$lng\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                }

                xfilter = xfilter & xcolfilter;
            }

            var _items = _map.Find(xfilter, new FindOptions() { Collation = new Collation("en_US", numericOrdering: true) });
            var total_count = _items.CountDocuments();

            switch (sort)
            {
                // case "date": _items = (order == "asc") ? _items.SortBy(t => t.date) : _items.SortByDescending(t => t.date); break;
                case "wellName": _items = (order == "asc") ? _items.SortBy(t => t.wellName) : _items.SortByDescending(t => t.wellName); break;
                case "lat": _items = (order == "asc") ? _items.SortBy(t => t.lat) : _items.SortByDescending(t => t.lat); break;
                case "lng": _items = (order == "asc") ? _items.SortBy(t => t.lng) : _items.SortByDescending(t => t.lng); break;
            }

            switch (mode)
            {
                case "":
                case null:
                    List<Map> items = _items
                    .Skip(page * pagesize)
                    .Limit(pagesize)
                    .Project<Map>(_fields).ToList();

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
                    .Project<Map>(_fields).ToList());

                default:
                    dynamic res;
                    switch (mode)
                    {
                        case "well":
                        case "esp":
                            res = _map.Distinct<string>(mode, xfilter).ToEnumerable().OrderBy(t => t).ToList();
                            break;
                        case "date":
                            res = _map.Distinct<DateTime?>(mode, xfilter).ToEnumerable().OrderByDescending(t => t).ToList();
                            break;
                        default:
                            res = _map.Distinct<decimal?>(mode, xfilter).ToEnumerable().OrderBy(t => t).ToList();
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

        public ActionResult GetExcel(List<Map> items)
        {
            var workbook = new ExcelPackage();
            var ws = workbook.Workbook.Worksheets.Add("Map");
            ws.Cells[1, 1].Value = "Nama Sumur";
            ws.Cells[1, 2].Value = "Latitude";
            ws.Cells[1, 3].Value = "Longitude";

            ws.Cells[1, 1, 1, 3].Style.Font.Bold = true;
            ws.Cells[1, 1, 1, 3].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            ws.Cells[1, 1, 1, 3].Style.VerticalAlignment = ExcelVerticalAlignment.Top;

            for (int i = 0; i < items.Count(); i++)
            {
                var t = items.ElementAt(i);
                ws.Cells[2 + i, 1].Value = t.wellName;
                ws.Cells[2 + i, 2].Value = t.lat;
                ws.Cells[2 + i, 3].Value = t.lng;
            }

            MemoryStream memoryStream = new MemoryStream(workbook.GetAsByteArray());
            memoryStream.Position = 0;
            return File(memoryStream, "application/vnd.ms-excel", "Map.xlsx");
        }

        [Authorize("PeMap Add")]
        [HttpPost("UploadFiles")]
        public async Task<IActionResult> Post(List<IFormFile> files)
        {
            long size = files.Sum(f => f.Length);

            // full path to file in temp location
            var filePath = Path.GetTempFileName();

            foreach (var formFile in files)
            {
                if (formFile.Length > 0)
                {
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await formFile.CopyToAsync(stream);
                    }
                }
            }

            var fi = new FileInfo(filePath);
            var workbook = new ExcelPackage(fi);
            var ws = workbook.Workbook.Worksheets.First();
            int rowCount = ws.Dimension.End.Row;

            List<Map> items = new List<Map>();
            int error_count = 0;

            for (var r = 2; r <= rowCount; r++)
            {
                var c1 = ws.Cells[r, 1].Value; // wellName
                var c2 = ws.Cells[r, 2].Value; // lat
                var c3 = ws.Cells[r, 3].Value; // lng

                if (c1 == null && c2 == null && c3 == null) continue;

                Map _row = new Map();
                MapError _row_error = new MapError();
                int last_error_count = error_count;

                // --- wellName (col 1) ---
                var wellNameStr = c1?.ToString().Trim();
                if (!string.IsNullOrWhiteSpace(wellNameStr))
                {
                    _row.wellName = wellNameStr;
                }
                else
                {
                    _row_error.wellName = new ErrorItem { value = "(Blank)", message = "Well name is required" };
                    error_count++;
                }

                // --- Latitude (col 2) ---
                var latStr = c2?.ToString().Trim();
                if (!string.IsNullOrWhiteSpace(latStr))
                {
                    _row.lat = latStr;
                }

                // --- Longitude (col 3) ---
                var lngStr = c3?.ToString().Trim();
                if (!string.IsNullOrWhiteSpace(lngStr))
                {
                    _row.lng = lngStr;
                }

                if (error_count > last_error_count)
                    _row_error._row = new ErrorItem { value = "error", message = "Error found" };

                // Check if well name exists
                if (_row_error.wellName == null && !string.IsNullOrWhiteSpace(_row.wellName))
                {
                    if (_map.Find(t => t.wellName == _row.wellName).CountDocuments() > 0)
                    {
                        _row_error._row = new ErrorItem { value = "warning", message = "Existing row found, data will be replaced" };
                    }
                }

                _row._error = _row_error;
                items.Add(_row);
            }

            MapTmp _tmp = new MapTmp
            {
                error_count = error_count,
                items = items.ToArray()
            };
            _map_tmp.InsertOne(_tmp);

            return Ok(new
            {
                _id = _tmp._id,
                //items = items,
                error_count = error_count
            });
        }

        [Authorize("PeMap Add")]
        [HttpGet("Tmp")]
        public ActionResult GetTmp(string _id, String sort = "date", String order = "desc", int page = 0, int pagesize = 50, String filter = "", String columnfilter = "", string mode = "")
        {
            Console.WriteLine($"_id: {_id}");
            MapTmp _tmp = _map_tmp.Find(t => t._id == _id).FirstOrDefault();
            Console.WriteLine($"_tmp: {(_tmp == null ? "NULL" : "FOUND")}");
            Console.WriteLine($"items count: {_tmp?.items?.Length}");
            List<Map> _tmpitems = _tmp.items != null ? _tmp.items.ToList() : new List<Map>();
            if (mode == "error")
            {
                _tmpitems = _tmpitems.Where(r => r._error._row?.value == "error").ToList();
            }
            else if (mode == "warning")
            {
                _tmpitems = _tmpitems.Where(r => r._error._row?.value == "warning").ToList();
            }
            int total_count = _tmpitems.Count();
            if (pagesize * (page + 1) > total_count) pagesize = total_count - (page * pagesize);

            if (_tmp != null)
            {
                List<Map> items = _tmpitems.ToList().GetRange(page * pagesize, pagesize);
                return new JsonResult(new
                {
                    total_count = total_count,
                    error_count = _tmp.error_count,
                    incomplete_result = false,
                    items = items,
                })
                {
                    StatusCode = StatusCodes.Status200OK
                };
            }
            else
            {
                return BadRequest();
            }



        }

        [Authorize("PeMap Add")]
        [HttpGet("SaveData")]
        public ActionResult SaveData(string _id)
        {
            try
            {
                MapTmp _tmp = _map_tmp.Find(t => t._id == _id).FirstOrDefault();
                if (_tmp == null || _tmp.error_count > 0)
                    return BadRequest(new { message = _tmp == null ? "Tmp not found" : "Cannot save data with errors" });

                DateTime now = DateTime.Now;
                string currentUser = User.Identity.Name;

                List<Map> items = _tmp.items.ToList();

                long modified_count = 0;
                long created_count = 0;

                foreach (Map item in items)
                {
                    var update = Builders<Map>.Update
                        .Set(t => t.wellName, item.wellName)
                        .Set(t => t.lat, item.lat)
                        .Set(t => t.lng, item.lng)
                        .Set(t => t.updated_by, currentUser)
                        .Set(t => t.updated_date, now)
                        .SetOnInsert(t => t.created_by, currentUser)
                        .SetOnInsert(t => t.created_date, now);

                    UpdateResult res = _map.UpdateOne(
                        Builders<Map>.Filter.Eq(t => t.wellName, item.wellName),
                        update,
                        new UpdateOptions() { IsUpsert = true }
                    );

                    modified_count += res.ModifiedCount;
                    if (res.UpsertedId != null)
                        created_count++;
                }

                _map_tmp.DeleteOne(d => d._id == _id);

                return Ok(new
                {
                    modified_count = modified_count,
                    created_count = created_count,
                    total_count = items.Count()

                });

            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message });
            }

        }

        [Authorize("PeMap Delete")]
        [HttpDelete]
        public ActionResult Delete(string[] _ids)
        {
            try
            {
                long deleted_count = 0;
                long total_count = _ids.Length;
                foreach (string _id in _ids)
                {
                    DeleteResult res = _map.DeleteOne(t => t._id == _id);
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
