using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System.Net.Http;
using MongoDB.Bson;
using Newtonsoft.Json.Linq;
using ssc.Areas.PE.Models;

namespace ssc.Areas.PE.Controllers
{
    [Route("api/pe/[controller]")]
    [ApiController]
    public class SumurController : ControllerBase
    {
        private IMongoDatabase database;
        private readonly IMongoCollection<Sumur> _sumur;
        private readonly IMongoCollection<SumurTmp> _sumur_tmp;
        private readonly ProjectionDefinition<Sumur> _fields;
        private readonly HttpClient _httpClient;

        public SumurController(IPEDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            database = client.GetDatabase("pe");

            _sumur = database.GetCollection<Sumur>("sumur");
            _sumur_tmp = database.GetCollection<SumurTmp>("sumur_tmp");

            // projection field1 yang mau diambil
            _fields = Builders<Sumur>.Projection
                .Include(t => t.date)
                .Include(t => t.entry_id)
                .Include(t => t.field_1)
                .Include(t => t.field_2);
        }

        [Authorize("PeSumur Read")]
        [HttpGet]
        public ActionResult Get(String sort = "date", String order = "desc", int page = 0, int pagesize = 50, String filter = "", String columnfilter = "", string mode = "")
        {

            //var _items = _tickets.Find(t => true);
            FilterDefinition<Sumur> xfilter = Builders<Sumur>.Filter.Ne("a", "b");
            FilterDefinition<Sumur> xcolfilter;

            if (!String.IsNullOrWhiteSpace(filter))
            {
                filter = filter.ToLower();
                xfilter =
                    Builders<Sumur>.Filter.Regex(t => t.date, new BsonRegularExpression(filter, "i")) |
                    Builders<Sumur>.Filter.Regex(t => t.entry_id, new BsonRegularExpression(filter, "i")) |
                    Builders<Sumur>.Filter.Regex(t => t.field_1, new BsonRegularExpression(filter, "i")) |
                    Builders<Sumur>.Filter.Regex(t => t.field_2, new BsonRegularExpression(filter, "i"));

            }

            // if (!String.IsNullOrWhiteSpace(columnfilter))
            // {
            //     xcolfilter = Builders<Sumur>.Filter.Ne("a", "b");
            //     SumurList colfilter = JsonConvert.DeserializeObject<SensorList>(columnfilter);

            //     if (colfilter.date?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Sumur>.Filter.Or(colfilter.date.ToList().Select(c => (c is DateTime) ? Builders<Sumur>.Filter.Eq(t => t.date, new BsonDateTime((DateTime)c)) : "{$expr:{$regexMatch:{input:{$dateToString:{format:\"%d %m %Y\",date:\"$date\",timezone:\"" + TimeZoneInfo.Local.DisplayName.Substring(4, 6) + "\"}},regex:/" + ReplaceMonth((string)c) + "/i}}}"));
            //     // if (colfilter.well?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Sensor>.Filter.Or(colfilter.well.ToList().Where(c => !(c is JObject)).Select(c => Builders<Sensor>.Filter.Regex(t => t.well, new BsonRegularExpression((string)c, "i"))));
            //     if (colfilter.entry_id?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Sumur>.Filter.Or(colfilter.entry_id.ToList().Where(c => !(c is JObject)).Select(c => Builders<Sumur>.Filter.Eq(t => t.entry_id, Convert.ToDecimal(c))));
            //     if (colfilter.field_1?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Sumur>.Filter.Or(colfilter.field_1.ToList().Where(c => !(c is JObject)).Select(c => Builders<Sumur>.Filter.Eq(t => t.field_1, Convert.ToDecimal(c))));
            //     if (colfilter.field_2?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Sumur>.Filter.Or(colfilter.field_2.ToList().Where(c => !(c is JObject)).Select(c => Builders<Sumur>.Filter.Eq(t => t.field_2, Convert.ToDecimal(c))));

            //     foreach (string log in DailyCommon._logical)
            //     {
            //         if (colfilter.date?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.date.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[\"$date\",ISODate(\"{1}\")]}}", ((JObject)c).GetValue("opr"), DateTime.Parse(((JObject)c).GetValue("val").ToString()).ToString("yyyy-MM-ddTHH:mm:ssZ"))).ToArray()), log);
            //         // if (colfilter.well?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.well.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$well\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
            //         if (colfilter.entry_id?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.entry_id.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$entry_id\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
            //         if (colfilter.field_1?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.field_1.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$field_1\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
            //         if (colfilter.field_2?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.field_2.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$field_2\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);

            //     }

            //     xfilter = xfilter & xcolfilter;
            // }

            var _items = _sumur.Find(xfilter, new FindOptions() { Collation = new Collation("en_US", numericOrdering: true) });
            var total_count = _items.CountDocuments();

            switch (sort)
            {
                case "date": _items = (order == "asc") ? _items.SortBy(t => t.date) : _items.SortByDescending(t => t.date); break;
                // case "well": _items = (order == "asc") ? _items.SortBy(t => t.well) : _items.SortByDescending(t => t.well); break;
                case "entry_id": _items = (order == "asc") ? _items.SortBy(t => t.entry_id) : _items.SortByDescending(t => t.entry_id); break;
                case "field_1": _items = (order == "asc") ? _items.SortBy(t => t.field_1) : _items.SortByDescending(t => t.field_1); break;
                case "field_2": _items = (order == "asc") ? _items.SortBy(t => t.field_2) : _items.SortByDescending(t => t.field_2); break;
            }

            switch (mode)
            {
                case "":
                case null:
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

                // case "excel":
                //     return GetExcel(_items
                //     //.Limit(10000)
                //     .Project<Sensor>(_fields).ToList());

                default:
                    dynamic res;
                    switch (mode)
                    {
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

        // public ActionResult GetExcel(List<Sensor> items)
        // {
        //     var workbook = new ExcelPackage();
        //     var ws = workbook.Workbook.Worksheets.Add("Sensor");
        //     ws.Cells[1, 1].Value = "Date";
        //     ws.Cells[1, 2].Value = "Well";
        //     ws.Cells[1, 3].Value = "Freq (Hz)";
        //     ws.Cells[1, 4].Value = "Load (A)";
        //     ws.Cells[1, 5].Value = "PI (psi)";
        //     ws.Cells[1, 6].Value = "TI (F)";
        //     ws.Cells[1, 7].Value = "ESP";
        //     ws.Cells[1, 8].Value = "Capacity";

        //     ws.Cells[1, 1, 1, 8].Style.Font.Bold = true;
        //     ws.Cells[1, 1, 1, 8].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
        //     ws.Cells[1, 1, 1, 8].Style.VerticalAlignment = ExcelVerticalAlignment.Top;

        //     for (int c = 1; c <= 6; c++)
        //     {
        //         //ws.Column(c).AutoFit();
        //     }

        //     for (int i = 0; i < items.Count(); i++)
        //     {
        //         var t = items.ElementAt(i);
        //         ws.Cells[2 + i, 1].Style.Numberformat.Format = "d-MMM-yy";
        //         ws.Cells[2 + i, 1].Value = t.date.HasValue ? t.date.Value.ToLocalTime().ToOADate() : (double?)null;
        //         ws.Cells[2 + i, 2].Value = t.well;
        //         ws.Cells[2 + i, 3].Value = t.freq;
        //         ws.Cells[2 + i, 4].Value = t.load;
        //         ws.Cells[2 + i, 5].Value = t.pi;
        //         ws.Cells[2 + i, 6].Value = t.ti;
        //         ws.Cells[2 + i, 7].Value = t.esp;
        //         ws.Cells[2 + i, 8].Value = t.capacity;
        //     }

        //     MemoryStream memoryStream = new MemoryStream(workbook.GetAsByteArray());
        //     memoryStream.Position = 0;
        //     return File(memoryStream, "application/vnd.ms-excel", "Sensor.xlsx");
        // }

        // [Authorize("PeSumur Add")]
        // [HttpPost("UploadFiles")]
        // public async Task<IActionResult> Post(List<IFormFile> files)
        // {
        //     long size = files.Sum(f => f.Length);

        //     // full path to file in temp location
        //     var filePath = Path.GetTempFileName();

        //     foreach (var formFile in files)
        //     {
        //         if (formFile.Length > 0)
        //         {
        //             using (var stream = new FileStream(filePath, FileMode.Create))
        //             {
        //                 await formFile.CopyToAsync(stream);
        //             }
        //         }
        //     }

        //     var fi = new FileInfo(filePath);
        //     var workbook = new ExcelPackage(fi);
        //     var ws = workbook.Workbook.Worksheets.First();
        //     int rowCount = ws.Dimension.End.Row;

        //     List<Sensor> items = new List<Sensor>();
        //     int error_count = 0;

        //     for (var r = 2; r <= rowCount; r++)
        //     {
        //         if (!string.IsNullOrWhiteSpace(ws.Cells[r, 1].Value?.ToString()))
        //         {
        //             Sensor _row = new Sensor();
        //             SensorError _row_error = new SensorError();
        //             int last_error_count = error_count;

        //             if (!String.IsNullOrWhiteSpace(ws.Cells[r, 1].Value?.ToString()))
        //             {
        //                 try
        //                 {
        //                     if (ws.Cells[r, 1].Value.GetType() == DateTime.Now.GetType())
        //                     {
        //                         _row.date = (DateTime?)ws.Cells[r, 1].Value;
        //                     }
        //                     else
        //                     {
        //                         _row.date = DateTime.FromOADate(double.Parse(ws.Cells[r, 1].Value?.ToString().Trim()));
        //                     }
        //                 }
        //                 catch (Exception e)
        //                 {
        //                     _row_error.date = new ErrorItem { value = ws.Cells[r, 1].Value?.ToString(), message = e.Message };
        //                     error_count++;
        //                 }
        //             }
        //             else
        //             {
        //                 _row_error.date = new ErrorItem { value = "(Blank)", message = "Blank date is not allowed" };
        //                 error_count++;
        //             }

        //             if (!String.IsNullOrWhiteSpace(ws.Cells[r, 2].Value?.ToString().Trim()))
        //             {
        //                 _row.well = ws.Cells[r, 2].Value?.ToString().Trim();
        //             }
        //             else
        //             {
        //                 _row_error.well = new ErrorItem { value = "(Blank)", message = "Blank Well name is not allowed" };
        //                 error_count++;
        //             }

        //             try
        //             {
        //                 _row.freq = (!String.IsNullOrWhiteSpace(ws.Cells[r, 3].Value?.ToString())) ? decimal.Parse(ws.Cells[r, 3].Value?.ToString().Trim()) : (decimal?)null;
        //             }
        //             catch (Exception e)
        //             {
        //                 _row_error.freq = new ErrorItem { value = ws.Cells[r, 3].Value?.ToString(), message = e.Message };
        //                 error_count++;
        //             }

        //             try
        //             {
        //                 _row.load = (!String.IsNullOrWhiteSpace(ws.Cells[r, 4].Value?.ToString())) ? decimal.Parse(ws.Cells[r, 4].Value?.ToString().Trim()) : (decimal?)null;
        //             }
        //             catch (Exception e)
        //             {
        //                 _row_error.load = new ErrorItem { value = ws.Cells[r, 4].Value?.ToString(), message = e.Message };
        //                 error_count++;
        //             }

        //             try
        //             {
        //                 _row.pi = (!String.IsNullOrWhiteSpace(ws.Cells[r, 5].Value?.ToString())) ? decimal.Parse(ws.Cells[r, 5].Value?.ToString().Trim()) : (decimal?)null;
        //             }
        //             catch (Exception e)
        //             {
        //                 _row_error.pi = new ErrorItem { value = ws.Cells[r, 5].Value?.ToString(), message = e.Message };
        //                 error_count++;
        //             }

        //             try
        //             {
        //                 _row.ti = (!String.IsNullOrWhiteSpace(ws.Cells[r, 6].Value?.ToString())) ? decimal.Parse(ws.Cells[r, 6].Value?.ToString().Trim()) : (decimal?)null;
        //             }
        //             catch (Exception e)
        //             {
        //                 _row_error.ti = new ErrorItem { value = ws.Cells[r, 6].Value?.ToString(), message = e.Message };
        //                 error_count++;
        //             }

        //             if (!String.IsNullOrWhiteSpace(ws.Cells[r, 7].Value?.ToString().Trim()))
        //             {
        //                 _row.esp = ws.Cells[r, 7].Value?.ToString().Trim();
        //             }

        //             try
        //             {
        //                 _row.capacity = (!String.IsNullOrWhiteSpace(ws.Cells[r, 8].Value?.ToString())) ? decimal.Parse(ws.Cells[r, 8].Value?.ToString().Trim()) : (decimal?)null;
        //             }
        //             catch (Exception e)
        //             {
        //                 _row_error.capacity = new ErrorItem { value = ws.Cells[r, 8].Value?.ToString(), message = e.Message };
        //                 error_count++;
        //             }

        //             if (_row_error.date == null && _row_error.well == null)
        //             {
        //                 if (_sensor.Find(t => t.date == _row.date && t.well == _row.well).CountDocuments() > 0)
        //                 {
        //                     _row_error._row = new ErrorItem { value = "warning", message = "Existing row found, data will be replaced" };
        //                 }
        //             }
        //             if (error_count > last_error_count)
        //             {
        //                 _row_error._row = new ErrorItem { value = "error", message = "Error found" };
        //             }

        //             _row._error = _row_error;

        //             items.Add(_row);
        //         }
        //     }

        //     SumurTmp _tmp = new SumurTmp
        //     {
        //         error_count = error_count,
        //         items = items.ToArray()
        //     };
        //     _sumur_tmp.InsertOne(_tmp);

        //     return Ok(new
        //     {
        //         _id = _tmp._id,
        //         //items = items,
        //         error_count = error_count
        //     });
        // }

        [Authorize("PeSumur Add")]
        [HttpGet("Tmp")]
        public ActionResult GetTmp(string _id, String sort = "date", String order = "desc", int page = 0, int pagesize = 50, String filter = "", String columnfilter = "", string mode = "")
        {
            SumurTmp _tmp = _sumur_tmp.Find(t => t._id == _id).FirstOrDefault();
            List<Sumur> _tmpitems = _tmp.items.ToList();
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
                List<Sumur> items = _tmpitems.ToList().GetRange(page * pagesize, pagesize);
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

        // [Authorize("PeSumur Add")]
        // [HttpGet("SaveData")]
        // public ActionResult SaveData(string _id)
        // {
        //     try
        //     {
        //         SumurTmp _tmp = _sumur_tmp.Find(t => t._id == _id).FirstOrDefault();

        //         if (_tmp == null || _tmp.error_count > 0)
        //         {
        //             throw new Exception();
        //         }

        //         List<Sumur> items = _tmp.items.ToList();

        //         DateTime? min_date = items.Select(m => m.date).Min();
        //         // string[] wells = items.Select(m => m.well).ToArray();

        //         long modified_count = 0;
        //         long created_count = items.Count();

        //         foreach (Sumur item in items)
        //         {
        //             item._error = null;

        //             var update = Builders<Sensor>.Update.Set(t => t.date, item.date)
        //                 .Set(t => t.well, item.well)
        //                 .Set(t => t.freq, item.freq)
        //                 .Set(t => t.load, item.load)
        //                 .Set(t => t.pi, item.pi)
        //                 .Set(t => t.ti, item.ti)
        //                 .Set(t => t.esp, item.esp)
        //                 .Set(t => t.capacity, item.capacity)
        //                 .Set(t => t.updated_by, User.Identity.Name)
        //                 .Set(t => t.updated_date, DateTime.Now)
        //                 .SetOnInsert(t => t.created_by, User.Identity.Name)
        //                 .SetOnInsert(t => t.created_date, DateTime.Now);

        //             // UpdateResult res = _sumur.UpdateOne(
        //             // Builders<Sumur>.Filter.Eq(t => t.date, item.date) & Builders<Sumur>.Filter.Eq(t => t.well, item.well),
        //             // update, new UpdateOptions() { IsUpsert = true });

        //             // modified_count += res.ModifiedCount;
        //             // created_count -= res.ModifiedCount;
        //         }
        //         _sumur_tmp.DeleteOne(d => d._id == _id);

        //         // modified_count += DailyCommon.RecalculateFields(min_date, wells, User.Identity.Name);

        //         return Ok(new
        //         {
        //             modified_count = modified_count,
        //             created_count = created_count,
        //             total_count = items.Count()
        //         });
        //     }
        //     catch (Exception e)
        //     {
        //         return BadRequest();
        //     }
        // }

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
