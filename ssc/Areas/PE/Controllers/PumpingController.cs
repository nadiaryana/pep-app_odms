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
    public class PumpingUnitController : ControllerBase
    {
        private IMongoDatabase database;
        private readonly IMongoCollection<PumpingUnit> _pumping;
        private readonly IMongoCollection<PumpingUnitTmp> _pumping_tmp;
        private ProjectionDefinition<PumpingUnit> _fields;


        public PumpingUnitController(IPEDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            database = client.GetDatabase("pe");

            _pumping = database.GetCollection<PumpingUnit>("pumping");
            _pumping_tmp = database.GetCollection<PumpingUnitTmp>("pumping_tmp");
            _fields = Builders<PumpingUnit>.Projection
                // .Include(t => t.date)
                .Include(t => t.nomor)
                .Include(t => t.well)
                .Include(t => t.status)
                .Include(t => t.primemover)
                .Include(t => t.merk)
                .Include(t => t.tipe)
                .Include(t => t.min_ch)
                .Include(t => t.med_ch)
                .Include(t => t.max_ch)
                .Include(t => t.min_sl)
                .Include(t => t.med_sl)
                .Include(t => t.max_sl)
                .Include(t => t.used_sl)
                .Include(t => t.noted);
        }

        [Authorize("PePumpingUnit Read")]
        [HttpGet]
        public ActionResult Get(String sort = "date", String order = "desc", int page = 0, int pagesize = 50, String filter = "", String columnfilter = "", string mode = "")
        {

            //var _items = _tickets.Find(t => true);
            FilterDefinition<PumpingUnit> xfilter = Builders<PumpingUnit>.Filter.Ne("a", "b");
            FilterDefinition<PumpingUnit> xcolfilter;

            if (!String.IsNullOrWhiteSpace(filter))
            {
                filter = filter.ToLower();
                xfilter =
                    Builders<PumpingUnit>.Filter.Regex(t => t.nomor, new BsonRegularExpression(filter, "i")) |
                    Builders<PumpingUnit>.Filter.Regex(t => t.well, new BsonRegularExpression(filter, "i")) |
                    Builders<PumpingUnit>.Filter.Regex(t => t.status, new BsonRegularExpression(filter, "i")) |
                    Builders<PumpingUnit>.Filter.Regex(t => t.primemover, new BsonRegularExpression(filter, "i")) |
                    Builders<PumpingUnit>.Filter.Regex(t => t.merk, new BsonRegularExpression(filter, "i")) |
                    Builders<PumpingUnit>.Filter.Regex(t => t.tipe, new BsonRegularExpression(filter, "i")) |
                    Builders<PumpingUnit>.Filter.Regex(t => t.min_ch, new BsonRegularExpression(filter, "i")) |
                    Builders<PumpingUnit>.Filter.Regex(t => t.med_ch, new BsonRegularExpression(filter, "i")) |
                    Builders<PumpingUnit>.Filter.Regex(t => t.max_ch, new BsonRegularExpression(filter, "i")) |
                    Builders<PumpingUnit>.Filter.Regex(t => t.min_sl, new BsonRegularExpression(filter, "i")) |
                    Builders<PumpingUnit>.Filter.Regex(t => t.med_sl, new BsonRegularExpression(filter, "i")) |
                    Builders<PumpingUnit>.Filter.Regex(t => t.max_sl, new BsonRegularExpression(filter, "i")) |
                    Builders<PumpingUnit>.Filter.Regex(t => t.used_sl, new BsonRegularExpression(filter, "i")) |
                    Builders<PumpingUnit>.Filter.Regex(t => t.noted, new BsonRegularExpression(filter, "i"));
            }

            if (!String.IsNullOrWhiteSpace(columnfilter))
            {
                xcolfilter = Builders<PumpingUnit>.Filter.Ne("a", "b");
                PumpingUnitList colfilter = JsonConvert.DeserializeObject<PumpingUnitList>(columnfilter);

                // if (colfilter.date?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<PumpingUnit>.Filter.Or(colfilter.date.ToList().Select(c => (c is DateTime) ? Builders<PumpingUnit>.Filter.Eq(t => t.date, new BsonDateTime((DateTime)c)) : "{$expr:{$regexMatch:{input:{$dateToString:{format:\"%d %m %Y\",date:\"$date\",timezone:\"" + TimeZoneInfo.Local.DisplayName.Substring(4, 6) + "\"}},regex:/" + ReplaceMonth((string)c) + "/i}}}"));
                if (colfilter.nomor?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<PumpingUnit>.Filter.Or(colfilter.nomor.ToList().Where(c => !(c is JObject)).Select(c => Builders<PumpingUnit>.Filter.Regex(t => t.nomor, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.well?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<PumpingUnit>.Filter.Or(colfilter.well.ToList().Where(c => !(c is JObject)).Select(c => Builders<PumpingUnit>.Filter.Regex(t => t.well, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.status?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<PumpingUnit>.Filter.Or(colfilter.status.ToList().Where(c => !(c is JObject)).Select(c => Builders<PumpingUnit>.Filter.Regex(t => t.status, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.primemover?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<PumpingUnit>.Filter.Or(colfilter.primemover.ToList().Where(c => !(c is JObject)).Select(c => Builders<PumpingUnit>.Filter.Regex(t => t.primemover, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.merk?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<PumpingUnit>.Filter.Or(colfilter.merk.ToList().Where(c => !(c is JObject)).Select(c => Builders<PumpingUnit>.Filter.Regex(t => t.merk, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.tipe?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<PumpingUnit>.Filter.Or(colfilter.tipe.ToList().Where(c => !(c is JObject)).Select(c => Builders<PumpingUnit>.Filter.Regex(t => t.tipe, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.min_ch?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<PumpingUnit>.Filter.Or(colfilter.min_ch.ToList().Where(c => !(c is JObject)).Select(c => Builders<PumpingUnit>.Filter.Regex(t => t.min_ch, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.med_ch?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<PumpingUnit>.Filter.Or(colfilter.med_ch.ToList().Where(c => !(c is JObject)).Select(c => Builders<PumpingUnit>.Filter.Regex(t => t.med_ch, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.max_ch?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<PumpingUnit>.Filter.Or(colfilter.max_ch.ToList().Where(c => !(c is JObject)).Select(c => Builders<PumpingUnit>.Filter.Regex(t => t.max_ch, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.min_sl?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<PumpingUnit>.Filter.Or(colfilter.min_sl.ToList().Where(c => !(c is JObject)).Select(c => Builders<PumpingUnit>.Filter.Eq(t => t.min_sl, Convert.ToDecimal(c))));
                if (colfilter.med_sl?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<PumpingUnit>.Filter.Or(colfilter.med_sl.ToList().Where(c => !(c is JObject)).Select(c => Builders<PumpingUnit>.Filter.Eq(t => t.med_sl, Convert.ToDecimal(c))));
                if (colfilter.max_sl?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<PumpingUnit>.Filter.Or(colfilter.max_sl.ToList().Where(c => !(c is JObject)).Select(c => Builders<PumpingUnit>.Filter.Eq(t => t.max_sl, Convert.ToDecimal(c))));
                if (colfilter.used_sl?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<PumpingUnit>.Filter.Or(colfilter.used_sl.ToList().Where(c => !(c is JObject)).Select(c => Builders<PumpingUnit>.Filter.Eq(t => t.used_sl, Convert.ToDecimal(c))));

                // if (colfilter.perfo_interval?.ToList().Count(c => !(c is JObject)) > 0) { xcolfilter = xcolfilter & Builders<PumpingUnit>.Filter.Or(colfilter.perfo_interval.ToList().Where(c => !(c is JObject)).Select(c => Builders<PumpingUnit>.Filter.Regex(t => t.perfo_interval, new BsonRegularExpression(Regex.Escape((string)c), "i")))); }

                foreach (string log in DailyCommon._logical)
                {
                    // if (colfilter.date?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.date.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[\"$date\",ISODate(\"{1}\")]}}", ((JObject)c).GetValue("opr"), DateTime.Parse(((JObject)c).GetValue("val").ToString()).ToString("yyyy-MM-ddTHH:mm:ssZ"))).ToArray()), log);
                    if (colfilter.nomor?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.nomor.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$nomor\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.well?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.well.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$well\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.status?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.status.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$status\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.primemover?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.primemover.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$primemover\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.merk?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.merk.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$merk\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.tipe?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.tipe.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$tipe\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.min_ch?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.min_ch.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$min_ch\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.med_ch?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.med_ch.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$med_ch\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.max_ch?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.max_ch.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$max_ch\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.min_sl?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.min_sl.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$min_sl\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.med_sl?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.med_sl.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$med_sl\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.max_sl?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.max_sl.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$max_sl\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.used_sl?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.used_sl.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$used_sl\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.noted?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.noted.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$noted\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                }

                xfilter = xfilter & xcolfilter;
            }

            var _items = _pumping.Find(xfilter, new FindOptions() { Collation = new Collation("en_US", numericOrdering: true) });
            var total_count = _items.CountDocuments();

            switch (sort)
            {
                case "nomor": _items = (order == "asc") ? _items.SortBy(t => t.nomor) : _items.SortByDescending(t => t.nomor); break;
                case "well": _items = (order == "asc") ? _items.SortBy(t => t.well) : _items.SortByDescending(t => t.well); break;
                case "status": _items = (order == "asc") ? _items.SortBy(t => t.status) : _items.SortByDescending(t => t.status); break;
                case "primemover": _items = (order == "asc") ? _items.SortBy(t => t.primemover) : _items.SortByDescending(t => t.primemover); break;
                case "merk": _items = (order == "asc") ? _items.SortBy(t => t.merk) : _items.SortByDescending(t => t.merk); break;
                case "tipe": _items = (order == "asc") ? _items.SortBy(t => t.tipe) : _items.SortByDescending(t => t.tipe); break;
                case "min_ch": _items = (order == "asc") ? _items.SortBy(t => t.min_ch) : _items.SortByDescending(t => t.min_ch); break;
                case "med_ch": _items = (order == "asc") ? _items.SortBy(t => t.med_ch) : _items.SortByDescending(t => t.med_ch); break;
                case "max_ch": _items = (order == "asc") ? _items.SortBy(t => t.max_ch) : _items.SortByDescending(t => t.max_ch); break;
                case "min_sl": _items = (order == "asc") ? _items.SortBy(t => t.min_sl) : _items.SortByDescending(t => t.min_sl); break;
                case "med_sl": _items = (order == "asc") ? _items.SortBy(t => t.med_sl) : _items.SortByDescending(t => t.med_sl); break;
                case "max_sl": _items = (order == "asc") ? _items.SortBy(t => t.max_sl) : _items.SortByDescending(t => t.max_sl); break;
                case "used_sl": _items = (order == "asc") ? _items.SortBy(t => t.used_sl) : _items.SortByDescending(t => t.used_sl); break;
                case "noted": _items = (order == "asc") ? _items.SortBy(t => t.noted) : _items.SortByDescending(t => t.noted); break;
            }

            switch (mode)
            {
                case "":
                case null:
                    List<PumpingUnit> items = _items
                    .Skip(page * pagesize)
                    .Limit(pagesize)
                    .Project<PumpingUnit>(_fields).ToList();

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
                    .Project<PumpingUnit>(_fields).ToList());

                default:
                    dynamic res;
                    switch (mode)
                    {
                        case "well":
                        case "esp":
                            res = _pumping.Distinct<string>(mode, xfilter).ToEnumerable().OrderBy(t => t).ToList();
                            break;
                        case "date":
                            res = _pumping.Distinct<DateTime?>(mode, xfilter).ToEnumerable().OrderByDescending(t => t).ToList();
                            break;
                        default:
                            res = _pumping.Distinct<decimal?>(mode, xfilter).ToEnumerable().OrderBy(t => t).ToList();
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

        public ActionResult GetExcel(List<PumpingUnit> items)
        {
            var workbook = new ExcelPackage();
            var ws = workbook.Workbook.Worksheets.Add("PumpingUnit");
            ws.Cells[1, 1].Value = "Nomor";
            ws.Cells[1, 2].Value = "Well";
            ws.Cells[1, 3].Value = "Status";
            ws.Cells[1, 4].Value = "Primemover";
            ws.Cells[1, 5].Value = "Merk Pumping Unit";
            ws.Cells[1, 6].Value = "Tipe Pump";

            ws.Cells[1, 7].Value = "Crankhole";
            ws.Cells[1, 7, 1, 8].Merge = true;
            ws.Cells[2, 7].Value = "min";
            // ws.Cells[2, 5].Value = "Cor. Dynamic";
            // ws.Cells[3, 5].Value = "meter";
            ws.Cells[2, 8].Value = "Static";


            ws.Cells[1, 7].Value = "Remarks";


            ws.Cells[1, 1, 1, 7].Style.Font.Bold = true;
            ws.Cells[1, 1, 1, 7].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            ws.Cells[1, 1, 1, 7].Style.VerticalAlignment = ExcelVerticalAlignment.Top;

            for (int c = 1; c <= 7; c++)
            {
                //ws.Column(c).AutoFit();
            }

            for (int i = 0; i < items.Count(); i++)
            {
                var t = items.ElementAt(i);
                // ws.Cells[2 + i, 1].Style.Numberformat.Format = "d-MMM-yy";
                // ws.Cells[2 + i, 1].Value = t.date.HasValue ? t.date.Value.ToLocalTime().ToOADate() : (double?)null;
                ws.Cells[2 + i, 1].Value = t.nomor;
                ws.Cells[2 + i, 2].Value = t.well;
                ws.Cells[2 + i, 3].Value = t.status;
                ws.Cells[2 + i, 4].Value = t.primemover;
                ws.Cells[2 + i, 5].Value = t.merk;
                ws.Cells[2 + i, 6].Value = t.tipe;
                ws.Cells[2 + i, 7].Value = t.noted;
            }

            MemoryStream memoryStream = new MemoryStream(workbook.GetAsByteArray());
            memoryStream.Position = 0;
            return File(memoryStream, "application/vnd.ms-excel", "BHP.xlsx");
        }

        [Authorize("PePumpingUnit Add")]
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

            List<PumpingUnit> items = new List<PumpingUnit>();
            int error_count = 0;

            for (var r = 6; r <= rowCount; r++)
            {
                if (!string.IsNullOrWhiteSpace(ws.Cells[r, 3].Value?.ToString()))
                {
                    PumpingUnit _row = new PumpingUnit();
                    PumpingUnitError _row_error = new PumpingUnitError();
                    int last_error_count = error_count;

                    if (!String.IsNullOrWhiteSpace(ws.Cells[r, 3].Value?.ToString()))
                    {
                        _row.nomor = ws.Cells[r, 3].Value?.ToString().Trim();
                    }
                    else
                    {
                        _row_error.nomor = new ErrorItem { value = "(Blank)", message = "Blank nomor is not allowed" };
                        error_count++;
                    }

                    if (!String.IsNullOrWhiteSpace(ws.Cells[r, 4].Value?.ToString()))
                    {
                        _row.well = ws.Cells[r, 4].Value?.ToString().Trim();
                    }
                    else
                    {
                        _row_error.well = new ErrorItem { value = "(Blank)", message = "Blank well is not allowed" };
                        error_count++;
                    }

                    if (!String.IsNullOrWhiteSpace(ws.Cells[r, 5].Value?.ToString()))
                    {
                        _row.status = ws.Cells[r, 5].Value?.ToString().Trim();
                    }
                    else
                    {
                        _row_error.status = new ErrorItem { value = "(Blank)", message = "Blank status is not allowed" };
                        error_count++;
                    }

                    if (!String.IsNullOrWhiteSpace(ws.Cells[r, 6].Value?.ToString()))
                    {
                        _row.primemover = ws.Cells[r, 6].Value?.ToString().Trim();
                    }
                    else
                    {
                        _row_error.primemover = new ErrorItem { value = "(Blank)", message = "Blank primemover is not allowed" };
                        error_count++;
                    }

                    if (!String.IsNullOrWhiteSpace(ws.Cells[r, 7].Value?.ToString()))
                    {
                        _row.merk = ws.Cells[r, 7].Value?.ToString().Trim();
                    }
                    else
                    {
                        _row_error.merk = new ErrorItem { value = "(Blank)", message = "Blank merk is not allowed" };
                        error_count++;
                    }

                    if (!String.IsNullOrWhiteSpace(ws.Cells[r, 8].Value?.ToString()))
                    {
                        _row.tipe = ws.Cells[r, 8].Value?.ToString().Trim();
                    }
                    else
                    {
                        _row_error.tipe = new ErrorItem { value = "(Blank)", message = "Blank tipe is not allowed" };
                        error_count++;
                    }

                    if (!String.IsNullOrWhiteSpace(ws.Cells[r, 9].Value?.ToString()))
                    {
                        _row.noted = ws.Cells[r, 9].Value?.ToString().Trim();
                    }



                    if (_row_error.well == null && _row_error.well == null)
                    {
                        if (_pumping.Find(t => t.well == _row.well).CountDocuments() > 0)
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

            PumpingUnitTmp _tmp = new PumpingUnitTmp
            {
                error_count = error_count,
                items = items.ToArray()
            };
            _pumping_tmp.InsertOne(_tmp);

            return Ok(new
            {
                _id = _tmp._id,
                //items = items,
                error_count = error_count
            });
        }

        [Authorize("PePumpingUnit Add")]
        [HttpGet("Tmp")]
        public ActionResult GetTmp(string _id, String sort = "well", String order = "desc", int page = 0, int pagesize = 50, String filter = "", String columnfilter = "", string mode = "")
        {
            PumpingUnitTmp _tmp = _pumping_tmp.Find(t => t._id == _id).FirstOrDefault();
            List<PumpingUnit> _tmpitems = _tmp.items.ToList();
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
                List<PumpingUnit> items = _tmpitems.ToList().GetRange(page * pagesize, pagesize);
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

        [Authorize("PePumpingUnit Add")]
        [HttpGet("SaveData")]
        public ActionResult SaveData(string _id)
        {
            try
            {
                PumpingUnitTmp _tmp = _pumping_tmp.Find(t => t._id == _id).FirstOrDefault();

                if (_tmp == null || _tmp.error_count > 0)
                {
                    throw new Exception();
                }

                List<PumpingUnit> items = _tmp.items.ToList();

                // DateTime? min_date = items.Select(m => m.date).Min();
                string[] wells = items.Select(m => m.well).ToArray();

                long modified_count = 0;
                long created_count = items.Count();

                foreach (PumpingUnit item in items)
                {
                    item._error = null;

                    var update = Builders<PumpingUnit>.Update
                        .Set(t => t.nomor, item.nomor)
                        .Set(t => t.well, item.well)
                        .Set(t => t.status, item.status)
                        .Set(t => t.primemover, item.primemover)
                        .Set(t => t.merk, item.merk)
                        .Set(t => t.tipe, item.tipe)
                        .Set(t => t.noted, item.noted)
                        .Set(t => t.updated_by, User.Identity.Name)
                        .Set(t => t.updated_date, DateTime.Now)
                        .SetOnInsert(t => t.created_by, User.Identity.Name)
                        .SetOnInsert(t => t.created_date, DateTime.Now);

                    UpdateResult res = _pumping.UpdateOne(
                        Builders<PumpingUnit>.Filter.Eq(t => t.well, item.well),
                        update, new UpdateOptions() { IsUpsert = true });

                    modified_count += res.ModifiedCount;
                    created_count -= res.ModifiedCount;
                }
                _pumping_tmp.DeleteOne(d => d._id == _id);

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

        [Authorize("PePumpingUnit Delete")]
        [HttpDelete]
        public ActionResult Delete(string[] _ids)
        {
            try
            {
                long deleted_count = 0;
                long total_count = _ids.Length;
                foreach (string _id in _ids)
                {
                    DeleteResult res = _pumping.DeleteOne(t => t._id == _id);
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

        [Authorize("PePumpingUnit Read")]
        [HttpGet]
        private ActionResult Data_PumpingUnit(string type, DateTime? start, DateTime? end, string[] well)
        {
            switch (type)
            {
                case "pumping_chart":

                    // var startLocal = TimeZoneInfo.ConvertTimeFromUtc(start.Value, TimeZoneInfo.Local);
                    // var endLocal = TimeZoneInfo.ConvertTimeFromUtc(end.Value, TimeZoneInfo.Local);

                    var pumping = _pumping.Find(
                        r => well.Contains(r.well)
                    // r.date >= start && r.date <= end
                    ).Project<PumpingUnit>(_fields).ToList().OrderBy(t => t.well).Select(s => new
                    {
                        // date = System.TimeZoneInfo.ConvertTimeFromUtc(s.date.Value, System.TimeZoneInfo.Local),
                        // well = s.well,
                        // pmax = s.pmax,
                        // tmax = s.tmax,

                    });

                    return Ok(new { items = pumping });

                default:
                    return Ok(new { });
            }
        }

    }
}
