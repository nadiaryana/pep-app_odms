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
    public class WellDatabaseController : ControllerBase
    {
        private IMongoDatabase database;
        private readonly IMongoCollection<WellDatabase> _welldatabase;
        private readonly IMongoCollection<WellDatabaseTmp> _welldatabase_tmp;
        private ProjectionDefinition<WellDatabase> _fields;


        public WellDatabaseController(IPEDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            database = client.GetDatabase("pe");

            _welldatabase = database.GetCollection<WellDatabase>("welldatabase");
            _welldatabase_tmp = database.GetCollection<WellDatabaseTmp>("welldatabase_tmp");
            _fields = Builders<WellDatabase>.Projection
                // .Include(t => t.date)
                .Include(t => t.well)
                .Include(t => t.last_comp_date)
                .Include(t => t.layer_acc)
                .Include(t => t.interval_acc)
                .Include(t => t.top)
                .Include(t => t.bottom)
                .Include(t => t.layer_unacc)
                .Include(t => t.interval_unacc)
                .Include(t => t.top_2)
                .Include(t => t.bottom_2)
                .Include(t => t.hole_feature)
                .Include(t => t.panjang_feature)
                .Include(t => t.rtl)
                .Include(t => t.remarks);
        }

        [Authorize("PeWellDatabase Read")]
        [HttpGet]
        public ActionResult Get(String sort = "date", String order = "desc", int page = 0, int pagesize = 50, String filter = "", String columnfilter = "", string mode = "")
        {

            //var _items = _tickets.Find(t => true);
            FilterDefinition<WellDatabase> xfilter = Builders<WellDatabase>.Filter.Ne("a", "b");
            FilterDefinition<WellDatabase> xcolfilter;

            if (!String.IsNullOrWhiteSpace(filter))
            {
                filter = filter.ToLower();
                xfilter =
                    Builders<WellDatabase>.Filter.Regex(t => t.well, new BsonRegularExpression(filter, "i")) |
                    Builders<WellDatabase>.Filter.Regex(t => t.last_comp_date, new BsonRegularExpression(filter, "i")) |
                    Builders<WellDatabase>.Filter.Regex(t => t.layer_acc, new BsonRegularExpression(filter, "i")) |
                    Builders<WellDatabase>.Filter.Regex(t => t.interval_acc, new BsonRegularExpression(filter, "i")) |
                    Builders<WellDatabase>.Filter.Regex(t => t.top, new BsonRegularExpression(filter, "i")) |
                    Builders<WellDatabase>.Filter.Regex(t => t.bottom, new BsonRegularExpression(filter, "i")) |
                    Builders<WellDatabase>.Filter.Regex(t => t.layer_unacc, new BsonRegularExpression(filter, "i")) |
                    Builders<WellDatabase>.Filter.Regex(t => t.interval_unacc, new BsonRegularExpression(filter, "i")) |
                    Builders<WellDatabase>.Filter.Regex(t => t.top_2, new BsonRegularExpression(filter, "i")) |
                    Builders<WellDatabase>.Filter.Regex(t => t.bottom_2, new BsonRegularExpression(filter, "i")) |
                    Builders<WellDatabase>.Filter.Regex(t => t.hole_feature, new BsonRegularExpression(filter, "i")) |
                    Builders<WellDatabase>.Filter.Regex(t => t.panjang_feature, new BsonRegularExpression(filter, "i")) |
                    Builders<WellDatabase>.Filter.Regex(t => t.rtl, new BsonRegularExpression(filter, "i")) |
                    Builders<WellDatabase>.Filter.Regex(t => t.remarks, new BsonRegularExpression(filter, "i"));
            }

            if (!String.IsNullOrWhiteSpace(columnfilter))
            {
                xcolfilter = Builders<WellDatabase>.Filter.Ne("a", "b");
                WellDatabaseList colfilter = JsonConvert.DeserializeObject<WellDatabaseList>(columnfilter);

                // if (colfilter.date?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellDatabase>.Filter.Or(colfilter.date.ToList().Select(c => (c is DateTime) ? Builders<WellDatabase>.Filter.Eq(t => t.date, new BsonDateTime((DateTime)c)) : "{$expr:{$regexMatch:{input:{$dateToString:{format:\"%d %m %Y\",date:\"$date\",timezone:\"" + TimeZoneInfo.Local.DisplayName.Substring(4, 6) + "\"}},regex:/" + ReplaceMonth((string)c) + "/i}}}"));
                if (colfilter.well?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellDatabase>.Filter.Or(colfilter.well.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellDatabase>.Filter.Regex(t => t.well, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.last_comp_date?.ToList().Count(c => !(c is JObject)) > 0) { var tzOffset = TimeZoneInfo.Local.BaseUtcOffset.ToString(@"hh\:mm"); xcolfilter = xcolfilter & Builders<WellDatabase>.Filter.Or(colfilter.last_comp_date.ToList().Select(c => (c is DateTime) ? Builders<WellDatabase>.Filter.Eq(t => t.last_comp_date, new BsonDateTime(((DateTime)c).ToUniversalTime())) : "{$expr:{$regexMatch:{input:{$dateToString:{format:\"%d %m %Y\",date:\"$last_comp_date\",timezone:\"+0" + tzOffset + "\"}},regex:/" + ReplaceMonth((string)c) + "/i}}}")); }
                if (colfilter.layer_acc?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellDatabase>.Filter.Or(colfilter.layer_acc.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellDatabase>.Filter.Regex(t => t.layer_acc, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.interval_acc?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellDatabase>.Filter.Or(colfilter.interval_acc.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellDatabase>.Filter.Eq("interval_acc", ((string)c).Split(",").Select(i => i.Split("-")).ToArray())));
                if (colfilter.top?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellDatabase>.Filter.Or(colfilter.top.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellDatabase>.Filter.Regex(t => t.top, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.bottom?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellDatabase>.Filter.Or(colfilter.bottom.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellDatabase>.Filter.Regex(t => t.bottom, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.layer_unacc?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellDatabase>.Filter.Or(colfilter.layer_unacc.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellDatabase>.Filter.Regex(t => t.layer_unacc, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.interval_unacc?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellDatabase>.Filter.Or(colfilter.interval_unacc.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellDatabase>.Filter.Eq("interval_unacc", ((string)c).Split(",").Select(i => i.Split("-")).ToArray())));
                if (colfilter.top_2?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellDatabase>.Filter.Or(colfilter.top_2.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellDatabase>.Filter.Regex(t => t.top_2, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.bottom_2?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellDatabase>.Filter.Or(colfilter.bottom_2.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellDatabase>.Filter.Eq(t => t.bottom_2, Convert.ToDecimal(c))));
                if (colfilter.hole_feature?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellDatabase>.Filter.Or(colfilter.hole_feature.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellDatabase>.Filter.Regex(t => t.hole_feature, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.panjang_feature?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellDatabase>.Filter.Or(colfilter.panjang_feature.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellDatabase>.Filter.Eq(t => t.panjang_feature, Convert.ToDecimal(c))));
                if (colfilter.rtl?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellDatabase>.Filter.Or(colfilter.rtl.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellDatabase>.Filter.Regex(t => t.rtl, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.remarks?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellDatabase>.Filter.Or(colfilter.remarks.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellDatabase>.Filter.Regex(t => t.remarks, new BsonRegularExpression((string)c, "i"))));

                // if (colfilter.perfo_interval?.ToList().Count(c => !(c is JObject)) > 0) { xcolfilter = xcolfilter & Builders<WellDatabase>.Filter.Or(colfilter.perfo_interval.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellDatabase>.Filter.Regex(t => t.perfo_interval, new BsonRegularExpression(Regex.Escape((string)c), "i")))); }

                foreach (string log in DailyCommon._logical)
                {
                    if (colfilter.last_comp_date?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.last_comp_date.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[\"$last_comp_date\",ISODate(\"{1}\")]}}", ((JObject)c).GetValue("opr"), DateTime.Parse(((JObject)c).GetValue("val").ToString()).ToString("yyyy-MM-ddTHH:mm:ssZ"))).ToArray()), log);
                    if (colfilter.well?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.well.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$well\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.layer_acc?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.layer_acc.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$in:[true,{{$map:{{input:\"$layer_acc\",in:{{$regexMatch:{{input:{{$toString:\"$$this\"}},regex:\"{0}\",options:\"i\"}}}}}}}}]}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.interval_acc?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.interval_acc.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$in:[true,{{$map:{{input:{{$reduce:{{input:\"$interval_acc\",initialValue:[],in:{{$concatArrays:[\"$$value\",\"$$this\"]}}}}}},in:{{$regexMatch:{{input:{{$toString:\"$$this\"}},regex:\"{0}\",options:\"i\"}}}}}}}}]}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.top?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.layer_unacc.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$top\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.bottom?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.top.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$bottom\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.layer_unacc?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.layer_unacc.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$in:[true,{{$map:{{input:\"$layer_unacc\",in:{{$regexMatch:{{input:{{$toString:\"$$this\"}},regex:\"{0}\",options:\"i\"}}}}}}}}]}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.interval_unacc?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.interval_unacc.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$in:[true,{{$map:{{input:{{$reduce:{{input:\"$interval_unacc\",initialValue:[],in:{{$concatArrays:[\"$$value\",\"$$this\"]}}}}}},in:{{$regexMatch:{{input:{{$toString:\"$$this\"}},regex:\"{0}\",options:\"i\"}}}}}}}}]}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.top_2?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.interval_unacc.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$max_ch\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.bottom_2?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.top_2.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$min_sl\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.hole_feature?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.hole_feature.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$hole_feature\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.panjang_feature?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.hole_feature.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$max_sl\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.rtl?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.panjang_feature.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$used_sl\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.remarks?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.remarks.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$noted\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                }

                xfilter = xfilter & xcolfilter;
            }

            var _items = _welldatabase.Find(xfilter, new FindOptions() { Collation = new Collation("en_US", numericOrdering: true) });
            var total_count = _items.CountDocuments();

            switch (sort)
            {
                case "well": _items = (order == "asc") ? _items.SortBy(t => t.well) : _items.SortByDescending(t => t.well); break;
                case "last_comp_date": _items = (order == "asc") ? _items.SortBy(t => t.last_comp_date) : _items.SortByDescending(t => t.last_comp_date); break;
                case "layer_acc": _items = (order == "asc") ? _items.SortBy(t => t.layer_acc) : _items.SortByDescending(t => t.layer_acc); break;
                case "interval_acc": _items = (order == "asc") ? _items.SortBy(t => t.interval_acc) : _items.SortByDescending(t => t.interval_acc); break;
                case "top": _items = (order == "asc") ? _items.SortBy(t => t.top) : _items.SortByDescending(t => t.top); break;
                case "bottom": _items = (order == "asc") ? _items.SortBy(t => t.bottom) : _items.SortByDescending(t => t.bottom); break;
                case "layer_unacc": _items = (order == "asc") ? _items.SortBy(t => t.layer_unacc) : _items.SortByDescending(t => t.layer_unacc); break;
                case "interval_unacc": _items = (order == "asc") ? _items.SortBy(t => t.interval_unacc) : _items.SortByDescending(t => t.interval_unacc); break;
                case "top_2": _items = (order == "asc") ? _items.SortBy(t => t.top_2) : _items.SortByDescending(t => t.top_2); break;
                case "bottom_2": _items = (order == "asc") ? _items.SortBy(t => t.bottom_2) : _items.SortByDescending(t => t.bottom_2); break;
                case "hole_feature": _items = (order == "asc") ? _items.SortBy(t => t.hole_feature) : _items.SortByDescending(t => t.hole_feature); break;
                case "panjang_feature": _items = (order == "asc") ? _items.SortBy(t => t.panjang_feature) : _items.SortByDescending(t => t.panjang_feature); break;
                case "rtl": _items = (order == "asc") ? _items.SortBy(t => t.rtl) : _items.SortByDescending(t => t.rtl); break;
                case "remarks": _items = (order == "asc") ? _items.SortBy(t => t.remarks) : _items.SortByDescending(t => t.remarks); break;
            }

            switch (mode)
            {
                case "":
                case null:
                    List<WellDatabase> items = _items
                    .Skip(page * pagesize)
                    .Limit(pagesize)
                    .Project<WellDatabase>(_fields).ToList();

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
                    .Project<WellDatabase>(_fields).ToList());

                default:
                    dynamic res;
                    switch (mode)
                    {
                        case "well":
                        case "esp":
                            res = _welldatabase.Distinct<string>(mode, xfilter).ToEnumerable().OrderBy(t => t).ToList();
                            break;
                        case "date":
                            res = _welldatabase.Distinct<DateTime?>(mode, xfilter).ToEnumerable().OrderByDescending(t => t).ToList();
                            break;
                        default:
                            res = _welldatabase.Distinct<decimal?>(mode, xfilter).ToEnumerable().OrderBy(t => t).ToList();
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

        public ActionResult GetExcel(List<WellDatabase> items)
        {
            var workbook = new ExcelPackage();
            var ws = workbook.Workbook.Worksheets.Add("WellDatabase");
            ws.Cells[1, 1].Value = "Well";
            ws.Cells[1, 2].Value = "Accessed Layer";
            ws.Cells[1, 2, 1, 6].Merge = true;
            ws.Cells[2, 2].Value = "Last Completion Date";
            ws.Cells[2, 3].Value = "Layer";
            ws.Cells[2, 4].Value = "Interval";
            ws.Cells[2, 5].Value = "top";
            ws.Cells[2, 6].Value = "bottom";

            ws.Cells[1, 7].Value = "Unaccessed Layer";
            ws.Cells[1, 7, 1, 10].Merge = true;
            ws.Cells[2, 7].Value = "Layer";
            ws.Cells[2, 8].Value = "Interval";
            ws.Cells[2, 9].Value = "top";
            ws.Cells[2, 10].Value = "bottom";

            ws.Cells[1, 11].Value = "Hole Feature";
            ws.Cells[1, 12].Value = "Panjang Feature";
            ws.Cells[1, 13].Value = "RTL";
            ws.Cells[1, 14].Value = "Remarks";


            ws.Cells[1, 1, 1, 14].Style.Font.Bold = true;
            ws.Cells[1, 1, 1, 14].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            ws.Cells[1, 1, 1, 14].Style.VerticalAlignment = ExcelVerticalAlignment.Top;

            for (int c = 1; c <= 14; c++)
            {
                //ws.Column(c).AutoFit();
            }

            for (int i = 0; i < items.Count(); i++)
            {
                var t = items.ElementAt(i);
                // ws.Cells[2 + i, 1].Style.Numberformat.Format = "d-MMM-yy";
                // ws.Cells[2 + i, 1].Value = t.date.HasValue ? t.date.Value.ToLocalTime().ToOADate() : (double?)null;
                ws.Cells[2 + i, 1].Value = t.well;
                ws.Cells[2 + i, 2].Value = t.last_comp_date;
                ws.Cells[2 + i, 3].Value = t.layer_acc;
                ws.Cells[2 + i, 4].Value = t.interval_acc;
                ws.Cells[2 + i, 5].Value = t.top;
                ws.Cells[2 + i, 6].Value = t.bottom;
                ws.Cells[2 + i, 7].Value = t.layer_unacc;
                ws.Cells[2 + i, 8].Value = t.interval_unacc;
                ws.Cells[2 + i, 9].Value = t.top_2;
                ws.Cells[2 + i, 10].Value = t.bottom_2;
                ws.Cells[2 + i, 11].Value = t.hole_feature;
                ws.Cells[2 + i, 12].Value = t.panjang_feature;
                ws.Cells[2 + i, 13].Value = t.rtl;
                ws.Cells[2 + i, 14].Value = t.remarks;
            }

            MemoryStream memoryStream = new MemoryStream(workbook.GetAsByteArray());
            memoryStream.Position = 0;
            return File(memoryStream, "application/vnd.ms-excel", "BHP.xlsx");
        }

        [Authorize("PeWellDatabase Add")]
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

            List<WellDatabase> items = new List<WellDatabase>();
            int error_count = 0;

            for (var r = 5; r <= rowCount; r++)
            {
                if (!string.IsNullOrWhiteSpace(ws.Cells[r, 3].Value?.ToString()))
                {
                    WellDatabase _row = new WellDatabase();
                    WellDatabaseError _row_error = new WellDatabaseError();
                    int last_error_count = error_count;

                    if (!String.IsNullOrWhiteSpace(ws.Cells[r, 3].Value?.ToString()))
                    {
                        _row.well = ws.Cells[r, 3].Value?.ToString().Trim();
                    }
                    else
                    {
                        _row_error.well = new ErrorItem { value = "(Blank)", message = "Blank well is not allowed" };
                        error_count++;
                    }

                    if (!String.IsNullOrWhiteSpace(ws.Cells[r, 2].Value?.ToString()))
                    {
                        try
                        {
                            if (ws.Cells[r, 2].Value.GetType() == DateTime.Now.GetType())
                            {
                                _row.last_comp_date = (DateTime?)ws.Cells[r, 2].Value;
                            }
                            else
                            {
                                _row.last_comp_date = DateTime.FromOADate(double.Parse(ws.Cells[r, 2].Value?.ToString().Trim()));
                            }
                        }
                        catch (Exception e)
                        {
                            _row_error.last_comp_date = new ErrorItem { value = ws.Cells[r, 2].Value?.ToString(), message = e.Message };
                            error_count++;
                        }
                    }
                    else
                    {
                        _row_error.last_comp_date = new ErrorItem { value = "(Blank)", message = "Blank date is not allowed" };
                        error_count++;
                    }

                    var arrayMappings = new[]
                    {
                        new
                        {
                            key = "layer_acc",
                            col = 5,
                            required = false,
                            errorMsg = "Blank zone is not allowed",
                            parse = new Func<string, object>(val => val.Split(",").Select(z => z.Trim()).ToArray())
                        },
                        new
                        {
                            key = "interval_acc",
                            col = 6,
                            required = false,
                            errorMsg = "Blank interval is not allowed",
                            parse = new Func<string, object>(val => val.Split(",").Select(i => i.Trim().Split("-").Select(j => decimal.Parse(j.Trim())).ToArray()).ToArray())
                        },

                        new
                        {
                            key = "layer_unacc",
                            col = 7,
                            required = false,
                            errorMsg = "Blank zone is not allowed",
                            parse = new Func<string, object>(val => val.Split(",").Select(z => z.Trim()).ToArray())
                        },
                        new
                        {
                            key = "interval_unacc",
                            col = 8,
                            required = false,
                            errorMsg = "Blank interval is not allowed",
                            parse = new Func<string, object>(val => val.Split(",").Select(i => i.Trim().Split("-").Select(j => decimal.Parse(j.Trim())).ToArray()).ToArray())
                        }
                    };

                    foreach (var mapping in arrayMappings)
                    {
                        var rawValue = ws.Cells[r, mapping.col].Value;
                        var strValue = rawValue?.ToString().Trim();

                        var prop = typeof(Daily).GetProperty(mapping.key);
                        var errorProp = typeof(DailyError).GetProperty(mapping.key);

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

                    // decimal mappings
                    // Column indexes based on the provided Excel structure
                    var mappings = new[]
                    {
                        new { key = "top", col = 5 },
                        new { key = "bottom", col = 6 },
                        new { key = "top_2", col = 9 },
                        new { key = "bottom_2", col = 10 },
                        new { key = "panjang_feature", col = 12 },
                    };

                    foreach (var mapping in mappings)
                    {
                        var rawValue = ws.Cells[r, mapping.col].Value;
                        var strValue = rawValue?.ToString().Trim();

                        if (!string.IsNullOrEmpty(strValue))
                        {
                            string valueToParse = strValue;
                            // if the column is "wc", handle percentage and fraction cases
                            if (mapping.key == "wc" || mapping.key == "ds_efficiency")
                            {
                                // Remove percent sign and whitespace for wc
                                valueToParse = valueToParse.Replace("%", "").Trim();
                                // If value is less than or equal to 1, assume it's a fraction and convert to percent
                                if (decimal.TryParse(valueToParse, out decimal wcNum) && wcNum <= 1)
                                {
                                    wcNum *= 100;
                                    valueToParse = wcNum.ToString(CultureInfo.InvariantCulture);
                                }
                            }

                            if (decimal.TryParse(valueToParse, out decimal num))
                            {
                                var prop = typeof(Daily).GetProperty(mapping.key);
                                if (prop != null)
                                    prop.SetValue(_row, num);
                            }
                            else
                            {
                                var prop = typeof(Daily).GetProperty(mapping.key);
                                if (prop != null)
                                    prop.SetValue(_row, null);

                                var errorProp = typeof(DailyError).GetProperty(mapping.key);
                                if (errorProp != null)
                                    errorProp.SetValue(_row_error, new ErrorItem { value = strValue, message = "Invalid number" });

                                error_count++;
                            }
                        }
                        else
                        {
                            var prop = typeof(Daily).GetProperty(mapping.key);
                            if (prop != null)
                                prop.SetValue(_row, null);
                        }
                    }

                    if (!String.IsNullOrWhiteSpace(ws.Cells[r, 11].Value?.ToString()))
                    {
                        try
                        {
                            _row.rtl = ws.Cells[r, 11].Value?.ToString().Trim();
                        }
                        catch (Exception e)
                        {
                            _row_error.rtl = new ErrorItem
                            {
                                value = ws.Cells[r, 11].Value?.ToString(),
                                message = e.Message
                            };
                            error_count++;
                        }
                    }
                    else
                    {
                        _row.rtl = null;
                    }

                    if (!String.IsNullOrWhiteSpace(ws.Cells[r, 12].Value?.ToString()))
                    {
                        try
                        {
                            _row.hole_feature = ws.Cells[r, 12].Value?.ToString().Trim();
                        }
                        catch (Exception e)
                        {
                            _row_error.hole_feature = new ErrorItem
                            {
                                value = ws.Cells[r, 12].Value?.ToString(),
                                message = e.Message
                            };
                            error_count++;
                        }
                    }
                    else
                    {
                        _row.hole_feature = null;
                    }


                    if (!String.IsNullOrWhiteSpace(ws.Cells[r, 13].Value?.ToString()))
                    {
                        try
                        {
                            _row.remarks = ws.Cells[r, 13].Value?.ToString().Trim();
                        }
                        catch (Exception e)
                        {
                            _row_error.remarks = new ErrorItem
                            {
                                value = ws.Cells[r, 13].Value?.ToString(),
                                message = e.Message
                            };
                            error_count++;
                        }
                    }
                    else
                    {
                        _row.remarks = null;
                    }



                    if (_row_error.well == null && _row_error.well == null)
                    {
                        if (_welldatabase.Find(t => t.well == _row.well).CountDocuments() > 0)
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

            WellDatabaseTmp _tmp = new WellDatabaseTmp
            {
                error_count = error_count,
                items = items.ToArray()
            };
            _welldatabase_tmp.InsertOne(_tmp);

            return Ok(new
            {
                _id = _tmp._id,
                //items = items,
                error_count = error_count
            });
        }

        [Authorize("PeWellDatabase Add")]
        [HttpGet("Tmp")]
        public ActionResult GetTmp(string _id, String sort = "well", String order = "desc", int page = 0, int pagesize = 50, String filter = "", String columnfilter = "", string mode = "")
        {
            WellDatabaseTmp _tmp = _welldatabase_tmp.Find(t => t._id == _id).FirstOrDefault();
            List<WellDatabase> _tmpitems = _tmp.items.ToList();
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
                List<WellDatabase> items = _tmpitems.ToList().GetRange(page * pagesize, pagesize);
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

        [Authorize("PeWellDatabase Add")]
        [HttpGet("SaveData")]
        public ActionResult SaveData(string _id)
        {
            try
            {
                WellDatabaseTmp _tmp = _welldatabase_tmp.Find(t => t._id == _id).FirstOrDefault();

                if (_tmp == null || _tmp.error_count > 0)
                {
                    throw new Exception();
                }

                List<WellDatabase> items = _tmp.items.ToList();

                // DateTime? min_date = items.Select(m => m.date).Min();
                string[] wells = items.Select(m => m.well).ToArray();

                long modified_count = 0;
                long created_count = items.Count();

                foreach (WellDatabase item in items)
                {
                    item._error = null;

                    var update = Builders<WellDatabase>.Update
                        .Set(t => t.well, item.well)
                        .Set(t => t.last_comp_date, item.last_comp_date)
                        .Set(t => t.layer_acc, item.layer_acc)
                        .Set(t => t.interval_acc, item.interval_acc)
                        .Set(t => t.top, item.top)
                        .Set(t => t.bottom, item.bottom)
                        .Set(t => t.layer_unacc, item.layer_unacc)
                        .Set(t => t.interval_unacc, item.interval_unacc)
                        .Set(t => t.top_2, item.top_2)
                        .Set(t => t.bottom_2, item.bottom_2)
                        .Set(t => t.hole_feature, item.hole_feature)
                        .Set(t => t.panjang_feature, item.panjang_feature)
                        .Set(t => t.rtl, item.rtl)
                        .Set(t => t.remarks, item.remarks)
                        .Set(t => t.updated_by, User.Identity.Name)
                        .Set(t => t.updated_date, DateTime.Now)
                        .SetOnInsert(t => t.created_by, User.Identity.Name)
                        .SetOnInsert(t => t.created_date, DateTime.Now);

                    UpdateResult res = _welldatabase.UpdateOne(
                        Builders<WellDatabase>.Filter.Eq(t => t.well, item.well),
                        update, new UpdateOptions() { IsUpsert = true });

                    modified_count += res.ModifiedCount;
                    created_count -= res.ModifiedCount;
                }
                _welldatabase_tmp.DeleteOne(d => d._id == _id);

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

        [Authorize("PeWellDatabase Add")]
        [HttpPatch("{id}")]
        public IActionResult Update(string id, [FromBody] WellDatabase payload)
        {
            if (payload == null)
                return BadRequest();

            var update = Builders<WellDatabase>.Update
                .Set(t => t.well, payload.well)
                .Set(t => t.last_comp_date, payload.last_comp_date)
                .Set(t => t.layer_acc, payload.layer_acc)
                .Set(t => t.interval_acc, payload.interval_acc)
                .Set(t => t.top, payload.top)
                .Set(t => t.bottom, payload.bottom)
                .Set(t => t.layer_unacc, payload.layer_unacc)
                .Set(t => t.interval_unacc, payload.interval_unacc)
                .Set(t => t.top_2, payload.top_2)
                .Set(t => t.bottom_2, payload.bottom_2)
                .Set(t => t.hole_feature, payload.hole_feature)
                .Set(t => t.panjang_feature, payload.panjang_feature)
                .Set(t => t.rtl, payload.rtl)
                .Set(t => t.remarks, payload.remarks)
                .Set(t => t.updated_by, User.Identity.Name)
                .Set(t => t.updated_date, DateTime.Now);

            var result = _welldatabase.UpdateOne(
                Builders<WellDatabase>.Filter.Eq(t => t._id, id),
                update
            );

            if (result.MatchedCount == 0)
                return NotFound();

            return Ok(new
            {
                modified_count = result.ModifiedCount
            });
        }

        [Authorize("PeWellDatabase Delete")]
        [HttpDelete]
        public ActionResult Delete(string[] _ids)
        {
            try
            {
                long deleted_count = 0;
                long total_count = _ids.Length;
                foreach (string _id in _ids)
                {
                    DeleteResult res = _welldatabase.DeleteOne(t => t._id == _id);
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

        [Authorize("PeWellDatabase Read")]
        [HttpGet]
        private ActionResult Data_WellDatabase(string type, DateTime? start, DateTime? end, string[] well)
        {
            switch (type)
            {
                case "welldatabase_chart":

                    // var startLocal = TimeZoneInfo.ConvertTimeFromUtc(start.Value, TimeZoneInfo.Local);
                    // var endLocal = TimeZoneInfo.ConvertTimeFromUtc(end.Value, TimeZoneInfo.Local);

                    var welldatabase = _welldatabase.Find(
                        r => well.Contains(r.well)
                    // r.date >= start && r.date <= end
                    ).Project<WellDatabase>(_fields).ToList().OrderBy(t => t.well).Select(s => new
                    {
                        // date = System.TimeZoneInfo.ConvertTimeFromUtc(s.date.Value, System.TimeZoneInfo.Local),
                        // well = s.well,
                        // pmax = s.pmax,
                        // tmax = s.tmax,

                    });

                    return Ok(new { items = welldatabase });

                default:
                    return Ok(new { });
            }
        }

    }
}
