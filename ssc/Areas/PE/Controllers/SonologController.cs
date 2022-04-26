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
    public class SonologController : ControllerBase
    {
        private IMongoDatabase database;
        private readonly IMongoCollection<Sonolog> _sonolog;
        private readonly IMongoCollection<SonologTmp> _sonolog_tmp;
        private ProjectionDefinition<Sonolog> _fields;

        public SonologController(IPEDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            database = client.GetDatabase("pe");

            _sonolog = database.GetCollection<Sonolog>("sonolog");
            _sonolog_tmp = database.GetCollection<SonologTmp>("sonolog_tmp");
            _fields = Builders<Sonolog>.Projection
                .Include(t => t.date)
                .Include(t => t.well)
                .Include(t => t.pump_intake)
                .Include(t => t.dfl)
                .Include(t => t.cdfl)
                .Include(t => t.sfl)
                .Include(t => t.tglc)
                .Include(t => t.egfl)
                .Include(t => t.al);
        }

        [Authorize("PeSonolog Read")]
        [HttpGet]
        public ActionResult Get(String sort = "date", String order = "desc", int page = 0, int pagesize = 50, String filter = "", String columnfilter = "", string mode = "")
        {

            //var _items = _tickets.Find(t => true);
            FilterDefinition<Sonolog> xfilter = Builders<Sonolog>.Filter.Ne("a", "b");
            FilterDefinition<Sonolog> xcolfilter;

            if (!String.IsNullOrWhiteSpace(filter))
            {
                filter = filter.ToLower();
                xfilter =
                    Builders<Sonolog>.Filter.Regex(t => t.date, new BsonRegularExpression(filter, "i")) |
                    Builders<Sonolog>.Filter.Regex(t => t.well, new BsonRegularExpression(filter, "i")) |
                    Builders<Sonolog>.Filter.Regex(t => t.pump_intake, new BsonRegularExpression(filter, "i")) |
                    Builders<Sonolog>.Filter.Regex(t => t.dfl, new BsonRegularExpression(filter, "i")) |
                    Builders<Sonolog>.Filter.Regex(t => t.cdfl, new BsonRegularExpression(filter, "i")) |
                    Builders<Sonolog>.Filter.Regex(t => t.sfl, new BsonRegularExpression(filter, "i")) |
                    Builders<Sonolog>.Filter.Regex(t => t.tglc, new BsonRegularExpression(filter, "i")) |
                    Builders<Sonolog>.Filter.Regex(t => t.egfl, new BsonRegularExpression(filter, "i")) |
                    Builders<Sonolog>.Filter.Regex(t => t.al, new BsonRegularExpression(filter, "i"));
            }

            if (!String.IsNullOrWhiteSpace(columnfilter))
            {
                xcolfilter = Builders<Sonolog>.Filter.Ne("a", "b");
                SonologList colfilter = JsonConvert.DeserializeObject<SonologList>(columnfilter);
                if (colfilter.date?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Sonolog>.Filter.Or(colfilter.date.ToList().Select(c => (c is DateTime) ? Builders<Sonolog>.Filter.Eq(t => t.date, new BsonDateTime((DateTime)c)) : "{$expr:{$regexMatch:{input:{$dateToString:{format:\"%d %m %Y\",date:\"$date\",timezone:\"" + TimeZoneInfo.Local.DisplayName.Substring(4, 6) + "\"}},regex:/" + ReplaceMonth((string)c) + "/i}}}"));
                if (colfilter.well?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Sonolog>.Filter.Or(colfilter.well.ToList().Where(c => !(c is JObject)).Select(c => Builders<Sonolog>.Filter.Regex(t => t.well, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.pump_intake?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Sonolog>.Filter.Or(colfilter.pump_intake.ToList().Where(c => !(c is JObject)).Select(c => Builders<Sonolog>.Filter.Eq(t => t.pump_intake, Convert.ToDecimal(c))));
                if (colfilter.dfl?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Sonolog>.Filter.Or(colfilter.dfl.ToList().Where(c => !(c is JObject)).Select(c => Builders<Sonolog>.Filter.Eq(t => t.dfl, Convert.ToDecimal(c))));
                if (colfilter.cdfl?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Sonolog>.Filter.Or(colfilter.cdfl.ToList().Where(c => !(c is JObject)).Select(c => Builders<Sonolog>.Filter.Eq(t => t.cdfl, Convert.ToDecimal(c))));
                if (colfilter.sfl?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Sonolog>.Filter.Or(colfilter.sfl.ToList().Where(c => !(c is JObject)).Select(c => Builders<Sonolog>.Filter.Eq(t => t.sfl, Convert.ToDecimal(c))));
                if (colfilter.tglc?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Sonolog>.Filter.Or(colfilter.tglc.ToList().Where(c => !(c is JObject)).Select(c => Builders<Sonolog>.Filter.Eq(t => t.tglc, Convert.ToDecimal(c))));
                if (colfilter.egfl?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Sonolog>.Filter.Or(colfilter.egfl.ToList().Where(c => !(c is JObject)).Select(c => Builders<Sonolog>.Filter.Eq(t => t.egfl, Convert.ToDecimal(c))));
                if (colfilter.al?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Sonolog>.Filter.Or(colfilter.al.ToList().Where(c => !(c is JObject)).Select(c => Builders<Sonolog>.Filter.Eq(t => t.al, Convert.ToDecimal(c))));

                foreach (string log in DailyCommon._logical)
                {
                    if (colfilter.date?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.date.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[\"$date\",ISODate(\"{1}\")]}}", ((JObject)c).GetValue("opr"), DateTime.Parse(((JObject)c).GetValue("val").ToString()).ToString("yyyy-MM-ddTHH:mm:ssZ"))).ToArray()), log);
                    if (colfilter.well?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.well.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$well\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.pump_intake?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.pump_intake.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$pump_intake\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.dfl?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.dfl.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$dfl\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.cdfl?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.cdfl.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$cdfl\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.sfl?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.sfl.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$sfl\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.tglc?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.tglc.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$tglc\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.egfl?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.egfl.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$egfl\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.al?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.al.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$al\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                }

                xfilter = xfilter & xcolfilter;
            }

            var _items = _sonolog.Find(xfilter, new FindOptions() { Collation = new Collation("en_US", numericOrdering: true) });
            var total_count = _items.CountDocuments();

            switch (sort)
            {
                case "date": _items = (order == "asc") ? _items.SortBy(t => t.date) : _items.SortByDescending(t => t.date); break;
                case "well": _items = (order == "asc") ? _items.SortBy(t => t.well) : _items.SortByDescending(t => t.well); break;
                case "pump_intake": _items = (order == "asc") ? _items.SortBy(t => t.pump_intake) : _items.SortByDescending(t => t.pump_intake); break;
                case "dfl": _items = (order == "asc") ? _items.SortBy(t => t.dfl) : _items.SortByDescending(t => t.dfl); break;
                case "cdfl": _items = (order == "asc") ? _items.SortBy(t => t.cdfl) : _items.SortByDescending(t => t.cdfl); break;
                case "sfl": _items = (order == "asc") ? _items.SortBy(t => t.sfl) : _items.SortByDescending(t => t.sfl); break;
                case "tglc": _items = (order == "asc") ? _items.SortBy(t => t.tglc) : _items.SortByDescending(t => t.tglc); break;
                case "egfl": _items = (order == "asc") ? _items.SortBy(t => t.egfl) : _items.SortByDescending(t => t.egfl); break;
                case "al": _items = (order == "asc") ? _items.SortBy(t => t.al) : _items.SortByDescending(t => t.al); break;
            }

            switch (mode)
            {
                case "":
                case null:
                    List<Sonolog> items = _items
                    .Skip(page * pagesize)
                    .Limit(pagesize)
                    .Project<Sonolog>(_fields).ToList();

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
                    .Project<Sonolog>(_fields).ToList());

                default:
                    dynamic res;
                    switch (mode)
                    {
                        case "well":
                            res = _sonolog.Distinct<string>(mode, xfilter).ToEnumerable().OrderBy(t => t).ToList();
                            break;
                        case "date":
                            res = _sonolog.Distinct<DateTime?>(mode, xfilter).ToEnumerable().OrderByDescending(t => t).ToList();
                            break;
                        default:
                            res = _sonolog.Distinct<decimal?>(mode, xfilter).ToEnumerable().OrderBy(t => t).ToList();
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

        public ActionResult GetExcel(List<Sonolog> items)
        {
            var workbook = new ExcelPackage();
            var ws = workbook.Workbook.Worksheets.Add("Sonolog");
            ws.Cells[1, 1].Value = "Date";
            ws.Cells[1, 1, 3, 1].Merge = true;
            ws.Cells[1, 2].Value = "Well";
            ws.Cells[1, 2, 3, 2].Merge = true;
            ws.Cells[1, 3].Value = "Pump Intake";
            ws.Cells[1, 3, 2, 3].Merge = true;
            ws.Cells[3, 3].Value = "meter";

            ws.Cells[1, 4].Value = "Fluid Level";
            ws.Cells[1, 4, 1, 6].Merge = true;
            ws.Cells[2, 4].Value = "Dynamic";
            ws.Cells[3, 4].Value = "meter";
            ws.Cells[2, 5].Value = "Cor. Dynamic";
            ws.Cells[3, 5].Value = "meter";
            ws.Cells[2, 6].Value = "Static";
            ws.Cells[3, 6].Value = "meter";

            ws.Cells[1, 7].Value = "Total Gaseous Liq. Column";
            ws.Cells[1, 7, 2, 7].Merge = true;
            ws.Cells[3, 7].Value = "meter";

            ws.Cells[1, 8].Value = "Equivalent Gas Free Liq";
            ws.Cells[1, 8, 2, 8].Merge = true;
            ws.Cells[3, 8].Value = "meter";

            ws.Cells[1, 9].Value = "Annular Liquid";
            ws.Cells[1, 9, 2, 9].Merge = true;
            ws.Cells[3, 9].Value = "meter";

            ws.Cells[1, 1, 1, 9].Style.Font.Bold = true;
            ws.Cells[1, 1, 3, 9].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            ws.Cells[1, 1, 3, 9].Style.VerticalAlignment = ExcelVerticalAlignment.Top;

            for (int c = 1; c <= 9; c++)
            {
                //ws.Column(c).AutoFit();
            }

            for (int i = 0; i < items.Count(); i++)
            {
                var t = items.ElementAt(i);
                ws.Cells[4 + i, 1].Style.Numberformat.Format = "d-MMM-yy";
                ws.Cells[4 + i, 1].Value = t.date.HasValue ? t.date.Value.ToLocalTime().ToOADate() : (double?)null;
                ws.Cells[4 + i, 2].Value = t.well;
                ws.Cells[4 + i, 3].Value = t.pump_intake;
                ws.Cells[4 + i, 4].Value = t.dfl;
                ws.Cells[4 + i, 5].Value = t.cdfl;
                ws.Cells[4 + i, 6].Value = t.sfl;
                ws.Cells[4 + i, 7].Value = t.tglc;
                ws.Cells[4 + i, 8].Value = t.egfl;
                ws.Cells[4 + i, 9].Value = t.al;
            }

            MemoryStream memoryStream = new MemoryStream(workbook.GetAsByteArray());
            memoryStream.Position = 0;
            return File(memoryStream, "application/vnd.ms-excel", "Sonolog.xlsx");
        }

        [Authorize("PeSonolog Add")]
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

            List<Sonolog> items = new List<Sonolog>();
            int error_count = 0;

            for (var r = 4; r <= rowCount; r++)
            {
                if (!string.IsNullOrWhiteSpace(ws.Cells[r, 1].Value?.ToString()))
                {
                    Sonolog _row = new Sonolog();
                    SonologError _row_error = new SonologError();
                    int last_error_count = error_count;

                    if (!String.IsNullOrWhiteSpace(ws.Cells[r, 1].Value?.ToString()))
                    {
                        try
                        {
                            if (ws.Cells[r, 1].Value.GetType() == DateTime.Now.GetType())
                            {
                                _row.date = (DateTime?)ws.Cells[r, 1].Value;
                            }
                            else
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
                        _row.pump_intake = (!String.IsNullOrWhiteSpace(ws.Cells[r, 3].Value?.ToString())) ? decimal.Parse(ws.Cells[r, 3].Value?.ToString().Trim()) : (decimal?)null;
                    }
                    catch (Exception e)
                    {
                        _row_error.pump_intake = new ErrorItem { value = ws.Cells[r, 3].Value?.ToString(), message = e.Message };
                        error_count++;
                    }

                    try
                    {
                        _row.dfl = (!String.IsNullOrWhiteSpace(ws.Cells[r, 4].Value?.ToString())) ? decimal.Parse(ws.Cells[r, 4].Value?.ToString().Trim()) : (decimal?)null;
                    }
                    catch (Exception e)
                    {
                        _row_error.dfl = new ErrorItem { value = ws.Cells[r, 4].Value?.ToString(), message = e.Message };
                        error_count++;
                    }

                    try
                    {
                        _row.cdfl = (!String.IsNullOrWhiteSpace(ws.Cells[r, 5].Value?.ToString())) ? decimal.Parse(ws.Cells[r, 5].Value?.ToString().Trim()) : (decimal?)null;
                    }
                    catch (Exception e)
                    {
                        _row_error.cdfl = new ErrorItem { value = ws.Cells[r, 5].Value?.ToString(), message = e.Message };
                        error_count++;
                    }

                    try
                    {
                        _row.sfl = (!String.IsNullOrWhiteSpace(ws.Cells[r, 6].Value?.ToString())) ? decimal.Parse(ws.Cells[r, 6].Value?.ToString().Trim()) : (decimal?)null;
                    }
                    catch (Exception e)
                    {
                        _row_error.sfl = new ErrorItem { value = ws.Cells[r, 6].Value?.ToString(), message = e.Message };
                        error_count++;
                    }

                    try
                    {
                        _row.tglc = (!String.IsNullOrWhiteSpace(ws.Cells[r, 7].Value?.ToString())) ? decimal.Parse(ws.Cells[r, 7].Value?.ToString().Trim()) : (decimal?)null;
                    }
                    catch (Exception e)
                    {
                        _row_error.tglc = new ErrorItem { value = ws.Cells[r, 7].Value?.ToString(), message = e.Message };
                        error_count++;
                    }

                    try
                    {
                        _row.egfl = (!String.IsNullOrWhiteSpace(ws.Cells[r, 8].Value?.ToString())) ? decimal.Parse(ws.Cells[r, 8].Value?.ToString().Trim()) : (decimal?)null;
                    }
                    catch (Exception e)
                    {
                        _row_error.egfl = new ErrorItem { value = ws.Cells[r, 8].Value?.ToString(), message = e.Message };
                        error_count++;
                    }

                    try
                    {
                        _row.al = (!String.IsNullOrWhiteSpace(ws.Cells[r, 9].Value?.ToString())) ? decimal.Parse(ws.Cells[r, 9].Value?.ToString().Trim()) : (decimal?)null;
                    }
                    catch (Exception e)
                    {
                        _row_error.al = new ErrorItem { value = ws.Cells[r, 9].Value?.ToString(), message = e.Message };
                        error_count++;
                    }

                    if (error_count > last_error_count)
                    {
                        _row_error._row = new ErrorItem { value = "error", message = "Error found" };
                    }

                    _row._error = _row_error;

                    items.Add(_row);
                }
            }

            SonologTmp _tmp = new SonologTmp
            {
                error_count = error_count,
                items = items.ToArray()
            };
            _sonolog_tmp.InsertOne(_tmp);

            return Ok(new
            {
                _id = _tmp._id,
                //items = items,
                error_count = error_count
            });
        }

        [Authorize("PeSonolog Add")]
        [HttpGet("Tmp")]
        public ActionResult GetTmp(string _id, String sort = "date", String order = "desc", int page = 0, int pagesize = 50, String filter = "", String columnfilter = "", string mode = "")
        {
            SonologTmp _tmp = _sonolog_tmp.Find(t => t._id == _id).FirstOrDefault();
            List<Sonolog> _tmpitems = _tmp.items.ToList();
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
                List<Sonolog> items = _tmpitems.ToList().GetRange(page * pagesize, pagesize);
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

        [Authorize("PeSonolog Add")]
        [HttpGet("SaveData")]
        public ActionResult SaveData(string _id)
        {
            try
            {
                SonologTmp _tmp = _sonolog_tmp.Find(t => t._id == _id).FirstOrDefault();

                if (_tmp == null || _tmp.error_count > 0)
                {
                    throw new Exception();
                }

                List<Sonolog> items = _tmp.items.ToList();

                DateTime? min_date = items.Select(m => m.date).Min();
                string[] wells = items.Select(m => m.well).ToArray();

                long created_count = 0;
                foreach (Sonolog item in items)
                {
                    item._error = null;

                    var insert = new Sonolog() {
                        date = item.date,
                        well = item.well,
                        pump_intake = item.pump_intake,
                        dfl = item.dfl,
                        cdfl = item.cdfl,
                        sfl = item.sfl,
                        tglc = item.tglc,
                        egfl = item.egfl,
                        al = item.al,
                        updated_by = User.Identity.Name,
                        updated_date = DateTime.Now,
                        created_by = User.Identity.Name,
                        created_date = DateTime.Now
                    };
                    _sonolog.InsertOne(insert);
                    created_count++;
                }
                _sonolog_tmp.DeleteOne(d => d._id == _id);

                long modified_count = DailyCommon.RecalculateFields(min_date, wells, User.Identity.Name);

                return Ok(new
                {
                    created_count = created_count,
                    modified_count = modified_count,
                    total_count = items.Count()
                });
            }
            catch (Exception e)
            {
                return BadRequest();
            }
        }

        [Authorize("PeSonolog Delete")]
        [HttpDelete]
        public ActionResult Delete(string[] _ids)
        {
            try
            {
                long deleted_count = 0;
                long total_count = _ids.Length;
                foreach (string _id in _ids)
                {
                    DeleteResult res = _sonolog.DeleteOne(t => t._id == _id);
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