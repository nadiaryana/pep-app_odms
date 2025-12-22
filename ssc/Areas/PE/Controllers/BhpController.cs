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
    public class BhpController : ControllerBase
    {
        private IMongoDatabase database;
        private readonly IMongoCollection<Bhp> _bhp;
        private readonly IMongoCollection<BhpTmp> _bhp_tmp;
        private ProjectionDefinition<Bhp> _fields;


        public BhpController(IPEDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            database = client.GetDatabase("pe");

            _bhp = database.GetCollection<Bhp>("bhp");
            _bhp_tmp = database.GetCollection<BhpTmp>("bhp_tmp");
            _fields = Builders<Bhp>.Projection
                .Include(t => t.date)
                .Include(t => t.well)
                .Include(t => t.compl_layer)
                .Include(t => t.layer_name)
                .Include(t => t.perfo_interval)
                .Include(t => t.meas_type)
                .Include(t => t.meas_depth)
                .Include(t => t.pmax)
                .Include(t => t.tmax)
                .Include(t => t.noted);
        }

        [Authorize("PeBhp Read")]
        [HttpGet]
        public ActionResult Get(String sort = "date", String order = "desc", int page = 0, int pagesize = 50, String filter = "", String columnfilter = "", string mode = "")
        {

            //var _items = _tickets.Find(t => true);
            FilterDefinition<Bhp> xfilter = Builders<Bhp>.Filter.Ne("a", "b");
            FilterDefinition<Bhp> xcolfilter;

            if (!String.IsNullOrWhiteSpace(filter))
            {
                filter = filter.ToLower();
                xfilter =
                    Builders<Bhp>.Filter.Regex(t => t.date, new BsonRegularExpression(filter, "i")) |
                    Builders<Bhp>.Filter.Regex(t => t.well, new BsonRegularExpression(filter, "i")) |
                    Builders<Bhp>.Filter.Regex(t => t.compl_layer, new BsonRegularExpression(filter, "i")) |
                    Builders<Bhp>.Filter.Regex(t => t.layer_name, new BsonRegularExpression(filter, "i")) |
                    Builders<Bhp>.Filter.Regex(t => t.perfo_interval, new BsonRegularExpression(filter, "i")) |
                    Builders<Bhp>.Filter.Regex(t => t.meas_type, new BsonRegularExpression(filter, "i")) |
                    Builders<Bhp>.Filter.Regex(t => t.meas_depth, new BsonRegularExpression(filter, "i")) |
                    Builders<Bhp>.Filter.Regex(t => t.pmax, new BsonRegularExpression(filter, "i")) |
                    Builders<Bhp>.Filter.Regex(t => t.tmax, new BsonRegularExpression(filter, "i")) |
                    Builders<Bhp>.Filter.Regex(t => t.noted, new BsonRegularExpression(filter, "i"));
            }

            if (!String.IsNullOrWhiteSpace(columnfilter))
            {
                xcolfilter = Builders<Bhp>.Filter.Ne("a", "b");
                BhpList colfilter = JsonConvert.DeserializeObject<BhpList>(columnfilter);

                if (colfilter.date?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Bhp>.Filter.Or(colfilter.date.ToList().Select(c => (c is DateTime) ? Builders<Bhp>.Filter.Eq(t => t.date, new BsonDateTime((DateTime)c)) : "{$expr:{$regexMatch:{input:{$dateToString:{format:\"%d %m %Y\",date:\"$date\",timezone:\"" + TimeZoneInfo.Local.DisplayName.Substring(4, 6) + "\"}},regex:/" + ReplaceMonth((string)c) + "/i}}}"));
                if (colfilter.well?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Bhp>.Filter.Or(colfilter.well.ToList().Where(c => !(c is JObject)).Select(c => Builders<Bhp>.Filter.Regex(t => t.well, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.compl_layer?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Bhp>.Filter.Or(colfilter.compl_layer.ToList().Where(c => !(c is JObject)).Select(c => Builders<Bhp>.Filter.Regex(t => t.compl_layer, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.layer_name?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Bhp>.Filter.Or(colfilter.layer_name.ToList().Where(c => !(c is JObject)).Select(c => Builders<Bhp>.Filter.Regex(t => t.layer_name, new BsonRegularExpression((string)c, "i"))));
                // if (colfilter.perfo_interval?.ToList().Count(c => !(c is JObject)) > 0) { xcolfilter = xcolfilter & Builders<Bhp>.Filter.Or(colfilter.perfo_interval.ToList().Where(c => !(c is JObject)).Select(c => Builders<Bhp>.Filter.Regex(t => t.perfo_interval, new BsonRegularExpression(Regex.Escape((string)c), "i")))); }

                if (colfilter.perfo_interval?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Bhp>.Filter.Or(colfilter.perfo_interval.ToList().Where(c => !(c is JObject)).Select(c => Builders<Bhp>.Filter.Eq("perfo_interval", ((string)c).Split(",").Select(i => i.Split("-")).ToArray())));
                if (colfilter.meas_type?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Bhp>.Filter.Or(colfilter.meas_type.ToList().Where(c => !(c is JObject)).Select(c => Builders<Bhp>.Filter.Regex(t => t.meas_type, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.meas_depth?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Bhp>.Filter.Or(colfilter.meas_depth.ToList().Where(c => !(c is JObject)).Select(c => Builders<Bhp>.Filter.Regex(t => t.meas_depth, new BsonRegularExpression((string)c, "i"))));
                // if (colfilter.meas_depth?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Bhp>.Filter.Or(colfilter.meas_depth.ToList().Where(c => !(c is JObject)).Select(c => Builders<Bhp>.Filter.Eq(t => t.meas_depth, Convert.ToDecimal(c))));
                if (colfilter.pmax?.Length > 0) xcolfilter = xcolfilter & Builders<Bhp>.Filter.Or(colfilter.pmax.ToList().Select(c => Builders<Bhp>.Filter.Regex(t => t.pmax, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.tmax?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Bhp>.Filter.Or(colfilter.tmax.ToList().Where(c => !(c is JObject)).Select(c => Builders<Bhp>.Filter.Eq(t => t.tmax, Convert.ToDecimal(c))));

                foreach (string log in DailyCommon._logical)
                {
                    if (colfilter.date?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.date.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[\"$date\",ISODate(\"{1}\")]}}", ((JObject)c).GetValue("opr"), DateTime.Parse(((JObject)c).GetValue("val").ToString()).ToString("yyyy-MM-ddTHH:mm:ssZ"))).ToArray()), log);
                    if (colfilter.well?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.well.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$well\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.compl_layer?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.compl_layer.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$compl_layer\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.layer_name?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.layer_name.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$in:[true,{{$map:{{input:\"$layer_name\",in:{{$regexMatch:{{input:{{$toString:\"$$this\"}},regex:\"{0}\",options:\"i\"}}}}}}}}]}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.perfo_interval?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.perfo_interval.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$perfo_interval\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.meas_type?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.meas_type.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$meas_type\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.meas_depth?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.meas_type.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$meas_depth\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    // if (colfilter.meas_depth?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.meas_depth.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$meas_depth\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.pmax?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.pmax.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$pmax\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.tmax?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.tmax.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$tmax\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.noted?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.noted.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$noted\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                }

                xfilter = xfilter & xcolfilter;
            }

            var _items = _bhp.Find(xfilter, new FindOptions() { Collation = new Collation("en_US", numericOrdering: true) });
            var total_count = _items.CountDocuments();

            switch (sort)
            {
                case "date": _items = (order == "asc") ? _items.SortBy(t => t.date) : _items.SortByDescending(t => t.date); break;
                case "well": _items = (order == "asc") ? _items.SortBy(t => t.well) : _items.SortByDescending(t => t.well); break;
                case "compl_layer": _items = (order == "asc") ? _items.SortBy(t => t.compl_layer) : _items.SortByDescending(t => t.compl_layer); break;
                case "layer_name": _items = (order == "asc") ? _items.SortBy(t => t.layer_name) : _items.SortByDescending(t => t.layer_name); break;
                case "perfo_interval": _items = (order == "asc") ? _items.SortBy(t => t.perfo_interval) : _items.SortByDescending(t => t.perfo_interval); break;
                case "meas_type": _items = (order == "asc") ? _items.SortBy(t => t.meas_type) : _items.SortByDescending(t => t.meas_type); break;
                case "meas_depth": _items = (order == "asc") ? _items.SortBy(t => t.meas_depth) : _items.SortByDescending(t => t.meas_depth); break;
                case "pmax": _items = (order == "asc") ? _items.SortBy(t => t.pmax) : _items.SortByDescending(t => t.pmax); break;
                case "tmax": _items = (order == "asc") ? _items.SortBy(t => t.tmax) : _items.SortByDescending(t => t.tmax); break;
                case "noted": _items = (order == "asc") ? _items.SortBy(t => t.noted) : _items.SortByDescending(t => t.noted); break;
            }

            switch (mode)
            {
                case "":
                case null:
                    List<Bhp> items = _items
                    .Skip(page * pagesize)
                    .Limit(pagesize)
                    .Project<Bhp>(_fields).ToList();

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
                    .Project<Bhp>(_fields).ToList());

                default:
                    dynamic res;
                    switch (mode)
                    {
                        case "well":
                        case "esp":
                            res = _bhp.Distinct<string>(mode, xfilter).ToEnumerable().OrderBy(t => t).ToList();
                            break;
                        case "date":
                            res = _bhp.Distinct<DateTime?>(mode, xfilter).ToEnumerable().OrderByDescending(t => t).ToList();
                            break;
                        default:
                            res = _bhp.Distinct<decimal?>(mode, xfilter).ToEnumerable().OrderBy(t => t).ToList();
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

        public ActionResult GetExcel(List<Bhp> items)
        {
            var workbook = new ExcelPackage();
            var ws = workbook.Workbook.Worksheets.Add("Bhp");
            ws.Cells[1, 1].Value = "Date";
            ws.Cells[1, 2].Value = "Well";
            ws.Cells[1, 3].Value = "Compl Layer";
            ws.Cells[1, 4].Value = "Layer Name";
            ws.Cells[1, 5].Value = "Perforation Interval";
            ws.Cells[1, 6].Value = "Meas Type";
            ws.Cells[1, 7].Value = "Mead Depth)";
            ws.Cells[1, 8].Value = "Pmax";
            ws.Cells[1, 9].Value = "Tmax";
            ws.Cells[1, 10].Value = "Remarks";


            ws.Cells[1, 1, 1, 10].Style.Font.Bold = true;
            ws.Cells[1, 1, 1, 10].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            ws.Cells[1, 1, 1, 10].Style.VerticalAlignment = ExcelVerticalAlignment.Top;

            for (int c = 1; c <= 10; c++)
            {
                //ws.Column(c).AutoFit();
            }

            for (int i = 0; i < items.Count(); i++)
            {
                var t = items.ElementAt(i);
                ws.Cells[2 + i, 1].Style.Numberformat.Format = "d-MMM-yy";
                ws.Cells[2 + i, 1].Value = t.date.HasValue ? t.date.Value.ToLocalTime().ToOADate() : (double?)null;
                ws.Cells[2 + i, 2].Value = t.well;
                ws.Cells[2 + i, 3].Value = t.compl_layer;
                ws.Cells[2 + i, 4].Value = t.layer_name;
                ws.Cells[2 + i, 5].Value = t.perfo_interval;
                ws.Cells[2 + i, 6].Value = t.meas_type;
                ws.Cells[2 + i, 7].Value = t.meas_depth;
                ws.Cells[2 + i, 8].Value = t.pmax;
                ws.Cells[2 + i, 9].Value = t.tmax;
                ws.Cells[2 + i, 10].Value = t.noted;
            }

            MemoryStream memoryStream = new MemoryStream(workbook.GetAsByteArray());
            memoryStream.Position = 0;
            return File(memoryStream, "application/vnd.ms-excel", "BHP.xlsx");
        }

        [Authorize("PeBhp Add")]
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

            List<Bhp> items = new List<Bhp>();
            int error_count = 0;

            for (var r = 2; r <= rowCount; r++)
            {
                if (!string.IsNullOrWhiteSpace(ws.Cells[r, 1].Value?.ToString()))
                {
                    Bhp _row = new Bhp();
                    BhpError _row_error = new BhpError();
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

                    var arrayMappings = new[]
                    {
                        new
                        {
                            key = "layer_name",
                            col = 4,
                            required = false,
                            errorMsg = "Blank zone is not allowed",
                            parse = new Func<string, object>(val => val.Split(",").Select(z => z.Trim()).ToArray())
                        },
                        new
                        {
                            key = "perfo_interval",
                            col = 5,
                            required = false,
                            errorMsg = "Blank interval is not allowed",
                            parse = new Func<string, object>(val => val.Split(",").Select(i => i.Trim().Split("-").Select(j => decimal.Parse(j.Trim())).ToArray()).ToArray())
                        }
                    };

                    foreach (var mapping in arrayMappings)
                    {
                        var rawValue = ws.Cells[r, mapping.col].Value;
                        var strValue = rawValue?.ToString().Trim();

                        var prop = typeof(Bhp).GetProperty(mapping.key);
                        var errorProp = typeof(BhpError).GetProperty(mapping.key);

                        if (!string.IsNullOrWhiteSpace(strValue))
                        {
                            try
                            {
                                var parsedValue = mapping.parse(strValue);
                                prop?.SetValue(_row, parsedValue);
                            }
                            catch (Exception e)
                            {
                                errorProp?.SetValue(_row_error, new ErrorItem { value = strValue, message = e.Message });
                                error_count++;
                            }
                        }
                        else
                        {
                            if (mapping.required)
                            {
                                errorProp?.SetValue(_row_error, new ErrorItem { value = "(Blank)", message = mapping.errorMsg });
                                error_count++;
                            }
                            prop?.SetValue(_row, null);
                        }
                    }

                    var stringMappings = new[]
                    {
                        new { key = "well", col = 2, required = true, errorMsg = "Blank Well String name is not allowed" },
                        new { key = "compl_layer", col = 3, required = false, errorMsg = "" },
                        new { key = "meas_type", col = 6, required = false, errorMsg = "" },
                        new { key = "noted", col = 10, required = false, errorMsg = "" },
                        new { key = "meas_depth", col = 7, required = false, errorMsg = "" },
                    };

                    foreach (var mapping in stringMappings)
                    {
                        var rawValue = ws.Cells[r, mapping.col].Value;
                        var strValue = rawValue?.ToString().Trim();

                        var prop = typeof(Bhp).GetProperty(mapping.key);
                        var errorProp = typeof(BhpError).GetProperty(mapping.key);

                        if (!string.IsNullOrWhiteSpace(strValue))
                        {
                            prop?.SetValue(_row, strValue);
                        }
                        else
                        {
                            if (mapping.required)
                            {
                                errorProp?.SetValue(_row_error, new ErrorItem { value = "(Blank)", message = mapping.errorMsg });
                                error_count++;
                            }
                            prop?.SetValue(_row, null);
                        }
                    }

                    // decimal mappings
                    // Column indexes based on the provided Excel structure
                    var mappings = new[]
                    {

                        new { key = "pmax", col = 8 },
                        new { key = "tmax", col = 9 },
                    };

                    foreach (var mapping in mappings)
                    {
                        var rawValue = ws.Cells[r, mapping.col].Value;

                        // If empty → null
                        if (rawValue == null)
                        {
                            typeof(Bhp).GetProperty(mapping.key)?.SetValue(_row, null);
                            continue;
                        }

                        string strValue = rawValue.ToString().Trim();
                        decimal num;
                        bool parsed = false;

                        // Excel stores most numbers as double
                        if (rawValue is double dbl)
                        {
                            num = Convert.ToDecimal(dbl);
                            parsed = true;
                        }
                        else if (rawValue is int itg)
                        {
                            num = Convert.ToDecimal(itg);
                            parsed = true;
                        }
                        else
                        {
                            // Last fallback: parse string
                            parsed = decimal.TryParse(strValue, out num);
                        }

                        if (parsed)
                        {
                            typeof(Bhp).GetProperty(mapping.key)?.SetValue(_row, num);
                        }
                        else
                        {
                            typeof(Bhp).GetProperty(mapping.key)?.SetValue(_row, null);

                            typeof(BhpError).GetProperty(mapping.key)?.SetValue(
                                _row_error,
                                new ErrorItem
                                {
                                    value = strValue,
                                    message = "Invalid number"
                                }
                            );

                            error_count++;
                        }
                        // var rawValue = ws.Cells[r, mapping.col].Value;
                        // var strValue = rawValue?.ToString().Trim();

                        // if (!string.IsNullOrEmpty(strValue))
                        // {
                        //     string valueToParse = strValue;

                        //     if (decimal.TryParse(valueToParse, out decimal num))
                        //     {
                        //         var prop = typeof(Bhp).GetProperty(mapping.key);
                        //         if (prop != null)
                        //             prop.SetValue(_row, num);
                        //     }
                        //     else
                        //     {
                        //         var prop = typeof(Bhp).GetProperty(mapping.key);
                        //         if (prop != null)
                        //             prop.SetValue(_row, null);

                        //         var errorProp = typeof(BhpError).GetProperty(mapping.key);
                        //         if (errorProp != null)
                        //             errorProp.SetValue(_row_error, new ErrorItem { value = strValue, message = "Invalid number" });

                        //         error_count++;
                        //     }
                        // }
                        // else
                        // {
                        //     var prop = typeof(Bhp).GetProperty(mapping.key);
                        //     if (prop != null)
                        //         prop.SetValue(_row, null);
                        // }
                    }


                    if (_row_error.date == null && _row_error.well == null)
                    {
                        if (_bhp.Find(t => t.date == _row.date && t.well == _row.well).CountDocuments() > 0)
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

            BhpTmp _tmp = new BhpTmp
            {
                error_count = error_count,
                items = items.ToArray()
            };
            _bhp_tmp.InsertOne(_tmp);

            return Ok(new
            {
                _id = _tmp._id,
                //items = items,
                error_count = error_count
            });
        }

        [Authorize("PeBhp Add")]
        [HttpGet("Tmp")]
        public ActionResult GetTmp(string _id, String sort = "date", String order = "desc", int page = 0, int pagesize = 50, String filter = "", String columnfilter = "", string mode = "")
        {
            BhpTmp _tmp = _bhp_tmp.Find(t => t._id == _id).FirstOrDefault();
            List<Bhp> _tmpitems = _tmp.items.ToList();
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
                List<Bhp> items = _tmpitems.ToList().GetRange(page * pagesize, pagesize);
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

        [Authorize("PeBhp Add")]
        [HttpGet("SaveData")]
        public ActionResult SaveData(string _id)
        {
            try
            {
                BhpTmp _tmp = _bhp_tmp.Find(t => t._id == _id).FirstOrDefault();

                if (_tmp == null || _tmp.error_count > 0)
                {
                    throw new Exception();
                }

                List<Bhp> items = _tmp.items.ToList();

                DateTime? min_date = items.Select(m => m.date).Min();
                string[] wells = items.Select(m => m.well).ToArray();

                long modified_count = 0;
                long created_count = items.Count();

                foreach (Bhp item in items)
                {
                    item._error = null;

                    var update = Builders<Bhp>.Update.Set(t => t.date, item.date)
                        .Set(t => t.well, item.well)
                        .Set(t => t.compl_layer, item.compl_layer)
                        .Set(t => t.layer_name, item.layer_name)
                        .Set(t => t.perfo_interval, item.perfo_interval)
                        .Set(t => t.meas_type, item.meas_type)
                        .Set(t => t.meas_depth, item.meas_depth)
                        .Set(t => t.pmax, item.pmax)
                        .Set(t => t.tmax, item.tmax)
                        .Set(t => t.noted, item.noted)
                        .Set(t => t.updated_by, User.Identity.Name)
                        .Set(t => t.updated_date, DateTime.Now)
                        .SetOnInsert(t => t.created_by, User.Identity.Name)
                        .SetOnInsert(t => t.created_date, DateTime.Now);

                    UpdateResult res = _bhp.UpdateOne(
                        Builders<Bhp>.Filter.Eq(t => t.date, item.date) & Builders<Bhp>.Filter.Eq(t => t.well, item.well),
                        update, new UpdateOptions() { IsUpsert = true });

                    modified_count += res.ModifiedCount;
                    created_count -= res.ModifiedCount;
                }
                _bhp_tmp.DeleteOne(d => d._id == _id);

                // modified_count += DailyCommon.RecalculateFields(min_date, wells, User.Identity.Name);

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

        [Authorize("PeBhp Delete")]
        [HttpDelete]
        public ActionResult Delete(string[] _ids)
        {
            try
            {
                long deleted_count = 0;
                long total_count = _ids.Length;
                foreach (string _id in _ids)
                {
                    DeleteResult res = _bhp.DeleteOne(t => t._id == _id);
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

        [Authorize("PeBhp Read")]
        [HttpGet]
        private ActionResult Data_Bhp(string type, DateTime? start, DateTime? end, string[] well)
        {
            switch (type)
            {
                case "bhp_chart":

                    // var startLocal = TimeZoneInfo.ConvertTimeFromUtc(start.Value, TimeZoneInfo.Local);
                    // var endLocal = TimeZoneInfo.ConvertTimeFromUtc(end.Value, TimeZoneInfo.Local);

                    var bhp = _bhp.Find(
                        r => well.Contains(r.well) &&
                        r.date >= start && r.date <= end
                    ).Project<Bhp>(_fields).ToList().OrderBy(t => t.date).Select(s => new
                    {
                        date = System.TimeZoneInfo.ConvertTimeFromUtc(s.date.Value, System.TimeZoneInfo.Local),
                        well = s.well,
                        pmax = s.pmax,
                        tmax = s.tmax,

                    });

                    return Ok(new { items = bhp });

                default:
                    return Ok(new { });
            }
        }

    }
}
