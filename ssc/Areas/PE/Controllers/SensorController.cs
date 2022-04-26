using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
    public class SensorController : ControllerBase
    {
        private IMongoDatabase database;
        private readonly IMongoCollection<Sensor> _sensor;
        private readonly IMongoCollection<SensorTmp> _sensor_tmp;
        private ProjectionDefinition<Sensor> _fields;

        public SensorController(IPEDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            database = client.GetDatabase("pe");

            _sensor = database.GetCollection<Sensor>("sensor");
            _sensor_tmp = database.GetCollection<SensorTmp>("sensor_tmp");
            _fields = Builders<Sensor>.Projection
                .Include(t => t.date)
                .Include(t => t.well)
                .Include(t => t.freq)
                .Include(t => t.load)
                .Include(t => t.pi)
                .Include(t => t.ti)
                .Include(t => t.esp)
                .Include(t => t.capacity);
        }

        [Authorize("PeSensor Read")]
        [HttpGet]
        public ActionResult Get(String sort = "date", String order = "desc", int page = 0, int pagesize = 50, String filter = "", String columnfilter = "", string mode = "")
        {

            //var _items = _tickets.Find(t => true);
            FilterDefinition<Sensor> xfilter = Builders<Sensor>.Filter.Ne("a", "b");
            FilterDefinition<Sensor> xcolfilter;

            if (!String.IsNullOrWhiteSpace(filter))
            {
                filter = filter.ToLower();
                xfilter =
                    Builders<Sensor>.Filter.Regex(t => t.date, new BsonRegularExpression(filter, "i")) |
                    Builders<Sensor>.Filter.Regex(t => t.well, new BsonRegularExpression(filter, "i")) |
                    Builders<Sensor>.Filter.Regex(t => t.freq, new BsonRegularExpression(filter, "i")) |
                    Builders<Sensor>.Filter.Regex(t => t.load, new BsonRegularExpression(filter, "i")) |
                    Builders<Sensor>.Filter.Regex(t => t.pi, new BsonRegularExpression(filter, "i")) |
                    Builders<Sensor>.Filter.Regex(t => t.ti, new BsonRegularExpression(filter, "i"));
            }

            if (!String.IsNullOrWhiteSpace(columnfilter))
            {
                xcolfilter = Builders<Sensor>.Filter.Ne("a", "b");
                SensorList colfilter = JsonConvert.DeserializeObject<SensorList>(columnfilter);

                if (colfilter.date?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Sensor>.Filter.Or(colfilter.date.ToList().Select(c => (c is DateTime) ? Builders<Sensor>.Filter.Eq(t => t.date, new BsonDateTime((DateTime)c)) : "{$expr:{$regexMatch:{input:{$dateToString:{format:\"%d %m %Y\",date:\"$date\",timezone:\"" + TimeZoneInfo.Local.DisplayName.Substring(4, 6) + "\"}},regex:/" + ReplaceMonth((string)c) + "/i}}}"));
                if (colfilter.well?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Sensor>.Filter.Or(colfilter.well.ToList().Where(c => !(c is JObject)).Select(c => Builders<Sensor>.Filter.Regex(t => t.well, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.freq?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Sensor>.Filter.Or(colfilter.freq.ToList().Where(c => !(c is JObject)).Select(c => Builders<Sensor>.Filter.Eq(t => t.freq, Convert.ToDecimal(c))));
                if (colfilter.load?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Sensor>.Filter.Or(colfilter.load.ToList().Where(c => !(c is JObject)).Select(c => Builders<Sensor>.Filter.Eq(t => t.load, Convert.ToDecimal(c))));
                if (colfilter.pi?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Sensor>.Filter.Or(colfilter.pi.ToList().Where(c => !(c is JObject)).Select(c => Builders<Sensor>.Filter.Eq(t => t.pi, Convert.ToDecimal(c))));
                if (colfilter.ti?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Sensor>.Filter.Or(colfilter.ti.ToList().Where(c => !(c is JObject)).Select(c => Builders<Sensor>.Filter.Eq(t => t.ti, Convert.ToDecimal(c))));
                if (colfilter.esp?.Length > 0) xcolfilter = xcolfilter & Builders<Sensor>.Filter.Or(colfilter.esp.ToList().Select(c => Builders<Sensor>.Filter.Regex(t => t.esp, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.capacity?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Sensor>.Filter.Or(colfilter.capacity.ToList().Where(c => !(c is JObject)).Select(c => Builders<Sensor>.Filter.Eq(t => t.capacity, Convert.ToDecimal(c))));

                foreach (string log in DailyCommon._logical)
                {
                    if (colfilter.date?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.date.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[\"$date\",ISODate(\"{1}\")]}}", ((JObject)c).GetValue("opr"), DateTime.Parse(((JObject)c).GetValue("val").ToString()).ToString("yyyy-MM-ddTHH:mm:ssZ"))).ToArray()), log);
                    if (colfilter.well?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.well.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$well\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.freq?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.freq.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$freq\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.load?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.load.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$load\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.pi?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.pi.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$pi\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.ti?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.ti.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$ti\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.capacity?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.capacity.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$capacity\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                }

                xfilter = xfilter & xcolfilter;
            }

            var _items = _sensor.Find(xfilter, new FindOptions() { Collation = new Collation("en_US", numericOrdering: true) });
            var total_count = _items.CountDocuments();

            switch (sort)
            {
                case "date": _items = (order == "asc") ? _items.SortBy(t => t.date) : _items.SortByDescending(t => t.date); break;
                case "well": _items = (order == "asc") ? _items.SortBy(t => t.well) : _items.SortByDescending(t => t.well); break;
                case "freq": _items = (order == "asc") ? _items.SortBy(t => t.freq) : _items.SortByDescending(t => t.freq); break;
                case "load": _items = (order == "asc") ? _items.SortBy(t => t.load) : _items.SortByDescending(t => t.load); break;
                case "pi": _items = (order == "asc") ? _items.SortBy(t => t.pi) : _items.SortByDescending(t => t.pi); break;
                case "ti": _items = (order == "asc") ? _items.SortBy(t => t.ti) : _items.SortByDescending(t => t.ti); break;
                case "esp": _items = (order == "asc") ? _items.SortBy(t => t.esp) : _items.SortByDescending(t => t.ti); break;
                case "capacity": _items = (order == "asc") ? _items.SortBy(t => t.capacity) : _items.SortByDescending(t => t.ti); break;
            }

            switch (mode)
            {
                case "":
                case null:
                    List<Sensor> items = _items
                    .Skip(page * pagesize)
                    .Limit(pagesize)
                    .Project<Sensor>(_fields).ToList();

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
                    .Project<Sensor>(_fields).ToList());

                default:
                    dynamic res;
                    switch (mode)
                    {
                        case "well":
                        case "esp":
                            res = _sensor.Distinct<string>(mode, xfilter).ToEnumerable().OrderBy(t => t).ToList();
                            break;
                        case "date":
                            res = _sensor.Distinct<DateTime?>(mode, xfilter).ToEnumerable().OrderByDescending(t => t).ToList();
                            break;
                        default:
                            res = _sensor.Distinct<decimal?>(mode, xfilter).ToEnumerable().OrderBy(t => t).ToList();
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

        public ActionResult GetExcel(List<Sensor> items)
        {
            var workbook = new ExcelPackage();
            var ws = workbook.Workbook.Worksheets.Add("Sensor");
            ws.Cells[1, 1].Value = "Date";
            ws.Cells[1, 2].Value = "Well";
            ws.Cells[1, 3].Value = "Freq (Hz)";
            ws.Cells[1, 4].Value = "Load (A)";
            ws.Cells[1, 5].Value = "PI (psi)";
            ws.Cells[1, 6].Value = "TI (F)";
            ws.Cells[1, 7].Value = "ESP";
            ws.Cells[1, 8].Value = "Capacity";

            ws.Cells[1, 1, 1, 8].Style.Font.Bold = true;
            ws.Cells[1, 1, 1, 8].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            ws.Cells[1, 1, 1, 8].Style.VerticalAlignment = ExcelVerticalAlignment.Top;

            for (int c = 1; c <= 6; c++)
            {
                //ws.Column(c).AutoFit();
            }

            for (int i = 0; i < items.Count(); i++)
            {
                var t = items.ElementAt(i);
                ws.Cells[2 + i, 1].Style.Numberformat.Format = "d-MMM-yy";
                ws.Cells[2 + i, 1].Value = t.date.HasValue ? t.date.Value.ToLocalTime().ToOADate() : (double?)null;
                ws.Cells[2 + i, 2].Value = t.well;
                ws.Cells[2 + i, 3].Value = t.freq;
                ws.Cells[2 + i, 4].Value = t.load;
                ws.Cells[2 + i, 5].Value = t.pi;
                ws.Cells[2 + i, 6].Value = t.ti;
                ws.Cells[2 + i, 7].Value = t.esp;
                ws.Cells[2 + i, 8].Value = t.capacity;
            }

            MemoryStream memoryStream = new MemoryStream(workbook.GetAsByteArray());
            memoryStream.Position = 0;
            return File(memoryStream, "application/vnd.ms-excel", "Sensor.xlsx");
        }

        [Authorize("PeSensor Add")]
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

            List<Sensor> items = new List<Sensor>();
            int error_count = 0;

            for (var r = 2; r <= rowCount; r++)
            {
                if (!string.IsNullOrWhiteSpace(ws.Cells[r, 1].Value?.ToString()))
                {
                    Sensor _row = new Sensor();
                    SensorError _row_error = new SensorError();
                    int last_error_count = error_count;

                    if (!String.IsNullOrWhiteSpace(ws.Cells[r, 1].Value?.ToString()))
                    {
                        try
                        {
                            if(ws.Cells[r, 1].Value.GetType() == DateTime.Now.GetType())
                            {
                                _row.date = (DateTime?)ws.Cells[r, 1].Value;
                            } else
                            {
                                _row.date = DateTime.FromOADate(double.Parse(ws.Cells[r, 1].Value?.ToString().Trim()));
                            }
                        }
                        catch (Exception e)
                        {
                            _row_error.date = new ErrorItem { value = ws.Cells[r, 1].Value?.ToString(), message = e.Message };
                            error_count++;
                        }
                    }
                    else
                    {
                        _row_error.date = new ErrorItem { value = "(Blank)", message = "Blank date is not allowed" };
                        error_count++;
                    }

                    if (!String.IsNullOrWhiteSpace(ws.Cells[r, 2].Value?.ToString().Trim()))
                    {
                        _row.well = ws.Cells[r, 2].Value?.ToString().Trim();
                    }
                    else
                    {
                        _row_error.well = new ErrorItem { value = "(Blank)", message = "Blank Well name is not allowed" };
                        error_count++;
                    }

                    try
                    {
                        _row.freq = (!String.IsNullOrWhiteSpace(ws.Cells[r, 3].Value?.ToString())) ? decimal.Parse(ws.Cells[r, 3].Value?.ToString().Trim()) : (decimal?)null;
                    }
                    catch (Exception e)
                    {
                        _row_error.freq = new ErrorItem { value = ws.Cells[r, 3].Value?.ToString(), message = e.Message };
                        error_count++;
                    }

                    try
                    {
                        _row.load = (!String.IsNullOrWhiteSpace(ws.Cells[r, 4].Value?.ToString())) ? decimal.Parse(ws.Cells[r, 4].Value?.ToString().Trim()) : (decimal?)null;
                    }
                    catch (Exception e)
                    {
                        _row_error.load = new ErrorItem { value = ws.Cells[r, 4].Value?.ToString(), message = e.Message };
                        error_count++;
                    }

                    try
                    {
                        _row.pi = (!String.IsNullOrWhiteSpace(ws.Cells[r, 5].Value?.ToString())) ? decimal.Parse(ws.Cells[r, 5].Value?.ToString().Trim()) : (decimal?)null;
                    }
                    catch (Exception e)
                    {
                        _row_error.pi = new ErrorItem { value = ws.Cells[r, 5].Value?.ToString(), message = e.Message };
                        error_count++;
                    }

                    try
                    {
                        _row.ti = (!String.IsNullOrWhiteSpace(ws.Cells[r, 6].Value?.ToString())) ? decimal.Parse(ws.Cells[r, 6].Value?.ToString().Trim()) : (decimal?)null;
                    }
                    catch (Exception e)
                    {
                        _row_error.ti = new ErrorItem { value = ws.Cells[r, 6].Value?.ToString(), message = e.Message };
                        error_count++;
                    }

                    if (!String.IsNullOrWhiteSpace(ws.Cells[r, 7].Value?.ToString().Trim()))
                    {
                        _row.esp = ws.Cells[r, 7].Value?.ToString().Trim();
                    }

                    try
                    {
                        _row.capacity = (!String.IsNullOrWhiteSpace(ws.Cells[r, 8].Value?.ToString())) ? decimal.Parse(ws.Cells[r, 8].Value?.ToString().Trim()) : (decimal?)null;
                    }
                    catch (Exception e)
                    {
                        _row_error.capacity = new ErrorItem { value = ws.Cells[r, 8].Value?.ToString(), message = e.Message };
                        error_count++;
                    }

                    if (_row_error.date == null && _row_error.well == null)
                    {
                        if (_sensor.Find(t => t.date == _row.date && t.well == _row.well).CountDocuments() > 0)
                        {
                            _row_error._row = new ErrorItem { value = "warning", message = "Existing row found, data will be replaced" };
                        }
                    }
                    if (error_count > last_error_count)
                    {
                        _row_error._row = new ErrorItem { value = "error", message = "Error found" };
                    }

                    _row._error = _row_error;

                    items.Add(_row);
                }
            }

            SensorTmp _tmp = new SensorTmp
            {
                error_count = error_count,
                items = items.ToArray()
            };
            _sensor_tmp.InsertOne(_tmp);

            return Ok(new
            {
                _id = _tmp._id,
                //items = items,
                error_count = error_count
            });
        }

        [Authorize("PeSensor Add")]
        [HttpGet("Tmp")]
        public ActionResult GetTmp(string _id, String sort = "date", String order = "desc", int page = 0, int pagesize = 50, String filter = "", String columnfilter = "", string mode = "")
        {
            SensorTmp _tmp = _sensor_tmp.Find(t => t._id == _id).FirstOrDefault();
            List<Sensor> _tmpitems = _tmp.items.ToList();
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
                List<Sensor> items = _tmpitems.ToList().GetRange(page * pagesize, pagesize);
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

        [Authorize("PeSensor Add")]
        [HttpGet("SaveData")]
        public ActionResult SaveData(string _id)
        {
            try
            {
                SensorTmp _tmp = _sensor_tmp.Find(t => t._id == _id).FirstOrDefault();

                if (_tmp == null || _tmp.error_count > 0)
                {
                    throw new Exception();
                }

                List<Sensor> items = _tmp.items.ToList();

                DateTime? min_date = items.Select(m => m.date).Min();
                string[] wells = items.Select(m => m.well).ToArray();

                long modified_count = 0;
                long created_count = items.Count();

                foreach (Sensor item in items)
                {
                    item._error = null;

                    var update = Builders<Sensor>.Update.Set(t => t.date, item.date)
                        .Set(t => t.well, item.well)
                        .Set(t => t.freq, item.freq)
                        .Set(t => t.load, item.load)
                        .Set(t => t.pi, item.pi)
                        .Set(t => t.ti, item.ti)
                        .Set(t => t.esp, item.esp)
                        .Set(t => t.capacity, item.capacity)
                        .Set(t => t.updated_by, User.Identity.Name)
                        .Set(t => t.updated_date, DateTime.Now)
                        .SetOnInsert(t => t.created_by, User.Identity.Name)
                        .SetOnInsert(t => t.created_date, DateTime.Now);

                    UpdateResult res = _sensor.UpdateOne(
                        Builders<Sensor>.Filter.Eq(t => t.date, item.date) & Builders<Sensor>.Filter.Eq(t => t.well, item.well),
                        update, new UpdateOptions() { IsUpsert = true });

                    modified_count += res.ModifiedCount;
                    created_count -= res.ModifiedCount;
                }
                _sensor_tmp.DeleteOne(d => d._id == _id);

                modified_count += DailyCommon.RecalculateFields(min_date, wells, User.Identity.Name);

                return Ok(new
                {
                    modified_count = modified_count,
                    created_count = created_count,
                    total_count = items.Count()
                });
            }
            catch (Exception e)
            {
                return BadRequest();
            }
        }

        [Authorize("PeSensor Delete")]
        [HttpDelete]
        public ActionResult Delete(string[] _ids)
        {
            try
            {
                long deleted_count = 0;
                long total_count = _ids.Length;
                foreach (string _id in _ids)
                {
                    DeleteResult res = _sensor.DeleteOne(t => t._id == _id);
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