using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using MongoDB.Bson;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using ssc.Areas.PE.Models;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System.IO;
using System.Globalization;
using System.Linq.Expressions;

namespace ssc.Areas.PE.Controllers
{
    [Route("api/pe/[controller]")]
    [ApiController]
    public class WellPerformanceController : ControllerBase
    {
        private IMongoDatabase database;
        private readonly IMongoCollection<Daily> _daily;
        private readonly IMongoCollection<Structure> _structure;
        private ProjectionDefinition<Daily> _fields_daily;
        private ProjectionDefinition<Structure> _fields_structure;
        private readonly IMongoCollection<WellPerformanceAnnual> _wpa;
        private readonly IMongoCollection<WellPerformance> _wp;
        private ProjectionDefinition<WellPerformanceAnnual> _fields_wpa;
        private ProjectionDefinition<WellPerformance> _fields_wp;

        public WellPerformanceController(IPEDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            database = client.GetDatabase(settings.DatabaseName);
            _daily = DailyCommon._daily;
            _structure = DailyCommon._structure;
            _wpa = database.GetCollection<WellPerformanceAnnual>("wp_tmp");
            _wp = database.GetCollection<WellPerformance>("wp_tmp");

            _fields_daily = DailyCommon._fields_daily;
            _fields_structure = DailyCommon._fields_structure;

            _fields_wpa = Builders<WellPerformanceAnnual>.Projection
                .Include(t => t.well)
                .Include(t => t.structure)
                .Include(t => t.m1)
                .Include(t => t.m2)
                .Include(t => t.m3)
                .Include(t => t.m4)
                .Include(t => t.m5)
                .Include(t => t.m6)
                .Include(t => t.m7)
                .Include(t => t.m8)
                .Include(t => t.m9)
                .Include(t => t.m10)
                .Include(t => t.m11)
                .Include(t => t.m12);

            _fields_wp = Builders<WellPerformance>.Projection
                .Include(t => t.well)
                .Include(t => t.structure)
                .Include(t => t.gross_prev)
                .Include(t => t.net_prev)
                .Include(t => t.wc_prev)
                .Include(t => t.gross)
                .Include(t => t.net)
                .Include(t => t.wc)
                .Include(t => t.gross_gap)
                .Include(t => t.net_gap)
                .Include(t => t.wc_gap);
        }

        [Authorize("PeWellPerformance Read")]
        [HttpGet("Annual")]
        public ActionResult GetAnnual(String sort = "date", String order = "desc", int page = 0, int pagesize = 50, String filter = "", String columnfilter = "", string mode = "")
        {
            FilterDefinition<WellPerformanceAnnual> xcolfilter = Builders<WellPerformanceAnnual>.Filter.Eq(t => t.uid, User.Identity.Name);

            if (!String.IsNullOrWhiteSpace(columnfilter))
            {
                //xcolfilter = 
                WellPerformanceAnnualList colfilter = JsonConvert.DeserializeObject<WellPerformanceAnnualList>(columnfilter);
                //if (colfilter.year?.Length > 0) xcolfilter = xcolfilter & Builders<WellPerformanceAnnual>.Filter.Or(colfilter.year.ToList().Select(c => Builders<WellPerformanceAnnual>.Filter.Eq(t => t.year, c)))
                if (colfilter.well?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellPerformanceAnnual>.Filter.Or(colfilter.well.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellPerformanceAnnual>.Filter.Regex(t => t.well, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.structure?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellPerformanceAnnual>.Filter.Or(colfilter.structure.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellPerformanceAnnual>.Filter.Regex(t => t.structure, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.m1?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellPerformanceAnnual>.Filter.Or(colfilter.m1.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellPerformanceAnnual>.Filter.Eq(t => t.m1, Convert.ToDecimal(c))));
                if (colfilter.m2?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellPerformanceAnnual>.Filter.Or(colfilter.m2.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellPerformanceAnnual>.Filter.Eq(t => t.m2, Convert.ToDecimal(c))));
                if (colfilter.m3?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellPerformanceAnnual>.Filter.Or(colfilter.m3.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellPerformanceAnnual>.Filter.Eq(t => t.m3, Convert.ToDecimal(c))));
                if (colfilter.m4?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellPerformanceAnnual>.Filter.Or(colfilter.m4.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellPerformanceAnnual>.Filter.Eq(t => t.m4, Convert.ToDecimal(c))));
                if (colfilter.m5?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellPerformanceAnnual>.Filter.Or(colfilter.m5.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellPerformanceAnnual>.Filter.Eq(t => t.m5, Convert.ToDecimal(c))));
                if (colfilter.m6?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellPerformanceAnnual>.Filter.Or(colfilter.m6.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellPerformanceAnnual>.Filter.Eq(t => t.m6, Convert.ToDecimal(c))));
                if (colfilter.m7?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellPerformanceAnnual>.Filter.Or(colfilter.m7.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellPerformanceAnnual>.Filter.Eq(t => t.m7, Convert.ToDecimal(c))));
                if (colfilter.m8?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellPerformanceAnnual>.Filter.Or(colfilter.m8.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellPerformanceAnnual>.Filter.Eq(t => t.m8, Convert.ToDecimal(c))));
                if (colfilter.m9?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellPerformanceAnnual>.Filter.Or(colfilter.m9.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellPerformanceAnnual>.Filter.Eq(t => t.m9, Convert.ToDecimal(c))));
                if (colfilter.m10?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellPerformanceAnnual>.Filter.Or(colfilter.m10.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellPerformanceAnnual>.Filter.Eq(t => t.m10, Convert.ToDecimal(c))));
                if (colfilter.m11?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellPerformanceAnnual>.Filter.Or(colfilter.m11.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellPerformanceAnnual>.Filter.Eq(t => t.m11, Convert.ToDecimal(c))));
                if (colfilter.m12?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellPerformanceAnnual>.Filter.Or(colfilter.m12.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellPerformanceAnnual>.Filter.Eq(t => t.m12, Convert.ToDecimal(c))));

                foreach (string log in DailyCommon._logical)
                {
                    if (colfilter.well?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.well.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$well\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.structure?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.structure.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$structure\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.m1?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.m1.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$m1\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.m2?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.m2.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$m2\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.m3?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.m3.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$m3\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.m4?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.m4.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$m4\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.m5?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.m5.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$m5\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.m6?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.m6.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$m6\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.m7?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.m7.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$m7\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.m8?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.m8.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$m8\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.m9?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.m9.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$m9\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.m10?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.m10.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$m10\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.m11?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.m11.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$m11\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.m12?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.m12.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$m12\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                }

                int year = Convert.ToInt32(colfilter.year[0]);

                var res = _daily.Find(
                    "{$expr:{$eq:[{$dateToString:{format:\"%Y\",date:\"$date\",timezone:\"" + TimeZoneInfo.Local.DisplayName.Substring(4, 6) + "\"}},\"" + year + "\"]}}"
                ).Project<Daily>(_fields_daily).ToList().GroupBy(r => new
                {
                    well = r.well,
                    structure = r.structure?.name,
                    //month = r.date.Value.ToLocalTime().Month
                }).Select(s => new WellPerformanceAnnual
                {
                    well = s.Key.well,
                    structure = s.Key.structure,
                    year = 2022,
                    m1 = (s.Where(u => u.date.Value.ToLocalTime().Month == 1).Count() > 0) ? s.Where(u => u.date.Value.ToLocalTime().Month == 1).Sum(t => t.last_prod_net) / s.Where(u => u.date.Value.ToLocalTime().Month == 1).Count() : null,
                    m2 = (s.Where(u => u.date.Value.ToLocalTime().Month == 2).Count() > 0) ? s.Where(u => u.date.Value.ToLocalTime().Month == 2).Sum(t => t.last_prod_net) / s.Where(u => u.date.Value.ToLocalTime().Month == 2).Count() : null,
                    m3 = (s.Where(u => u.date.Value.ToLocalTime().Month == 3).Count() > 0) ? s.Where(u => u.date.Value.ToLocalTime().Month == 3).Sum(t => t.last_prod_net) / s.Where(u => u.date.Value.ToLocalTime().Month == 3).Count() : null,
                    m4 = (s.Where(u => u.date.Value.ToLocalTime().Month == 4).Count() > 0) ? s.Where(u => u.date.Value.ToLocalTime().Month == 4).Sum(t => t.last_prod_net) / s.Where(u => u.date.Value.ToLocalTime().Month == 4).Count() : null,
                    m5 = (s.Where(u => u.date.Value.ToLocalTime().Month == 5).Count() > 0) ? s.Where(u => u.date.Value.ToLocalTime().Month == 5).Sum(t => t.last_prod_net) / s.Where(u => u.date.Value.ToLocalTime().Month == 5).Count() : null,
                    m6 = (s.Where(u => u.date.Value.ToLocalTime().Month == 6).Count() > 0) ? s.Where(u => u.date.Value.ToLocalTime().Month == 6).Sum(t => t.last_prod_net) / s.Where(u => u.date.Value.ToLocalTime().Month == 6).Count() : null,
                    m7 = (s.Where(u => u.date.Value.ToLocalTime().Month == 7).Count() > 0) ? s.Where(u => u.date.Value.ToLocalTime().Month == 7).Sum(t => t.last_prod_net) / s.Where(u => u.date.Value.ToLocalTime().Month == 7).Count() : null,
                    m8 = (s.Where(u => u.date.Value.ToLocalTime().Month == 8).Count() > 0) ? s.Where(u => u.date.Value.ToLocalTime().Month == 8).Sum(t => t.last_prod_net) / s.Where(u => u.date.Value.ToLocalTime().Month == 8).Count() : null,
                    m9 = (s.Where(u => u.date.Value.ToLocalTime().Month == 9).Count() > 0) ? s.Where(u => u.date.Value.ToLocalTime().Month == 9).Sum(t => t.last_prod_net) / s.Where(u => u.date.Value.ToLocalTime().Month == 9).Count() : null,
                    m10 = (s.Where(u => u.date.Value.ToLocalTime().Month == 10).Count() > 0) ? s.Where(u => u.date.Value.ToLocalTime().Month == 10).Sum(t => t.last_prod_net) / s.Where(u => u.date.Value.ToLocalTime().Month == 10).Count() : null,
                    m11 = (s.Where(u => u.date.Value.ToLocalTime().Month == 11).Count() > 0) ? s.Where(u => u.date.Value.ToLocalTime().Month == 11).Sum(t => t.last_prod_net) / s.Where(u => u.date.Value.ToLocalTime().Month == 11).Count() : null,
                    m12 = (s.Where(u => u.date.Value.ToLocalTime().Month == 12).Count() > 0) ? s.Where(u => u.date.Value.ToLocalTime().Month == 12).Sum(t => t.last_prod_net) / s.Where(u => u.date.Value.ToLocalTime().Month == 12).Count() : null,
                }).ToList();

                _wpa.DeleteMany(Builders<WellPerformanceAnnual>.Filter.Eq(t => t.uid, User.Identity.Name));

                foreach (WellPerformanceAnnual item in res)
                {
                    var insert = new WellPerformanceAnnual
                    {
                        uid = User.Identity.Name,
                        well = item.well,
                        structure = item.structure,
                        year = year,
                        m1 = item.m1,
                        m2 = item.m2,
                        m3 = item.m3,
                        m4 = item.m4,
                        m5 = item.m5,
                        m6 = item.m6,
                        m7 = item.m7,
                        m8 = item.m8,
                        m9 = item.m9,
                        m10 = item.m10,
                        m11 = item.m11,
                        m12 = item.m12,
                    };
                    _wpa.InsertOne(insert);
                }

                var _items = _wpa.Find(xcolfilter, new FindOptions() { Collation = new Collation("en_US", numericOrdering: true) });
                var total_count = _items.CountDocuments();

                List<WellPerformanceAnnual> items;

                if (mode != "grouping-structure") {

                    switch (sort)
                    {

                        case "well": _items = (order == "asc") ? _items.SortBy(t => t.well) : _items.SortByDescending(t => t.well); break;
                        case "m1": _items = (order == "asc") ? _items.SortBy(t => t.m1) : _items.SortByDescending(t => t.m1); break;
                        case "m2": _items = (order == "asc") ? _items.SortBy(t => t.m2) : _items.SortByDescending(t => t.m2); break;
                        case "m3": _items = (order == "asc") ? _items.SortBy(t => t.m3) : _items.SortByDescending(t => t.m3); break;
                        case "m4": _items = (order == "asc") ? _items.SortBy(t => t.m4) : _items.SortByDescending(t => t.m4); break;
                        case "m5": _items = (order == "asc") ? _items.SortBy(t => t.m5) : _items.SortByDescending(t => t.m5); break;
                        case "m6": _items = (order == "asc") ? _items.SortBy(t => t.m6) : _items.SortByDescending(t => t.m6); break;
                        case "m7": _items = (order == "asc") ? _items.SortBy(t => t.m7) : _items.SortByDescending(t => t.m7); break;
                        case "m8": _items = (order == "asc") ? _items.SortBy(t => t.m8) : _items.SortByDescending(t => t.m8); break;
                        case "m9": _items = (order == "asc") ? _items.SortBy(t => t.m9) : _items.SortByDescending(t => t.m9); break;
                        case "m10": _items = (order == "asc") ? _items.SortBy(t => t.m10) : _items.SortByDescending(t => t.m10); break;
                        case "m11": _items = (order == "asc") ? _items.SortBy(t => t.m11) : _items.SortByDescending(t => t.m11); break;
                        case "m12": _items = (order == "asc") ? _items.SortBy(t => t.m12) : _items.SortByDescending(t => t.m12); break;
                    }

                }


                switch (mode)
                {
                    case "":
                    case "grouping-well":
                    case null:
                        items = _items.Skip(page * pagesize).Limit(pagesize)
                            .Project<WellPerformanceAnnual>(_fields_wpa).ToList();

                        return new JsonResult(new
                        {
                            total_count = total_count,
                            incomplete_result = false,
                            items = items,
                            curr = year
                        })
                        {
                            StatusCode = StatusCodes.Status200OK
                        };

                    case "excel-well":
                        return GetAnnualExcel(_items.Project<WellPerformanceAnnual>(_fields_wpa).ToList(), year, "well");

                    case "grouping-structure":
                    case "excel-structure":
                        items = _items.Project<WellPerformanceAnnual>(_fields_wpa).ToList()
                            .GroupBy(g => new {
                                structure = g.structure
                            }).Select(s => new WellPerformanceAnnual {
                                structure = s.Key.structure,
                                year = s.First().year,
                                m1 = s.Sum(m => m.m1),
                                m2 = s.Sum(m => m.m2),
                                m3 = s.Sum(m => m.m3),
                                m4 = s.Sum(m => m.m4),
                                m5 = s.Sum(m => m.m5),
                                m6 = s.Sum(m => m.m6),
                                m7 = s.Sum(m => m.m7),
                                m8 = s.Sum(m => m.m8),
                                m9 = s.Sum(m => m.m9),
                                m10 = s.Sum(m => m.m10),
                                m11 = s.Sum(m => m.m11),
                                m12 = s.Sum(m => m.m12),
                            }).ToList();
                                switch (sort)
                                {
                                    case "structure": items = (order == "asc") ? items.OrderBy(g => g.structure).ToList() : items.OrderByDescending(g => g.structure).ToList(); break;
                                    case "m1": items = (order == "asc") ? items.OrderBy(g => g.m1).ToList() : items.OrderByDescending(g => g.m1).ToList(); break;
                                    case "m2": items = (order == "asc") ? items.OrderBy(g => g.m2).ToList() : items.OrderByDescending(g => g.m2).ToList(); break;
                                    case "m3": items = (order == "asc") ? items.OrderBy(g => g.m3).ToList() : items.OrderByDescending(g => g.m3).ToList(); break;
                                    case "m4": items = (order == "asc") ? items.OrderBy(g => g.m4).ToList() : items.OrderByDescending(g => g.m4).ToList(); break;
                                    case "m5": items = (order == "asc") ? items.OrderBy(g => g.m5).ToList() : items.OrderByDescending(g => g.m5).ToList(); break;
                                    case "m6": items = (order == "asc") ? items.OrderBy(g => g.m6).ToList() : items.OrderByDescending(g => g.m6).ToList(); break;
                                    case "m7": items = (order == "asc") ? items.OrderBy(g => g.m7).ToList() : items.OrderByDescending(g => g.m7).ToList(); break;
                                    case "m8": items = (order == "asc") ? items.OrderBy(g => g.m8).ToList() : items.OrderByDescending(g => g.m8).ToList(); break;
                                    case "m9": items = (order == "asc") ? items.OrderBy(g => g.m9).ToList() : items.OrderByDescending(g => g.m9).ToList(); break;
                                    case "m10": items = (order == "asc") ? items.OrderBy(g => g.m10).ToList() : items.OrderByDescending(g => g.m10).ToList(); break;
                                    case "m11": items = (order == "asc") ? items.OrderBy(g => g.m11).ToList() : items.OrderByDescending(g => g.m11).ToList(); break;
                                    case "m12": items = (order == "asc") ? items.OrderBy(g => g.m12).ToList() : items.OrderByDescending(g => g.m12).ToList(); break;
                                }
                        if (mode == "excel-structure")
                        {
                            return GetAnnualExcel(items, year, "structure");
                        } else
                        {
                            return new JsonResult(new
                            {
                                total_count = items.Count(),
                                incomplete_result = false,
                                items = items,
                                curr = year,
                            })
                            {
                                StatusCode = StatusCodes.Status200OK
                            };
                        }

                    default:
                        dynamic dres;
                        switch (mode)
                        {
                            case "well":
                            case "structure":
                                dres = _wpa.Distinct<string>(mode, xcolfilter).ToEnumerable().OrderBy(t => t).ToList();
                                break;

                            default:
                                dres = _wpa.Distinct<decimal?>(mode, xcolfilter).ToEnumerable().OrderBy(t => t).ToList();
                                break;
                        }

                        return new JsonResult(new
                        {
                            //total_count = res.Count(),
                            items = dres,
                        });
                }
            } else
            {
                return BadRequest();
            }
            
        }

        private ActionResult GetAnnualExcel(List<WellPerformanceAnnual> items, int year, string grouping)
        {
            var workbook = new ExcelPackage();
            var ws = workbook.Workbook.Worksheets.Add(year.ToString());
            ws.Cells[1, 1].Value = (grouping == "well") ? "Well" : "Structure";
            ws.Cells[1, 1, 2, 1].Merge = true;
            ws.Cells[1, 2].Value = year;
            ws.Cells[1, 2, 1, 13].Merge = true;

            ws.Cells[2, 2].Value = "Jan";
            ws.Cells[2, 3].Value = "Feb";
            ws.Cells[2, 4].Value = "Mar";
            ws.Cells[2, 5].Value = "Apr";
            ws.Cells[2, 6].Value = "May";
            ws.Cells[2, 7].Value = "Jun";
            ws.Cells[2, 8].Value = "Jul";
            ws.Cells[2, 9].Value = "Aug";
            ws.Cells[2, 10].Value = "Sep";
            ws.Cells[2, 11].Value = "Oct";
            ws.Cells[2, 12].Value = "Nov";
            ws.Cells[2, 13].Value = "Dec";

            ws.Cells[1, 1, 2, 13].Style.Font.Bold = true;
            ws.Cells[1, 1, 2, 13].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            ws.Cells[1, 1, 2, 13].Style.VerticalAlignment = ExcelVerticalAlignment.Top;

            for (int c = 1; c <= 6; c++)
            {
                //ws.Column(c).AutoFit();
            }

            for (int i = 0; i < items.Count(); i++)
            {
                var t = items.ElementAt(i);
                ws.Cells[3 + i, 1].Value = (grouping == "well") ? t.well : t.structure;
                ws.Cells[3 + i, 2].Value = t.m1;
                ws.Cells[3 + i, 3].Value = t.m2;
                ws.Cells[3 + i, 4].Value = t.m3;
                ws.Cells[3 + i, 5].Value = t.m4;
                ws.Cells[3 + i, 6].Value = t.m5;
                ws.Cells[3 + i, 7].Value = t.m6;
                ws.Cells[3 + i, 8].Value = t.m7;
                ws.Cells[3 + i, 9].Value = t.m8;
                ws.Cells[3 + i, 10].Value = t.m9;
                ws.Cells[3 + i, 11].Value = t.m10;
                ws.Cells[3 + i, 12].Value = t.m11;
                ws.Cells[3 + i, 13].Value = t.m12;
            }

            MemoryStream memoryStream = new MemoryStream(workbook.GetAsByteArray());
            memoryStream.Position = 0;
            return File(memoryStream, "application/vnd.ms-excel", "WellPerformance-Annual.xlsx");
        }

        [Authorize("PeWellPerformance Read")]
        [HttpGet("Monthly")]
        public ActionResult GetMonthly(String sort = "date", String order = "desc", int page = 0, int pagesize = 50, String filter = "", String columnfilter = "", string mode = "")
        {
            FilterDefinition<WellPerformance> xcolfilter = Builders<WellPerformance>.Filter.Eq(t => t.uid, User.Identity.Name);

            if (!String.IsNullOrWhiteSpace(columnfilter))
            {
                WellPerformanceList colfilter = JsonConvert.DeserializeObject<WellPerformanceList>(columnfilter);
                //if (colfilter.month?.Length > 0) xcolfilter = xcolfilter & Builders<WellPerformance>.Filter.Or(colfilter.month.ToList().Select(c => Builders<WellPerformance>.Filter.Eq(t => t.month, c)));
                //if (colfilter.year?.Length > 0) xcolfilter = xcolfilter & Builders<WellPerformance>.Filter.Or(colfilter.year.ToList().Select(c => Builders<WellPerformance>.Filter.Eq(t => t.year, c)));
                if (colfilter.well?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellPerformance>.Filter.Or(colfilter.well.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellPerformance>.Filter.Regex(t => t.well, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.structure?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellPerformance>.Filter.Or(colfilter.structure.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellPerformance>.Filter.Regex(t => t.structure, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.gross_prev?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellPerformance>.Filter.Or(colfilter.gross_prev.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellPerformance>.Filter.Eq(t => t.gross_prev, Convert.ToDecimal(c))));
                if (colfilter.net_prev?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellPerformance>.Filter.Or(colfilter.net_prev.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellPerformance>.Filter.Eq(t => t.net_prev, Convert.ToDecimal(c))));
                if (colfilter.wc_prev?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellPerformance>.Filter.Or(colfilter.wc_prev.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellPerformance>.Filter.Eq(t => t.wc_prev, Convert.ToDecimal(c))));
                if (colfilter.gross?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellPerformance>.Filter.Or(colfilter.gross.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellPerformance>.Filter.Eq(t => t.gross, Convert.ToDecimal(c))));
                if (colfilter.net?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellPerformance>.Filter.Or(colfilter.net.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellPerformance>.Filter.Eq(t => t.net, Convert.ToDecimal(c))));
                if (colfilter.wc?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellPerformance>.Filter.Or(colfilter.wc.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellPerformance>.Filter.Eq(t => t.wc, Convert.ToDecimal(c))));
                if (colfilter.gross_gap?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellPerformance>.Filter.Or(colfilter.gross_gap.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellPerformance>.Filter.Eq(t => t.gross_gap, Convert.ToDecimal(c))));
                if (colfilter.net_gap?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellPerformance>.Filter.Or(colfilter.net_gap.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellPerformance>.Filter.Eq(t => t.net_gap, Convert.ToDecimal(c))));
                if (colfilter.wc_gap?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellPerformance>.Filter.Or(colfilter.wc_gap.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellPerformance>.Filter.Eq(t => t.wc_gap, Convert.ToDecimal(c))));

                foreach (string log in DailyCommon._logical)
                {
                    if (colfilter.well?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.well.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$well\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.structure?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.structure.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$structure\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.gross_prev?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.gross_prev.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$gross_prev\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.net_prev?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.net_prev.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$net_prev\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.wc_prev?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.wc_prev.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$wc_prev\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.gross?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.gross.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$gross\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.net?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.net.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$net\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.wc?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.wc.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$wc\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.gross_gap?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.gross_gap.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$gross_gap\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.net_gap?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.net_gap.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$net_gap\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.wc_gap?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.wc_gap.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$wc_gap\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                }
                DateTime date = DateTime.Parse(colfilter.date[0].ToString());
                DateTime date_prev = DateTime.Parse(colfilter.date_prev[0].ToString());
                string curr = date.ToString("MM yyyy");
                string prev = date_prev.ToString("MM yyyy");
                string str = "{$or:[{$expr:{$eq:[{$dateToString:{format:\"%m %Y\",date:\"$date\",timezone:\"" + TimeZoneInfo.Local.DisplayName.Substring(4, 6) + "\"}},\"" + curr + "\"]}},{$expr:{$eq:[{$dateToString:{format:\"%m %Y\",date:\"$date\",timezone:\"" + TimeZoneInfo.Local.DisplayName.Substring(4, 6) + "\"}},\"" + prev + "\"]}}]}";

                List<WellPerformance> res = _daily.Find(str).Project<Daily>(_fields_daily).ToList().GroupBy(r => new
                {
                    well = r.well,
                    structure = r.structure?.name,
                }).Select(s => new WellPerformance
                {
                    well = s.Key.well,
                    structure = s.Key.structure,

                    gross = (s.Where(u => u.date.Value.ToLocalTime().ToString("MM yyyy") == curr).Count() > 0) ? s.Where(u => u.date.Value.ToLocalTime().ToString("MM yyyy") == curr).Sum(t => t.last_prod_gross) / s.Where(u => u.date.Value.ToLocalTime().ToString("MM yyyy") == curr).Count() : null,
                    net = (s.Where(u => u.date.Value.ToLocalTime().ToString("MM yyyy") == curr).Count() > 0) ? s.Where(u => u.date.Value.ToLocalTime().ToString("MM yyyy") == curr).Sum(t => t.last_prod_net) / s.Where(u => u.date.Value.ToLocalTime().ToString("MM yyyy") == curr).Count() : null,
                    wc = (s.Where(u => u.date.Value.ToLocalTime().ToString("MM yyyy") == curr).Sum(t => t.last_prod_gross) > 0) ? (s.Where(u => u.date.Value.ToLocalTime().ToString("MM yyyy") == curr).Sum(t => t.last_prod_gross) - s.Where(u => u.date.Value.ToLocalTime().ToString("MM yyyy") == curr).Sum(t => t.last_prod_net)) / s.Where(u => u.date.Value.ToLocalTime().ToString("MM yyyy") == curr).Sum(t => t.last_prod_gross) : null,

                    gross_prev = (s.Where(u => u.date.Value.ToLocalTime().ToString("MM yyyy") == prev).Count() > 0) ? s.Where(u => u.date.Value.ToLocalTime().ToString("MM yyyy") == prev).Sum(t => t.last_prod_gross) / s.Where(u => u.date.Value.ToLocalTime().ToString("MM yyyy") == prev).Count() : null,
                    net_prev = (s.Where(u => u.date.Value.ToLocalTime().ToString("MM yyyy") == prev).Count() > 0) ? s.Where(u => u.date.Value.ToLocalTime().ToString("MM yyyy") == prev).Sum(t => t.last_prod_net) / s.Where(u => u.date.Value.ToLocalTime().ToString("MM yyyy") == prev).Count() : null,
                    wc_prev = (s.Where(u => u.date.Value.ToLocalTime().ToString("MM yyyy") == prev).Sum(t => t.last_prod_gross) > 0) ? (s.Where(u => u.date.Value.ToLocalTime().ToString("MM yyyy") == prev).Sum(t => t.last_prod_gross) - s.Where(u => u.date.Value.ToLocalTime().ToString("MM yyyy") == prev).Sum(t => t.last_prod_net)) / s.Where(u => u.date.Value.ToLocalTime().ToString("MM yyyy") == prev).Sum(t => t.last_prod_gross) : null,

                    gross_gap = (s.Where(u => u.date.Value.ToLocalTime().ToString("MM yyyy") == curr).Count() > 0 && s.Where(u => u.date.Value.ToLocalTime().ToString("MM yyyy") == prev).Count() > 0) ? (s.Where(u => u.date.Value.ToLocalTime().ToString("MM yyyy") == curr).Sum(t => t.last_prod_gross) / s.Where(u => u.date.Value.ToLocalTime().ToString("MM yyyy") == curr).Count()) - (s.Where(u => u.date.Value.ToLocalTime().ToString("MM yyyy") == prev).Sum(t => t.last_prod_gross) / s.Where(u => u.date.Value.ToLocalTime().ToString("MM yyyy") == prev).Count()) : null,
                    net_gap = (s.Where(u => u.date.Value.ToLocalTime().ToString("MM yyyy") == curr).Count() > 0 && s.Where(u => u.date.Value.ToLocalTime().ToString("MM yyyy") == prev).Count() > 0) ? (s.Where(u => u.date.Value.ToLocalTime().ToString("MM yyyy") == curr).Sum(t => t.last_prod_net) / s.Where(u => u.date.Value.ToLocalTime().ToString("MM yyyy") == curr).Count()) - (s.Where(u => u.date.Value.ToLocalTime().ToString("MM yyyy") == prev).Sum(t => t.last_prod_net) / s.Where(u => u.date.Value.ToLocalTime().ToString("MM yyyy") == prev).Count()) : null,
                    wc_gap = (s.Where(u => u.date.Value.ToLocalTime().ToString("MM yyyy") == curr).Sum(t => t.last_prod_gross) > 0 && s.Where(u => u.date.Value.ToLocalTime().ToString("MM yyyy") == prev).Sum(t => t.last_prod_gross) > 0) ? ((s.Where(u => u.date.Value.ToLocalTime().ToString("MM yyyy") == curr).Sum(t => t.last_prod_gross) - s.Where(u => u.date.Value.ToLocalTime().ToString("MM yyyy") == curr).Sum(t => t.last_prod_net)) / s.Where(u => u.date.Value.ToLocalTime().ToString("MM yyyy") == curr).Sum(t => t.last_prod_gross)) - ((s.Where(u => u.date.Value.ToLocalTime().ToString("MM yyyy") == prev).Sum(t => t.last_prod_gross) - s.Where(u => u.date.Value.ToLocalTime().ToString("MM yyyy") == prev).Sum(t => t.last_prod_net)) / s.Where(u => u.date.Value.ToLocalTime().ToString("MM yyyy") == prev).Sum(t => t.last_prod_gross)) : null,
                }).ToList();

                _wp.DeleteMany(Builders<WellPerformance>.Filter.Eq(t => t.uid, User.Identity.Name));

                foreach (WellPerformance item in res)
                {
                    var insert = new WellPerformance
                    {
                        uid = User.Identity.Name,
                        well = item.well,
                        structure = item.structure,
                        year = date.Year,
                        month = date.Month,
                        gross_prev = item.gross_prev,
                        net_prev = item.net_prev,
                        wc_prev = item.wc_prev,
                        gross = item.gross,
                        net = item.net,
                        wc = item.wc,
                        gross_gap = item.gross_gap,
                        gross_gap_sort = (item.gross_gap * 1000000) + 1000000000000,
                        net_gap = item.net_gap,
                        net_gap_sort = (item.net_gap * 1000000) + 1000000000000,
                        wc_gap = item.wc_gap,
                        wc_gap_sort = (item.wc_gap*1000000)+1000000000000,
                    };
                    _wp.InsertOne(insert);
                }

                var _items = _wp.Find(xcolfilter, new FindOptions() { Collation = new Collation("en_US", numericOrdering: true) });
                var total_count = _items.CountDocuments();

                if (mode != "grouping-structure") { 
                    switch (sort)
                        {
                            case "well": _items = (order == "asc") ? _items.SortBy(t => t.well) : _items.SortByDescending(t => t.well); break;
                            case "gross_prev": _items = (order == "asc") ? _items.SortBy(t => t.gross_prev) : _items.SortByDescending(t => t.gross_prev); break;
                            case "net_prev": _items = (order == "asc") ? _items.SortBy(t => t.net_prev) : _items.SortByDescending(t => t.net_prev); break;
                            case "wc_prev": _items = (order == "asc") ? _items.SortBy(t => t.wc_prev) : _items.SortByDescending(t => t.wc_prev); break;
                            case "gross": _items = (order == "asc") ? _items.SortBy(t => t.gross) : _items.SortByDescending(t => t.gross); break;
                            case "net": _items = (order == "asc") ? _items.SortBy(t => t.net) : _items.SortByDescending(t => t.net); break;
                            case "wc": _items = (order == "asc") ? _items.SortBy(t => t.wc) : _items.SortByDescending(t => t.wc); break;
                            case "gross_gap": _items = (order == "asc") ? _items.SortBy(t => t.gross_gap_sort) : _items.SortByDescending(t => t.gross_gap_sort); break;
                            case "net_gap": _items = (order == "asc") ? _items.SortBy(t => t.net_gap_sort) : _items.SortByDescending(t => t.net_gap_sort); break;
                            case "wc_gap": _items = (order == "asc") ? _items.SortBy(t => t.wc_gap_sort) : _items.SortByDescending(t => t.wc_gap_sort); break;
                        }
                }

                switch (mode)
                {
                    case "":
                    case "grouping-well":
                    case null:
                        List<WellPerformance> items = _items
                        .Skip(page * pagesize)
                        .Limit(pagesize)
                        .Project<WellPerformance>(_fields_wp).ToList();

                        return new JsonResult(new
                        {
                            total_count = total_count,
                            incomplete_result = false,
                            items = items,
                            curr = date.ToString("MMM-yyyy"),
                            prev = date_prev.ToString("MMM-yyyy"),
                        })
                        {
                            StatusCode = StatusCodes.Status200OK
                        };

                    case "excel-well":
                        return GetMonthlyExcel(_items.Project<WellPerformance>(_fields_wp).ToList(), curr, prev, "well");

                    case "grouping-structure":
                    case "excel-structure":
                        items = _items.Project<WellPerformance>(_fields_wp).ToList()
                            .GroupBy(g => new
                            {
                                structure = g.structure
                            }).Select(s => new WellPerformance
                            {
                                structure = s.Key.structure,
                                year = s.First().year,
                                month = s.First().month,
                                gross_prev = s.Sum(m => m.gross_prev),
                                net_prev = s.Sum(m => m.net_prev),
                                wc_prev = s.Sum(m => m.gross_prev) > 0 ? (s.Sum(m => m.gross_prev) - s.Sum(m => m.net_prev)) / s.Sum(m => m.gross_prev) : null,
                                gross = s.Sum(m => m.gross),
                                net = s.Sum(m => m.net),
                                wc = s.Sum(m => m.gross) > 0 ? (s.Sum(m => m.gross) - s.Sum(m => m.net)) / s.Sum(m => m.gross) : null,
                                gross_gap = s.Sum(m => m.gross_gap),
                                net_gap = s.Sum(m => m.net_gap),
                                wc_gap = (s.Sum(m => m.gross) > 0 && s.Sum(m => m.gross_prev) > 0) ? ((s.Sum(m => m.gross) - s.Sum(m => m.net)) / s.Sum(m => m.gross)) - ((s.Sum(m => m.gross_prev) - s.Sum(m => m.net_prev)) / s.Sum(m => m.gross_prev)) : null,

                            }).ToList();

                            switch (sort)
                            {
                                case "structure": items = (order == "asc") ? items.OrderBy(t => t.well).ToList() : items.OrderByDescending(t => t.structure).ToList(); break;
                                case "gross_prev": items = (order == "asc") ? items.OrderBy(t => t.gross_prev).ToList() : items.OrderByDescending(t => t.gross_prev).ToList(); break;
                                case "net_prev": items = (order == "asc") ? items.OrderBy(t => t.net_prev).ToList() : items.OrderByDescending(t => t.net_prev).ToList(); break;
                                case "wc_prev": items = (order == "asc") ? items.OrderBy(t => t.wc_prev).ToList() : items.OrderByDescending(t => t.wc_prev).ToList(); break;
                                case "gross": items = (order == "asc") ? items.OrderBy(t => t.gross).ToList() : items.OrderByDescending(t => t.gross).ToList(); break;
                                case "net": items = (order == "asc") ? items.OrderBy(t => t.net).ToList() : items.OrderByDescending(t => t.net).ToList(); break;
                                case "wc": items = (order == "asc") ? items.OrderBy(t => t.wc).ToList() : items.OrderByDescending(t => t.wc).ToList(); break;
                                case "gross_gap": items = (order == "asc") ? items.OrderBy(t => t.gross_gap).ToList() : items.OrderByDescending(t => t.gross_gap).ToList(); break;
                                case "net_gap": items = (order == "asc") ? items.OrderBy(t => t.net_gap).ToList() : items.OrderByDescending(t => t.net_gap).ToList(); break;
                                case "wc_gap": items = (order == "asc") ? items.OrderBy(t => t.wc_gap).ToList() : items.OrderByDescending(t => t.wc_gap).ToList(); break;
                            }

                        if (mode == "excel-structure")
                        {
                            return GetMonthlyExcel(items, curr, prev, "structure");
                        } else
                        {
                            return new JsonResult(new
                            {
                                total_count = items.Count(),
                                incomplete_result = false,
                                items = items,
                                curr = date.ToString("MMM-yyyy"),
                                prev = date_prev.ToString("MMM-yyyy"),
                            })
                            {
                                StatusCode = StatusCodes.Status200OK
                            };
                        }

                    default:
                        dynamic dres;
                        switch (mode)
                        {
                            case "well":
                            case "structure":
                                dres = _wp.Distinct<string>(mode, xcolfilter).ToEnumerable().OrderBy(t => t).ToList();
                                break;

                            default:
                                dres = _wp.Distinct<decimal?>(mode, xcolfilter).ToEnumerable().OrderBy(t => t).ToList();
                                break;
                        }

                        return new JsonResult(new
                        {
                            //total_count = res.Count(),
                            items = dres,
                        });
                }
                
            } else
            {
                return BadRequest();
            }
                
        }

        private ActionResult GetMonthlyExcel(List<WellPerformance> items, string curr, string prev, string grouping)
        {
            var workbook = new ExcelPackage();
            var ws = workbook.Workbook.Worksheets.Add(curr);
            ws.Cells[1, 1].Value = (grouping == "well") ? "Well" : "Structure";
            ws.Cells[1, 1, 3, 1].Merge = true;
            ws.Cells[1, 2].Value = "Monthly";
            ws.Cells[1, 2, 1, 10].Merge = true;
            ws.Cells[2, 2].Value = prev;
            ws.Cells[2, 2, 2, 4].Merge = true;
            ws.Cells[2, 5].Value = curr;
            ws.Cells[2, 5, 2, 7].Merge = true;
            ws.Cells[2, 8].Value = "Gain/Loss";
            ws.Cells[2, 8, 2, 10].Merge = true;

            ws.Cells[3, 2].Value = "Gross";
            ws.Cells[3, 3].Value = "Net";
            ws.Cells[3, 4].Value = "WC";
            ws.Cells[3, 5].Value = "Gross";
            ws.Cells[3, 6].Value = "Net";
            ws.Cells[3, 7].Value = "WC";
            ws.Cells[3, 8].Value = "Gross";
            ws.Cells[3, 9].Value = "Net";
            ws.Cells[3, 10].Value = "WC";

            ws.Cells[1, 1, 3, 10].Style.Font.Bold = true;
            ws.Cells[1, 1, 3, 10].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            ws.Cells[1, 1, 3, 10].Style.VerticalAlignment = ExcelVerticalAlignment.Top;

            for (int c = 1; c <= 6; c++)
            {
                //ws.Column(c).AutoFit();
            }

            for (int i = 0; i < items.Count(); i++)
            {
                var t = items.ElementAt(i);
                ws.Cells[4 + i, 1].Value = (grouping == "well") ? t.well : t.structure;
                ws.Cells[4 + i, 2].Value = t.gross_prev;
                ws.Cells[4 + i, 3].Value = t.net_prev;
                ws.Cells[4 + i, 4].Value = t.wc_prev;
                ws.Cells[4 + i, 5].Value = t.gross;
                ws.Cells[4 + i, 6].Value = t.net;
                ws.Cells[4 + i, 7].Value = t.wc;
                ws.Cells[4 + i, 8].Value = t.gross_gap;
                ws.Cells[4 + i, 9].Value = t.net_gap;
                ws.Cells[4 + i, 10].Value = t.wc_gap;
            }

            MemoryStream memoryStream = new MemoryStream(workbook.GetAsByteArray());
            memoryStream.Position = 0;
            return File(memoryStream, "application/vnd.ms-excel", "WellPerformance-Monthly.xlsx");
        }

        [Authorize("PeWellPerformance Read")]
        [HttpGet("Weekly")]
        public ActionResult GetWeekly(String sort = "date", String order = "desc", int page = 0, int pagesize = 50, String filter = "", String columnfilter = "", string mode = "")
        {
            FilterDefinition<WellPerformance> xcolfilter = Builders<WellPerformance>.Filter.Eq(t => t.uid, User.Identity.Name);

            if (!String.IsNullOrWhiteSpace(columnfilter))
            {
                WellPerformanceList colfilter = JsonConvert.DeserializeObject<WellPerformanceList>(columnfilter);
                if (colfilter.well?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellPerformance>.Filter.Or(colfilter.well.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellPerformance>.Filter.Regex(t => t.well, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.structure?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellPerformance>.Filter.Or(colfilter.structure.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellPerformance>.Filter.Regex(t => t.structure, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.gross_prev?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellPerformance>.Filter.Or(colfilter.gross_prev.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellPerformance>.Filter.Eq(t => t.gross_prev, Convert.ToDecimal(c))));
                if (colfilter.net_prev?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellPerformance>.Filter.Or(colfilter.net_prev.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellPerformance>.Filter.Eq(t => t.net_prev, Convert.ToDecimal(c))));
                if (colfilter.wc_prev?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellPerformance>.Filter.Or(colfilter.wc_prev.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellPerformance>.Filter.Eq(t => t.wc_prev, Convert.ToDecimal(c))));
                if (colfilter.gross?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellPerformance>.Filter.Or(colfilter.gross.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellPerformance>.Filter.Eq(t => t.gross, Convert.ToDecimal(c))));
                if (colfilter.net?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellPerformance>.Filter.Or(colfilter.net.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellPerformance>.Filter.Eq(t => t.net, Convert.ToDecimal(c))));
                if (colfilter.wc?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellPerformance>.Filter.Or(colfilter.wc.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellPerformance>.Filter.Eq(t => t.wc, Convert.ToDecimal(c))));
                if (colfilter.gross_gap?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellPerformance>.Filter.Or(colfilter.gross_gap.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellPerformance>.Filter.Eq(t => t.gross_gap, Convert.ToDecimal(c))));
                if (colfilter.net_gap?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellPerformance>.Filter.Or(colfilter.net_gap.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellPerformance>.Filter.Eq(t => t.net_gap, Convert.ToDecimal(c))));
                if (colfilter.wc_gap?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellPerformance>.Filter.Or(colfilter.wc_gap.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellPerformance>.Filter.Eq(t => t.wc_gap, Convert.ToDecimal(c))));

                foreach (string log in DailyCommon._logical)
                {
                    if (colfilter.well?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.well.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$well\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.structure?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.structure.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$structure\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.gross_prev?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.gross_prev.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$gross_prev\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.net_prev?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.net_prev.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$net_prev\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.wc_prev?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.wc_prev.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$wc_prev\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.gross?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.gross.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$gross\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.net?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.net.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$net\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.wc?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.wc.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$wc\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.gross_gap?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.gross_gap.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$gross_gap\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.net_gap?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.net_gap.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$net_gap\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.wc_gap?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.wc_gap.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$wc_gap\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                }

                DateTime date = DateTime.Parse(colfilter.date[0].ToString());
                DateTime date_prev = DateTime.Parse(colfilter.date_prev[0].ToString());
                string curr = WeekYear(date);
                string prev = WeekYear(date_prev);
                string str = "{$or:[{$expr:{$eq:[{$dateToString:{format:\"%V %Y\",date:\"$date\",timezone:\"" + TimeZoneInfo.Local.DisplayName.Substring(4, 6) + "\"}},\"" + curr + "\"]}},{$expr:{$eq:[{$dateToString:{format:\"%V %Y\",date:\"$date\",timezone:\"" + TimeZoneInfo.Local.DisplayName.Substring(4, 6) + "\"}},\"" + prev + "\"]}}]}";
                //string str2 = "{$or:[{$expr:{$eq:[{$dateToString:{format:\"%V %Y\",date:\"$date\",timezone:\"+08:00\"}},\"" + curr + "\"]}},{$expr:{$eq:[{$dateToString:{format:\"%V %Y\",date:\"$date\",timezone:\"+08:00\"}},\""+prev+"\"]}}]}";
               


                List<WellPerformance> res = _daily.Find(str).Project<Daily>(_fields_daily).ToEnumerable().GroupBy(r => new
                {
                    well = r.well,
                    structure = r.structure?.name,
                }).Select(s => new WellPerformance
                {
                    well = s.Key.well,
                    structure = s.Key.structure,

                   // gross = (s.Where(u => WeekYear(u.date.Value.ToLocalTime()) == curr).Count() > 0) ? s.Where(u => WeekYear(u.date.Value.ToLocalTime()) == curr).Sum(t => t.last_prod_gross) / s.Where(u => WeekYear(u.date.Value.ToLocalTime()) == curr).Count() : null,
                    gross = (s.Where(u => WeekYear(u.date.Value.ToLocalTime()) == curr).Count() > 0 ) ? s.Where(u => WeekYear(u.date.Value.ToLocalTime()) == curr).Sum(t => t.last_prod_gross) / s.Where(u => WeekYear(u.date.Value.ToLocalTime()) == curr).Count() : null,
                    net = (s.Where(u => WeekYear(u.date.Value.ToLocalTime()) == curr).Count() > 0) ? s.Where(u => WeekYear(u.date.Value.ToLocalTime()) == curr).Sum(t => t.last_prod_net) / s.Where(u => WeekYear(u.date.Value.ToLocalTime()) == curr).Count() : null,
                    wc = (s.Where(u => WeekYear(u.date.Value.ToLocalTime()) == curr).Sum(t => t.last_prod_gross) > 0) ? (s.Where(u => WeekYear(u.date.Value.ToLocalTime()) == curr).Sum(t => t.last_prod_gross) - s.Where(u => WeekYear(u.date.Value.ToLocalTime()) == curr).Sum(t => t.last_prod_net)) / s.Where(u => WeekYear(u.date.Value.ToLocalTime()) == curr).Sum(t => t.last_prod_gross) : null,
                   
                    gross_prev = (s.Where(u => WeekYear(u.date.Value.ToLocalTime()) == prev).Count() > 0) ? s.Where(u => WeekYear(u.date.Value.ToLocalTime()) == prev).Sum(t => t.last_prod_gross) / s.Where(u => WeekYear(u.date.Value.ToLocalTime()) == prev).Count() : null,
                    net_prev = (s.Where(u => WeekYear(u.date.Value.ToLocalTime()) == prev).Count() > 0) ? s.Where(u => WeekYear(u.date.Value.ToLocalTime()) == prev).Sum(t => t.last_prod_net) / s.Where(u => WeekYear(u.date.Value.ToLocalTime()) == prev).Count() : null,
                    wc_prev = (s.Where(u => WeekYear(u.date.Value.ToLocalTime()) == prev).Sum(t => t.last_prod_gross) > 0) ? (s.Where(u => WeekYear(u.date.Value.ToLocalTime()) == prev).Sum(t => t.last_prod_gross) - s.Where(u => WeekYear(u.date.Value.ToLocalTime()) == prev).Sum(t => t.last_prod_net)) / s.Where(u => WeekYear(u.date.Value.ToLocalTime()) == prev).Sum(t => t.last_prod_gross) : null,

                    gross_gap = (s.Where(u => WeekYear(u.date.Value.ToLocalTime()) == curr).Count() > 0 && s.Where(u => WeekYear(u.date.Value.ToLocalTime()) == prev).Count() > 0) ? (s.Where(u => WeekYear(u.date.Value.ToLocalTime()) == curr).Sum(t => t.last_prod_gross) / s.Where(u => WeekYear(u.date.Value.ToLocalTime()) == curr).Count()) - (s.Where(u => WeekYear(u.date.Value.ToLocalTime()) == prev).Sum(t => t.last_prod_gross) / s.Where(u => WeekYear(u.date.Value.ToLocalTime()) == prev).Count()) : null,
                    net_gap = (s.Where(u => WeekYear(u.date.Value.ToLocalTime()) == curr).Count() > 0 && s.Where(u => WeekYear(u.date.Value.ToLocalTime()) == prev).Count() > 0) ? (s.Where(u => WeekYear(u.date.Value.ToLocalTime()) == curr).Sum(t => t.last_prod_net) / s.Where(u => WeekYear(u.date.Value.ToLocalTime()) == curr).Count()) - (s.Where(u => WeekYear(u.date.Value.ToLocalTime()) == prev).Sum(t => t.last_prod_net) / s.Where(u => WeekYear(u.date.Value.ToLocalTime()) == prev).Count()) : null,
                    wc_gap = (s.Where(u => WeekYear(u.date.Value.ToLocalTime()) == curr).Sum(t => t.last_prod_gross) > 0 && s.Where(u => WeekYear(u.date.Value.ToLocalTime()) == prev).Sum(t => t.last_prod_gross) > 0) ? ((s.Where(u => WeekYear(u.date.Value.ToLocalTime()) == curr).Sum(t => t.last_prod_gross) - s.Where(u => WeekYear(u.date.Value.ToLocalTime()) == curr).Sum(t => t.last_prod_net)) / s.Where(u => WeekYear(u.date.Value.ToLocalTime()) == curr).Sum(t => t.last_prod_gross)) - ((s.Where(u => WeekYear(u.date.Value.ToLocalTime()) == prev).Sum(t => t.last_prod_gross) - s.Where(u => WeekYear(u.date.Value.ToLocalTime()) == prev).Sum(t => t.last_prod_net)) / s.Where(u => WeekYear(u.date.Value.ToLocalTime()) == prev).Sum(t => t.last_prod_gross)) : null,
                }).ToList();

                _wp.DeleteMany(Builders<WellPerformance>.Filter.Eq(t => t.uid, User.Identity.Name));

                foreach (WellPerformance item in res)
                {
                    var insert = new WellPerformance
                    {
                        uid = User.Identity.Name,
                        well = item.well,
                        structure = item.structure,
                        year = date.Year,
                        month = date.Month,
                        gross_prev = item.gross_prev,
                        net_prev = item.net_prev,
                        wc_prev = item.wc_prev,
                        gross = item.gross,
                        net = item.net,
                        wc = item.wc,
                        gross_gap = item.gross_gap,
                        gross_gap_sort = (item.gross_gap * 1000000) + 1000000000000,
                        net_gap = item.net_gap,
                        net_gap_sort = (item.net_gap * 1000000) + 1000000000000,
                        wc_gap = item.wc_gap,
                        wc_gap_sort = (item.wc_gap * 1000000) + 1000000000000,
                    };
                    _wp.InsertOne(insert);
                }

                var _items = _wp.Find(xcolfilter, new FindOptions() { Collation = new Collation("en_US", numericOrdering: true) });
                var total_count = _items.CountDocuments();

                if(mode != "grouping-structure") { 
                    switch (sort)
                    {
                        case "well": _items = (order == "asc") ? _items.SortBy(t => t.well) : _items.SortByDescending(t => t.well); break;
                        case "gross_prev": _items = (order == "asc") ? _items.SortBy(t => t.gross_prev) : _items.SortByDescending(t => t.gross_prev); break;
                        case "net_prev": _items = (order == "asc") ? _items.SortBy(t => t.net_prev) : _items.SortByDescending(t => t.net_prev); break;
                        case "wc_prev": _items = (order == "asc") ? _items.SortBy(t => t.wc_prev) : _items.SortByDescending(t => t.wc_prev); break;
                        case "gross": _items = (order == "asc") ? _items.SortBy(t => t.gross) : _items.SortByDescending(t => t.gross); break;
                        case "net": _items = (order == "asc") ? _items.SortBy(t => t.net) : _items.SortByDescending(t => t.net); break;
                        case "wc": _items = (order == "asc") ? _items.SortBy(t => t.wc) : _items.SortByDescending(t => t.wc); break;
                        case "gross_gap": _items = (order == "asc") ? _items.SortBy(t => t.gross_gap_sort) : _items.SortByDescending(t => t.gross_gap_sort); break;
                        case "net_gap": _items = (order == "asc") ? _items.SortBy(t => t.net_gap_sort) : _items.SortByDescending(t => t.net_gap_sort); break;
                        case "wc_gap": _items = (order == "asc") ? _items.SortBy(t => t.wc_gap_sort) : _items.SortByDescending(t => t.wc_gap_sort); break;
                    }
                }

                switch (mode)
                {
                    case "":
                    case "grouping-well":
                    case null:
                        List<WellPerformance> items = _items
                        .Skip(page * pagesize)
                        .Limit(pagesize)
                        .Project<WellPerformance>(_fields_wp).ToList();

                        return new JsonResult(new
                        {
                            total_count = total_count,
                            incomplete_result = false,
                            items = items,
                            curr = curr,
                            prev = prev,
                        })
                        {
                            StatusCode = StatusCodes.Status200OK
                        };

                    case "excel-well":
                        return GetWeeklyExcel(_items.Project<WellPerformance>(_fields_wp).ToList(), curr, prev, "well");

                    case "grouping-structure":
                    case "excel-structure":
                        items = _items.Project<WellPerformance>(_fields_wp).ToList()
                            .GroupBy(g => new
                            {
                                structure = g.structure
                            }).Select(s => new WellPerformance
                            {
                                structure = s.Key.structure,
                                year = s.First().year,
                                month = s.First().month,
                                gross_prev = s.Sum(m => m.gross_prev),
                                net_prev = s.Sum(m => m.net_prev),
                                wc_prev = s.Sum(m => m.gross_prev) > 0 ? (s.Sum(m => m.gross_prev) - s.Sum(m => m.net_prev)) / s.Sum(m => m.gross_prev) : null,
                                gross = s.Sum(m => m.gross),
                                net = s.Sum(m => m.net),
                                wc = s.Sum(m => m.gross) > 0 ? (s.Sum(m => m.gross) - s.Sum(m => m.net)) / s.Sum(m => m.gross) : null,
                                gross_gap = s.Sum(m => m.gross_gap),
                                net_gap = s.Sum(m => m.net_gap),
                                wc_gap = (s.Sum(m => m.gross) > 0 && s.Sum(m => m.gross_prev) > 0) ? ((s.Sum(m => m.gross) - s.Sum(m => m.net)) / s.Sum(m => m.gross)) - ((s.Sum(m => m.gross_prev) - s.Sum(m => m.net_prev)) / s.Sum(m => m.gross_prev)) : null,

                            }).ToList();

                            switch (sort)
                            {
                                case "structure": items = (order == "asc") ? items.OrderBy(t => t.well).ToList() : items.OrderByDescending(t => t.structure).ToList(); break;
                                case "gross_prev": items = (order == "asc") ? items.OrderBy(t => t.gross_prev).ToList() : items.OrderByDescending(t => t.gross_prev).ToList(); break;
                                case "net_prev": items = (order == "asc") ? items.OrderBy(t => t.net_prev).ToList() : items.OrderByDescending(t => t.net_prev).ToList(); break;
                                case "wc_prev": items = (order == "asc") ? items.OrderBy(t => t.wc_prev).ToList() : items.OrderByDescending(t => t.wc_prev).ToList(); break;
                                case "gross": items = (order == "asc") ? items.OrderBy(t => t.gross).ToList() : items.OrderByDescending(t => t.gross).ToList(); break;
                                case "net": items = (order == "asc") ? items.OrderBy(t => t.net).ToList() : items.OrderByDescending(t => t.net).ToList(); break;
                                case "wc": items = (order == "asc") ? items.OrderBy(t => t.wc).ToList() : items.OrderByDescending(t => t.wc).ToList(); break;
                                case "gross_gap": items = (order == "asc") ? items.OrderBy(t => t.gross_gap).ToList() : items.OrderByDescending(t => t.gross_gap).ToList(); break;
                                case "net_gap": items = (order == "asc") ? items.OrderBy(t => t.net_gap).ToList() : items.OrderByDescending(t => t.net_gap).ToList(); break;
                                case "wc_gap": items = (order == "asc") ? items.OrderBy(t => t.wc_gap).ToList() : items.OrderByDescending(t => t.wc_gap).ToList(); break;
                            }

                        if (mode == "excel-structure")
                        {
                            return GetWeeklyExcel(items, curr, prev, "structure");
                        }
                        else
                        {
                            return new JsonResult(new
                            {
                                total_count = items.Count(),
                                incomplete_result = false,
                                items = items,
                                curr = curr,
                                prev = prev,
                            })
                            {
                                StatusCode = StatusCodes.Status200OK
                            };
                        }

                    default:
                        dynamic dres;
                        switch (mode)
                        {
                            case "well":
                            case "structure":
                                dres = _wp.Distinct<string>(mode, xcolfilter).ToEnumerable().OrderBy(t => t).ToList();
                                break;
                            default:
                                dres = _wp.Distinct<decimal?>(mode, xcolfilter).ToEnumerable().OrderBy(t => t).ToList();
                                break;
                        }

                        return new JsonResult(new
                        {
                            //total_count = res.Count(),
                            items = dres,
                        });
                }
                /*
                if (!excel)
                {
                    return Ok(new
                    {
                        curr = curr,
                        prev = prev,
                        data = res
                    });
                }
                else
                {
                    return GetWeeklyExcel(res, curr, prev);
                }*/
            } else
            {
                return BadRequest();
            }
                
        }

        private ActionResult GetWeeklyExcel(List<WellPerformance> items, string curr, string prev, string grouping)
        {
            var workbook = new ExcelPackage();
            var ws = workbook.Workbook.Worksheets.Add(curr);
            ws.Cells[1, 1].Value = (grouping == "well") ? "Well" : "Structure";
            ws.Cells[1, 1, 3, 1].Merge = true;
            ws.Cells[1, 2].Value = "Weekly";
            ws.Cells[1, 2, 1, 10].Merge = true;
            ws.Cells[2, 2].Value = prev;
            ws.Cells[2, 2, 2, 4].Merge = true;
            ws.Cells[2, 5].Value = curr;
            ws.Cells[2, 5, 2, 7].Merge = true;
            ws.Cells[2, 8].Value = "Gain/Loss";
            ws.Cells[2, 8, 2, 10].Merge = true;

            ws.Cells[3, 2].Value = "Gross";
            ws.Cells[3, 3].Value = "Net";
            ws.Cells[3, 4].Value = "WC";
            ws.Cells[3, 5].Value = "Gross";
            ws.Cells[3, 6].Value = "Net";
            ws.Cells[3, 7].Value = "WC";
            ws.Cells[3, 8].Value = "Gross";
            ws.Cells[3, 9].Value = "Net";
            ws.Cells[3, 10].Value = "WC";

            ws.Cells[1, 1, 3, 10].Style.Font.Bold = true;
            ws.Cells[1, 1, 3, 10].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            ws.Cells[1, 1, 3, 10].Style.VerticalAlignment = ExcelVerticalAlignment.Top;

            for (int c = 1; c <= 6; c++)
            {
                //ws.Column(c).AutoFit();
            }

            for (int i = 0; i < items.Count(); i++)
            {
                var t = items.ElementAt(i);
                ws.Cells[4 + i, 1].Value = (grouping == "well") ? t.well : t.structure;
                ws.Cells[4 + i, 2].Value = t.gross_prev;
                ws.Cells[4 + i, 3].Value = t.net_prev;
                ws.Cells[4 + i, 4].Value = t.wc_prev;
                ws.Cells[4 + i, 5].Value = t.gross;
                ws.Cells[4 + i, 6].Value = t.net;
                ws.Cells[4 + i, 7].Value = t.wc;
                ws.Cells[4 + i, 8].Value = t.gross_gap;
                ws.Cells[4 + i, 9].Value = t.net_gap;
                ws.Cells[4 + i, 10].Value = t.wc_gap;
            }

            MemoryStream memoryStream = new MemoryStream(workbook.GetAsByteArray());
            memoryStream.Position = 0;
            return File(memoryStream, "application/vnd.ms-excel", "WellPerformance-Weekly.xlsx");
        }

        private string WeekYear(DateTime date)
        {
            DateTime firstDay = new DateTime(date.Year, 1, 1);
            var fdow = ((int)firstDay.DayOfWeek + 6) % 7 + 1;
            decimal weeknum = Math.Ceiling((decimal)(date.DayOfYear + fdow - 1) / 7);
            var weeknum2 = CultureInfo.CurrentCulture.Calendar.GetWeekOfYear(date, CalendarWeekRule.FirstFullWeek, DayOfWeek.Monday);  
           // return weeknum.ToString().PadLeft(2, '0') + " " + date.Year;
            return weeknum2 + " " + date.Year;
        }

        [Authorize("PeWellPerformance Read")]
        [HttpGet("Daily")]
        public ActionResult GetDaily(String sort = "date", String order = "desc", int page = 0, int pagesize = 50, String filter = "", String columnfilter = "", string mode = "")
        {
            FilterDefinition<WellPerformance> xcolfilter = Builders<WellPerformance>.Filter.Eq(t => t.uid, User.Identity.Name);

            if (!String.IsNullOrWhiteSpace(columnfilter))
            {
                WellPerformanceList colfilter = JsonConvert.DeserializeObject<WellPerformanceList>(columnfilter);
                if (colfilter.well?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellPerformance>.Filter.Or(colfilter.well.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellPerformance>.Filter.Regex(t => t.well, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.structure?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellPerformance>.Filter.Or(colfilter.structure.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellPerformance>.Filter.Regex(t => t.structure, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.gross_prev?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellPerformance>.Filter.Or(colfilter.gross_prev.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellPerformance>.Filter.Eq(t => t.gross_prev, Convert.ToDecimal(c))));
                if (colfilter.net_prev?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellPerformance>.Filter.Or(colfilter.net_prev.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellPerformance>.Filter.Eq(t => t.net_prev, Convert.ToDecimal(c))));
                if (colfilter.wc_prev?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellPerformance>.Filter.Or(colfilter.wc_prev.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellPerformance>.Filter.Eq(t => t.wc_prev, Convert.ToDecimal(c))));
                if (colfilter.gross?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellPerformance>.Filter.Or(colfilter.gross.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellPerformance>.Filter.Eq(t => t.gross, Convert.ToDecimal(c))));
                if (colfilter.net?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellPerformance>.Filter.Or(colfilter.net.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellPerformance>.Filter.Eq(t => t.net, Convert.ToDecimal(c))));
                if (colfilter.wc?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellPerformance>.Filter.Or(colfilter.wc.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellPerformance>.Filter.Eq(t => t.wc, Convert.ToDecimal(c))));
                if (colfilter.gross_gap?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellPerformance>.Filter.Or(colfilter.gross_gap.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellPerformance>.Filter.Eq(t => t.gross_gap, Convert.ToDecimal(c))));
                if (colfilter.net_gap?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellPerformance>.Filter.Or(colfilter.net_gap.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellPerformance>.Filter.Eq(t => t.net_gap, Convert.ToDecimal(c))));
                if (colfilter.wc_gap?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellPerformance>.Filter.Or(colfilter.wc_gap.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellPerformance>.Filter.Eq(t => t.wc_gap, Convert.ToDecimal(c))));

                foreach (string log in DailyCommon._logical)
                {
                    if (colfilter.well?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.well.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$well\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.structure?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.structure.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$structure\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.gross_prev?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.gross_prev.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$gross_prev\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.net_prev?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.net_prev.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$net_prev\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.wc_prev?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.wc_prev.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$wc_prev\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.gross?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.gross.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$gross\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.net?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.net.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$net\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.wc?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.wc.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$wc\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.gross_gap?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.gross_gap.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$gross_gap\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.net_gap?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.net_gap.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$net_gap\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.wc_gap?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.wc_gap.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$wc_gap\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                }

                DateTime date = DateTime.Parse(colfilter.date[0].ToString());
                if (date == null) date = DateTime.Now.AddDays(-1);
                DateTime date_prev = DateTime.Parse(colfilter.date_prev[0].ToString());
                if (date_prev == null) date_prev = date.AddDays(-1);
                string curr = date.ToString("dd MM yyyy");
                string prev = date_prev.ToString("dd MM yyyy");
                string str = "{$or:[{$expr:{$eq:[{$dateToString:{format:\"%d %m %Y\",date:\"$date\",timezone:\"" + TimeZoneInfo.Local.DisplayName.Substring(4, 6) + "\"}},\"" + curr + "\"]}},{$expr:{$eq:[{$dateToString:{format:\"%d %m %Y\",date:\"$date\",timezone:\"" + TimeZoneInfo.Local.DisplayName.Substring(4, 6) + "\"}},\"" + prev + "\"]}}]}";

                List<WellPerformance> res = _daily.Find(str).Project<Daily>(_fields_daily).ToList().GroupBy(r => new
                {
                    well = r.well,
                    structure = r.structure?.name,
                }).Select(s => new WellPerformance
                {
                    well = s.Key.well,
                    structure = s.Key.structure,

                    gross = (s.Where(u => u.date.Value.ToLocalTime().ToString("dd MM yyyy") == curr).Count() > 0) ? s.Where(u => u.date.Value.ToLocalTime().ToString("dd MM yyyy") == curr).Sum(t => t.last_prod_gross) / s.Where(u => u.date.Value.ToLocalTime().ToString("dd MM yyyy") == curr).Count() : null,
                    net = (s.Where(u => u.date.Value.ToLocalTime().ToString("dd MM yyyy") == curr).Count() > 0) ? s.Where(u => u.date.Value.ToLocalTime().ToString("dd MM yyyy") == curr).Sum(t => t.last_prod_net) / s.Where(u => u.date.Value.ToLocalTime().ToString("dd MM yyyy") == curr).Count() : null,
                    wc = (s.Where(u => u.date.Value.ToLocalTime().ToString("dd MM yyyy") == curr).Sum(t => t.last_prod_gross) > 0) ? (s.Where(u => u.date.Value.ToLocalTime().ToString("dd MM yyyy") == curr).Sum(t => t.last_prod_gross) - s.Where(u => u.date.Value.ToLocalTime().ToString("dd MM yyyy") == curr).Sum(t => t.last_prod_net)) / s.Where(u => u.date.Value.ToLocalTime().ToString("dd MM yyyy") == curr).Sum(t => t.last_prod_gross) : null,

                    gross_prev = (s.Where(u => u.date.Value.ToLocalTime().ToString("dd MM yyyy") == prev).Count() > 0) ? s.Where(u => u.date.Value.ToLocalTime().ToString("dd MM yyyy") == prev).Sum(t => t.last_prod_gross) / s.Where(u => u.date.Value.ToLocalTime().ToString("dd MM yyyy") == prev).Count() : null,
                    net_prev = (s.Where(u => u.date.Value.ToLocalTime().ToString("dd MM yyyy") == prev).Count() > 0) ? s.Where(u => u.date.Value.ToLocalTime().ToString("dd MM yyyy") == prev).Sum(t => t.last_prod_net) / s.Where(u => u.date.Value.ToLocalTime().ToString("dd MM yyyy") == prev).Count() : null,
                    wc_prev = (s.Where(u => u.date.Value.ToLocalTime().ToString("dd MM yyyy") == prev).Sum(t => t.last_prod_gross) > 0) ? (s.Where(u => u.date.Value.ToLocalTime().ToString("dd MM yyyy") == prev).Sum(t => t.last_prod_gross) - s.Where(u => u.date.Value.ToLocalTime().ToString("dd MM yyyy") == prev).Sum(t => t.last_prod_net)) / s.Where(u => u.date.Value.ToLocalTime().ToString("dd MM yyyy") == prev).Sum(t => t.last_prod_gross) : null,

                    gross_gap = (s.Where(u => u.date.Value.ToLocalTime().ToString("dd MM yyyy") == curr).Count() > 0 && s.Where(u => u.date.Value.ToLocalTime().ToString("dd MM yyyy") == prev).Count() > 0) ? (s.Where(u => u.date.Value.ToLocalTime().ToString("dd MM yyyy") == curr).Sum(t => t.last_prod_gross) / s.Where(u => u.date.Value.ToLocalTime().ToString("dd MM yyyy") == curr).Count()) - (s.Where(u => u.date.Value.ToLocalTime().ToString("dd MM yyyy") == prev).Sum(t => t.last_prod_gross) / s.Where(u => u.date.Value.ToLocalTime().ToString("dd MM yyyy") == prev).Count()) : null,
                    net_gap = (s.Where(u => u.date.Value.ToLocalTime().ToString("dd MM yyyy") == curr).Count() > 0 && s.Where(u => u.date.Value.ToLocalTime().ToString("dd MM yyyy") == prev).Count() > 0) ? (s.Where(u => u.date.Value.ToLocalTime().ToString("dd MM yyyy") == curr).Sum(t => t.last_prod_net) / s.Where(u => u.date.Value.ToLocalTime().ToString("dd MM yyyy") == curr).Count()) - (s.Where(u => u.date.Value.ToLocalTime().ToString("dd MM yyyy") == prev).Sum(t => t.last_prod_net) / s.Where(u => u.date.Value.ToLocalTime().ToString("dd MM yyyy") == prev).Count()) : null,
                    wc_gap = (s.Where(u => u.date.Value.ToLocalTime().ToString("dd MM yyyy") == curr).Sum(t => t.last_prod_gross) > 0 && s.Where(u => u.date.Value.ToLocalTime().ToString("dd MM yyyy") == prev).Sum(t => t.last_prod_gross) > 0) ? ((s.Where(u => u.date.Value.ToLocalTime().ToString("dd MM yyyy") == curr).Sum(t => t.last_prod_gross) - s.Where(u => u.date.Value.ToLocalTime().ToString("dd MM yyyy") == curr).Sum(t => t.last_prod_net)) / s.Where(u => u.date.Value.ToLocalTime().ToString("dd MM yyyy") == curr).Sum(t => t.last_prod_gross)) - ((s.Where(u => u.date.Value.ToLocalTime().ToString("dd MM yyyy") == prev).Sum(t => t.last_prod_gross) - s.Where(u => u.date.Value.ToLocalTime().ToString("dd MM yyyy") == prev).Sum(t => t.last_prod_net)) / s.Where(u => u.date.Value.ToLocalTime().ToString("dd MM yyyy") == prev).Sum(t => t.last_prod_gross)) : null,
                }).ToList();

                _wp.DeleteMany(Builders<WellPerformance>.Filter.Eq(t => t.uid, User.Identity.Name));

                foreach (WellPerformance item in res)
                {
                    var insert = new WellPerformance
                    {
                        uid = User.Identity.Name,
                        well = item.well,
                        structure = item.structure,
                        year = date.Year,
                        month = date.Month,
                        gross_prev = item.gross_prev,
                        net_prev = item.net_prev,
                        wc_prev = item.wc_prev,
                        gross = item.gross,
                        net = item.net,
                        wc = item.wc,
                        gross_gap = item.gross_gap,
                        gross_gap_sort = (item.gross_gap * 1000000) + 1000000000000,
                        net_gap = item.net_gap,
                        net_gap_sort = (item.net_gap * 1000000) + 1000000000000,
                        wc_gap = item.wc_gap,
                        wc_gap_sort = (item.wc_gap * 1000000) + 1000000000000,
                    };
                    _wp.InsertOne(insert);
                }

                var _items = _wp.Find(xcolfilter, new FindOptions() { Collation = new Collation("en_US", numericOrdering: true) });
                var total_count = _items.CountDocuments();

                if(mode != "grouping-structure") { 
                    switch (sort)
                    {
                        case "well": _items = (order == "asc") ? _items.SortBy(t => t.well) : _items.SortByDescending(t => t.well); break;
                        case "gross_prev": _items = (order == "asc") ? _items.SortBy(t => t.gross_prev) : _items.SortByDescending(t => t.gross_prev); break;
                        case "net_prev": _items = (order == "asc") ? _items.SortBy(t => t.net_prev) : _items.SortByDescending(t => t.net_prev); break;
                        case "wc_prev": _items = (order == "asc") ? _items.SortBy(t => t.wc_prev) : _items.SortByDescending(t => t.wc_prev); break;
                        case "gross": _items = (order == "asc") ? _items.SortBy(t => t.gross) : _items.SortByDescending(t => t.gross); break;
                        case "net": _items = (order == "asc") ? _items.SortBy(t => t.net) : _items.SortByDescending(t => t.net); break;
                        case "wc": _items = (order == "asc") ? _items.SortBy(t => t.wc) : _items.SortByDescending(t => t.wc); break;
                        case "gross_gap": _items = (order == "asc") ? _items.SortBy(t => t.gross_gap_sort) : _items.SortByDescending(t => t.gross_gap_sort); break;
                        case "net_gap": _items = (order == "asc") ? _items.SortBy(t => t.net_gap_sort) : _items.SortByDescending(t => t.net_gap_sort); break;
                        case "wc_gap": _items = (order == "asc") ? _items.SortBy(t => t.wc_gap_sort) : _items.SortByDescending(t => t.wc_gap_sort); break;
                    }
                }
                switch (mode)
                {
                    case "":
                    case "grouping-well":
                    case null:
                        List<WellPerformance> items = _items
                        .Skip(page * pagesize)
                        .Limit(pagesize)
                        .Project<WellPerformance>(_fields_wp).ToList();

                        return new JsonResult(new
                        {
                            total_count = total_count,
                            incomplete_result = false,
                            items = items,
                            curr = date.ToString("dd-MMM-yyyy"),
                            prev = date_prev.ToString("dd-MMM-yyyy"),
                        })
                        {
                            StatusCode = StatusCodes.Status200OK
                        };

                    case "excel-well":
                        return GetDailyExcel(_items.Project<WellPerformance>(_fields_wp).ToList(), curr, prev, "well");

                    case "grouping-structure":
                    case "excel-structure":
                        items = _items.Project<WellPerformance>(_fields_wp).ToList()
                            .GroupBy(g => new
                            {
                                structure = g.structure
                            }).Select(s => new WellPerformance
                            {
                                structure = s.Key.structure,
                                year = s.First().year,
                                month = s.First().month,
                                gross_prev = s.Sum(m => m.gross_prev),
                                net_prev = s.Sum(m => m.net_prev),
                                wc_prev = s.Sum(m => m.gross_prev) > 0 ? (s.Sum(m => m.gross_prev) - s.Sum(m => m.net_prev)) / s.Sum(m => m.gross_prev) : null,
                                gross = s.Sum(m => m.gross),
                                net = s.Sum(m => m.net),
                                wc = s.Sum(m => m.gross) > 0 ? (s.Sum(m => m.gross) - s.Sum(m => m.net)) / s.Sum(m => m.gross) : null,
                                gross_gap = s.Sum(m => m.gross_gap),
                                net_gap = s.Sum(m => m.net_gap),
                                wc_gap = (s.Sum(m => m.gross) > 0 && s.Sum(m => m.gross_prev) > 0) ? ((s.Sum(m => m.gross) - s.Sum(m => m.net)) / s.Sum(m => m.gross)) - ((s.Sum(m => m.gross_prev) - s.Sum(m => m.net_prev)) / s.Sum(m => m.gross_prev)) : null,

                            }).ToList();

                                switch (sort)
                                {
                                    case "structure": items = (order == "asc") ? items.OrderBy(t => t.well).ToList() : items.OrderByDescending(t => t.structure).ToList(); break;
                                    case "gross_prev": items = (order == "asc") ? items.OrderBy(t => t.gross_prev).ToList() : items.OrderByDescending(t => t.gross_prev).ToList(); break;
                                    case "net_prev": items = (order == "asc") ? items.OrderBy(t => t.net_prev).ToList() : items.OrderByDescending(t => t.net_prev).ToList(); break;
                                    case "wc_prev": items = (order == "asc") ? items.OrderBy(t => t.wc_prev).ToList() : items.OrderByDescending(t => t.wc_prev).ToList(); break;
                                    case "gross": items = (order == "asc") ? items.OrderBy(t => t.gross).ToList() : items.OrderByDescending(t => t.gross).ToList(); break;
                                    case "net": items = (order == "asc") ? items.OrderBy(t => t.net).ToList() : items.OrderByDescending(t => t.net).ToList(); break;
                                    case "wc": items = (order == "asc") ? items.OrderBy(t => t.wc).ToList() : items.OrderByDescending(t => t.wc).ToList(); break;
                                    case "gross_gap": items = (order == "asc") ? items.OrderBy(t => t.gross_gap).ToList() : items.OrderByDescending(t => t.gross_gap).ToList(); break;
                                    case "net_gap": items = (order == "asc") ? items.OrderBy(t => t.net_gap).ToList() : items.OrderByDescending(t => t.net_gap).ToList(); break;
                                    case "wc_gap": items = (order == "asc") ? items.OrderBy(t => t.wc_gap).ToList() : items.OrderByDescending(t => t.wc_gap).ToList(); break;
                                }

                        if (mode == "excel-structure")
                        {
                            return GetDailyExcel(items, curr, prev, "structure");
                        }
                        else
                        {
                            return new JsonResult(new
                            {
                                total_count = items.Count(),
                                incomplete_result = false,
                                items = items,
                                curr = date.ToString("dd-MMM-yyyy"),
                                prev = date_prev.ToString("dd-MMM-yyyy"),
                            })
                            {
                                StatusCode = StatusCodes.Status200OK
                            };
                        }

                    default:
                        dynamic dres;
                        switch (mode)
                        {
                            case "well":
                            case "structure":
                                dres = _wp.Distinct<string>(mode, xcolfilter).ToEnumerable().OrderBy(t => t).ToList();
                                break;
                            default:
                                dres = _wp.Distinct<decimal?>(mode, xcolfilter).ToEnumerable().OrderBy(t => t).ToList();
                                break;
                        }

                        return new JsonResult(new
                        {
                            //total_count = res.Count(),
                            items = dres,
                        });
                }
                /*
                if (!excel)
                {
                    return Ok(new
                    {
                        curr = date.Value.ToString("dd-MMM-yyyy"),
                        prev = date.Value.AddDays(-1).ToString("dd-MMM-yyyy"),
                        data = res
                    });
                }
                else
                {
                    return GetWeeklyExcel(res, curr, prev);
                }*/
            } else
            {
                return BadRequest();
            }
        }

        private ActionResult GetDailyExcel(List<WellPerformance> items, string curr, string prev, string grouping)
        {
            var workbook = new ExcelPackage();
            var ws = workbook.Workbook.Worksheets.Add(curr);
            ws.Cells[1, 1].Value = (grouping == "well") ? "Well" : "Structure";
            ws.Cells[1, 1, 3, 1].Merge = true;
            ws.Cells[1, 2].Value = "Daily";
            ws.Cells[1, 2, 1, 10].Merge = true;
            ws.Cells[2, 2].Value = prev;
            ws.Cells[2, 2, 2, 4].Merge = true;
            ws.Cells[2, 5].Value = curr;
            ws.Cells[2, 5, 2, 7].Merge = true;
            ws.Cells[2, 8].Value = "Gain/Loss";
            ws.Cells[2, 8, 2, 10].Merge = true;

            ws.Cells[3, 2].Value = "Gross";
            ws.Cells[3, 3].Value = "Net";
            ws.Cells[3, 4].Value = "WC";
            ws.Cells[3, 5].Value = "Gross";
            ws.Cells[3, 6].Value = "Net";
            ws.Cells[3, 7].Value = "WC";
            ws.Cells[3, 8].Value = "Gross";
            ws.Cells[3, 9].Value = "Net";
            ws.Cells[3, 10].Value = "WC";

            ws.Cells[1, 1, 3, 10].Style.Font.Bold = true;
            ws.Cells[1, 1, 3, 10].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            ws.Cells[1, 1, 3, 10].Style.VerticalAlignment = ExcelVerticalAlignment.Top;

            for (int c = 1; c <= 6; c++)
            {
                //ws.Column(c).AutoFit();
            }

            for (int i = 0; i < items.Count(); i++)
            {
                var t = items.ElementAt(i);
                ws.Cells[4 + i, 1].Value = (grouping == "well") ? t.well : t.structure;
                ws.Cells[4 + i, 2].Value = t.gross_prev;
                ws.Cells[4 + i, 3].Value = t.net_prev;
                ws.Cells[4 + i, 4].Value = t.wc_prev;
                ws.Cells[4 + i, 5].Value = t.gross;
                ws.Cells[4 + i, 6].Value = t.net;
                ws.Cells[4 + i, 7].Value = t.wc;
                ws.Cells[4 + i, 8].Value = t.gross_gap;
                ws.Cells[4 + i, 9].Value = t.net_gap;
                ws.Cells[4 + i, 10].Value = t.wc_gap;
            }

            MemoryStream memoryStream = new MemoryStream(workbook.GetAsByteArray());
            memoryStream.Position = 0;
            return File(memoryStream, "application/vnd.ms-excel", "WellPerformance-Daily.xlsx");
        }

    }
}
