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
    public class DailyController : ControllerBase
    {
        private readonly IMongoCollection<Daily> _daily;
        private readonly IMongoCollection<DailyTmp> _daily_tmp;
        private readonly IMongoCollection<Structure> _structure;
        private ProjectionDefinition<Daily> _fields_daily;
        private ProjectionDefinition<Structure> _fields_structure;

        public DailyController(IPEDatabaseSettings settings)
        {

            _daily = DailyCommon._daily;
            _daily_tmp = DailyCommon._daily_tmp;
            _structure = DailyCommon._structure;
            _fields_daily = DailyCommon._fields_daily;
            _fields_structure = DailyCommon._fields_structure;
        }

        //[Authorize("PeDaily Read")]
        [HttpGet]
        public ActionResult Get(String sort = "date", String order = "desc", int page = 0, int pagesize = 50, String filter = "", String columnfilter = "", string mode = "")
        {

            //var _items = _tickets.Find(t => true);
            FilterDefinition<Daily> xfilter = Builders<Daily>.Filter.Ne("a", "b");
            FilterDefinition<Daily> xcolfilter;

            if (!String.IsNullOrWhiteSpace(filter))
            {
                filter = filter.ToLower();
                xfilter =
                    Builders<Daily>.Filter.Regex(t => t.date, new BsonRegularExpression(filter, "i")) |
                    Builders<Daily>.Filter.Regex(t => t.well, new BsonRegularExpression(filter, "i")) |
                    Builders<Daily>.Filter.Regex(t => t.zone, new BsonRegularExpression(filter, "i")) |
                    Builders<Daily>.Filter.Regex(t => t.interval, new BsonRegularExpression(filter, "i")) |
                    Builders<Daily>.Filter.Regex(t => t.test_date, new BsonRegularExpression(filter, "i")) |
                    Builders<Daily>.Filter.Regex(t => t.test_duration, new BsonRegularExpression(filter, "i")) |
                    Builders<Daily>.Filter.Regex(t => t.last_prod_hours, new BsonRegularExpression(filter, "i")) |
                    Builders<Daily>.Filter.Regex(t => t.last_prod_gross, new BsonRegularExpression(filter, "i")) |
                    Builders<Daily>.Filter.Regex(t => t.last_prod_net, new BsonRegularExpression(filter, "i")) |
                    Builders<Daily>.Filter.Regex(t => t.last_prod_wc, new BsonRegularExpression(filter, "i")) |
                    Builders<Daily>.Filter.Regex(t => t.art_lift_size, new BsonRegularExpression(filter, "i")) |
                    Builders<Daily>.Filter.Regex(t => t.art_lift_type, new BsonRegularExpression(filter, "i")) |
                    Builders<Daily>.Filter.Regex(t => t.art_lift_sl, new BsonRegularExpression(filter, "i")) |
                    Builders<Daily>.Filter.Regex(t => t.art_lift_spm, new BsonRegularExpression(filter, "i")) |
                    Builders<Daily>.Filter.Regex(t => t.art_lift_freq, new BsonRegularExpression(filter, "i")) |
                    Builders<Daily>.Filter.Regex(t => t.art_lift_load, new BsonRegularExpression(filter, "i")) |
                    Builders<Daily>.Filter.Regex(t => t.art_lift_bean_size, new BsonRegularExpression(filter, "i")) |
                    Builders<Daily>.Filter.Regex(t => t.art_lift_efficiency, new BsonRegularExpression(filter, "i")) |
                    Builders<Daily>.Filter.Regex(t => t.chp, new BsonRegularExpression(filter, "i")) |
                    Builders<Daily>.Filter.Regex(t => t.pfl, new BsonRegularExpression(filter, "i")) |
                    Builders<Daily>.Filter.Regex(t => t.psep, new BsonRegularExpression(filter, "i")) |
                    Builders<Daily>.Filter.Regex(t => t.pump_intake, new BsonRegularExpression(filter, "i")) |
                    Builders<Daily>.Filter.Regex(t => t.top, new BsonRegularExpression(filter, "i")) |
                    Builders<Daily>.Filter.Regex(t => t.mid, new BsonRegularExpression(filter, "i")) |
                    Builders<Daily>.Filter.Regex(t => t.bottom, new BsonRegularExpression(filter, "i"));
            }

            if (!String.IsNullOrWhiteSpace(columnfilter))
            {
                xcolfilter = Builders<Daily>.Filter.Ne("a", "b");
                DailyList colfilter = JsonConvert.DeserializeObject<DailyList>(columnfilter);
                if (colfilter.date?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.date.ToList().Select(c => (c is DateTime) ? Builders<Daily>.Filter.Eq(t => t.date, new BsonDateTime((DateTime)c)) : "{$expr:{$regexMatch:{input:{$dateToString:{format:\"%d %m %Y\",date:\"$date\",timezone:\"" + TimeZoneInfo.Local.DisplayName.Substring(4, 6) + "\"}},regex:/" + ReplaceMonth((string)c) + "/i}}}"));
                if (colfilter.well?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.well.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Regex(t => t.well, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.zone?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.zone.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Regex(t => t.zone, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.interval?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.interval.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq("interval", ((string)c).Split(",").Select(i => i.Split("-")).ToArray())));
                //if (colfilter.interval?.Length > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.interval.ToList().Select(c => Builders<Daily>.Filter.AnyEq("interval", c)));
                if (colfilter.test_date?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.test_date.ToList().Select(c => (c is DateTime) ? Builders<Daily>.Filter.Eq(t => t.test_date, new BsonDateTime((DateTime)c)) : "{$expr:{$regexMatch:{input:{$dateToString:{format:\"%d %m %Y\",date:\"$date\",timezone:\"" + TimeZoneInfo.Local.DisplayName.Substring(4, 6) + "\"}},regex:/" + ReplaceMonth((string)c) + "/i}}}"));
                if (colfilter.test_duration?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.test_duration.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.test_duration, Convert.ToDecimal(c))));
                if (colfilter.last_prod_hours?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.last_prod_hours.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.last_prod_hours, Convert.ToDecimal(c))));
                if (colfilter.last_prod_gross?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.last_prod_gross.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.last_prod_gross, Convert.ToDecimal(c))));
                if (colfilter.last_prod_net?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.last_prod_net.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.last_prod_net, Convert.ToDecimal(c))));
                if (colfilter.last_prod_wc?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.last_prod_wc.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.last_prod_wc, Convert.ToDecimal(c))));
                if (colfilter.gas?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.gas.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.gas, Convert.ToDecimal(c))));
                if (colfilter.art_lift_size?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.art_lift_size.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Regex(t => t.art_lift_size, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.art_lift_type?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.art_lift_type.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Regex(t => t.art_lift_type, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.art_lift_sl?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.art_lift_sl.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.art_lift_sl, Convert.ToDecimal(c))));
                if (colfilter.art_lift_spm?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.art_lift_spm.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.art_lift_spm, Convert.ToDecimal(c))));
                if (colfilter.art_lift_freq?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.art_lift_freq.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.art_lift_freq, Convert.ToDecimal(c))));
                if (colfilter.art_lift_load?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.art_lift_load.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.art_lift_load, Convert.ToDecimal(c))));
                if (colfilter.art_lift_bean_size?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.art_lift_bean_size.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.art_lift_bean_size, Convert.ToDecimal(c))));
                if (colfilter.art_lift_efficiency?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.art_lift_efficiency.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.art_lift_efficiency, Convert.ToDecimal(c))));
                if (colfilter.thp?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.thp.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.thp, Convert.ToDecimal(c))));
                if (colfilter.chp?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.chp.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.chp, Convert.ToDecimal(c))));
                if (colfilter.pfl?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.pfl.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.pfl, Convert.ToDecimal(c))));
                if (colfilter.psep?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.psep.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.psep, Convert.ToDecimal(c))));
                if (colfilter.pump_intake?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.pump_intake.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.pump_intake, Convert.ToDecimal(c))));
                if (colfilter.top?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.top.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.top, Convert.ToDecimal(c))));
                if (colfilter.mid?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.mid.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.mid, Convert.ToDecimal(c))));
                if (colfilter.bottom?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.bottom.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.bottom, Convert.ToDecimal(c))));

                if (colfilter.pump_capacity?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.pump_capacity.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.pump_capacity, Convert.ToDecimal(c))));
                if (colfilter.pump_efficiency?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.pump_efficiency.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.pump_efficiency, Convert.ToDecimal(c))));
                if (colfilter.sonolog_date?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.sonolog_date.ToList().Select(c => (c is DateTime) ? Builders<Daily>.Filter.Eq(t => t.sonolog_date, new BsonDateTime((DateTime)c)) : "{$expr:{$regexMatch:{input:{$dateToString:{format:\"%d %m %Y\",date:\"$date\",timezone:\"" + TimeZoneInfo.Local.DisplayName.Substring(4, 6) + "\"}},regex:/" + ReplaceMonth((string)c) + "/i}}}"));
                if (colfilter.sonolog_dfl?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.sonolog_dfl.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.sonolog_dfl, Convert.ToDecimal(c))));
                if (colfilter.sonolog_sfl?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.sonolog_sfl.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.sonolog_sfl, Convert.ToDecimal(c))));
                if (colfilter.sm?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.sm.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.sm, Convert.ToDecimal(c))));
                if (colfilter.sgmix?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.sgmix.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.sgmix, Convert.ToDecimal(c))));
                if (colfilter.ps?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.ps.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.ps, Convert.ToDecimal(c))));
                if (colfilter.pwf?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.pwf.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.pwf, Convert.ToDecimal(c))));
                if (colfilter.qmax?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.qmax.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.qmax, Convert.ToDecimal(c))));
                if (colfilter.well_efficiency?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.well_efficiency.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.well_efficiency, Convert.ToDecimal(c))));

                foreach (string log in DailyCommon._logical)
                {
                    if (colfilter.date?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.date.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[\"$date\",ISODate(\"{1}\")]}}", ((JObject)c).GetValue("opr"), DateTime.Parse(((JObject)c).GetValue("val").ToString()).ToString("yyyy-MM-ddTHH:mm:ssZ"))).ToArray()), log);
                    if (colfilter.well?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.well.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$well\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.zone?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.zone.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$in:[true,{{$map:{{input:\"$zone\",in:{{$regexMatch:{{input:{{$toString:\"$$this\"}},regex:\"{0}\",options:\"i\"}}}}}}}}]}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.interval?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.interval.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$in:[true,{{$map:{{input:{{$reduce:{{input:\"$interval\",initialValue:[],in:{{$concatArrays:[\"$$value\",\"$$this\"]}}}}}},in:{{$regexMatch:{{input:{{$toString:\"$$this\"}},regex:\"{0}\",options:\"i\"}}}}}}}}]}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.test_date?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.test_date.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[\"$test_date\",ISODate(\"{1}\")]}}", ((JObject)c).GetValue("opr"), DateTime.Parse(((JObject)c).GetValue("val").ToString()).ToString("yyyy-MM-ddTHH:mm:ssZ"))).ToArray()), log);
                    if (colfilter.test_duration?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.test_duration.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$test_duration\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.last_prod_hours?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.last_prod_hours.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$last_prod_hours\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.last_prod_gross?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.last_prod_gross.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$last_prod_gross\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.last_prod_net?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.last_prod_net.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$last_prod_net\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.last_prod_wc?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.last_prod_wc.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$last_prod_wc\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.gas?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.gas.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$gas\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.art_lift_size?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.art_lift_size.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$art_lift_size\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.art_lift_type?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.art_lift_type.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$art_lift_type\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.art_lift_sl?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.art_lift_sl.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$art_lift_sl\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.art_lift_spm?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.art_lift_spm.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$art_lift_spm\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.art_lift_freq?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.art_lift_freq.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$art_lift_freq\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.art_lift_load?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.art_lift_load.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$art_lift_load\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.art_lift_bean_size?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.art_lift_bean_size.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$art_lift_bean_size\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.art_lift_efficiency?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.art_lift_efficiency.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$art_lift_efficiency\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.thp?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.thp.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$thp\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.chp?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.chp.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$chp\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.pfl?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.pfl.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$pfl\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.psep?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.psep.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$psep\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.pump_intake?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.pump_intake.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$pump_intake\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.top?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.top.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$top\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.mid?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.mid.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$mid\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.bottom?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.bottom.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$bottom\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);

                    if (colfilter.pump_capacity?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.pump_capacity.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$pump_capacity\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.pump_efficiency?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.pump_efficiency.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$pump_efficiency\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.sonolog_date?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.sonolog_date.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[\"$sonolog_date\",ISODate(\"{1}\")]}}", ((JObject)c).GetValue("opr"), DateTime.Parse(((JObject)c).GetValue("val").ToString()).ToString("yyyy-MM-ddTHH:mm:ssZ"))).ToArray()), log);
                    if (colfilter.sonolog_dfl?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.sonolog_dfl.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$sonolog_dfl\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.sonolog_sfl?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.sonolog_sfl.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$sonolog_sfl\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.sm?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.sm.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$sm\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.sgmix?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.sgmix.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$sgmix\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.ps?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.ps.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$ps\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.pwf?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.pwf.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$pwf\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.qmax?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.qmax.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$qmax\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.well_efficiency?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.well_efficiency.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$well_efficiency\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                }

                xfilter = xfilter & xcolfilter;
            }

            var _items = _daily.Find(xfilter, new FindOptions() { Collation = new Collation("en_US", numericOrdering: true) });
            var total_count = _items.CountDocuments();

            switch (sort)
            {
                case "date": _items = (order == "asc") ? _items.SortBy(t => t.date) : _items.SortByDescending(t => t.date); break;
                case "well": _items = (order == "asc") ? _items.SortBy(t => t.well) : _items.SortByDescending(t => t.well); break;
                case "zone": _items = (order == "asc") ? _items.SortBy(t => t.zone) : _items.SortByDescending(t => t.zone); break;
                case "interval": _items = (order == "asc") ? _items.SortBy(t => t.interval) : _items.SortByDescending(t => t.interval); break;
                case "test_date": _items = (order == "asc") ? _items.SortBy(t => t.test_date) : _items.SortByDescending(t => t.test_date); break;
                case "test_duration": _items = (order == "asc") ? _items.SortBy(t => t.test_duration) : _items.SortByDescending(t => t.test_duration); break;
                case "last_prod_hours": _items = (order == "asc") ? _items.SortBy(t => t.last_prod_hours) : _items.SortByDescending(t => t.last_prod_hours); break;
                case "last_prod_gross": _items = (order == "asc") ? _items.SortBy(t => t.last_prod_gross) : _items.SortByDescending(t => t.last_prod_gross); break;
                case "last_prod_net": _items = (order == "asc") ? _items.SortBy(t => t.last_prod_net) : _items.SortByDescending(t => t.last_prod_net); break;
                case "last_prod_wc": _items = (order == "asc") ? _items.SortBy(t => t.last_prod_wc) : _items.SortByDescending(t => t.last_prod_wc); break;
                case "art_lift_size": _items = (order == "asc") ? _items.SortBy(t => t.art_lift_size) : _items.SortByDescending(t => t.art_lift_size); break;
                case "art_lift_type": _items = (order == "asc") ? _items.SortBy(t => t.art_lift_type) : _items.SortByDescending(t => t.art_lift_type); break;
                case "art_lift_sl": _items = (order == "asc") ? _items.SortBy(t => t.art_lift_sl) : _items.SortByDescending(t => t.art_lift_sl); break;
                case "art_lift_spm": _items = (order == "asc") ? _items.SortBy(t => t.art_lift_spm) : _items.SortByDescending(t => t.art_lift_spm); break;
                case "art_lift_freq": _items = (order == "asc") ? _items.SortBy(t => t.art_lift_freq) : _items.SortByDescending(t => t.art_lift_freq); break;
                case "art_lift_load": _items = (order == "asc") ? _items.SortBy(t => t.art_lift_load) : _items.SortByDescending(t => t.art_lift_load); break;
                case "art_lift_bean_size": _items = (order == "asc") ? _items.SortBy(t => t.art_lift_bean_size) : _items.SortByDescending(t => t.art_lift_bean_size); break;
                case "art_lift_efficiency": _items = (order == "asc") ? _items.SortBy(t => t.art_lift_efficiency) : _items.SortByDescending(t => t.art_lift_efficiency); break;
                case "chp": _items = (order == "asc") ? _items.SortBy(t => t.chp) : _items.SortByDescending(t => t.chp); break;
                case "pfl": _items = (order == "asc") ? _items.SortBy(t => t.pfl) : _items.SortByDescending(t => t.pfl); break;
                case "psep": _items = (order == "asc") ? _items.SortBy(t => t.psep) : _items.SortByDescending(t => t.psep); break;
                case "pump_intake": _items = (order == "asc") ? _items.SortBy(t => t.pump_intake) : _items.SortByDescending(t => t.pump_intake); break;
                case "top": _items = (order == "asc") ? _items.SortBy(t => t.top) : _items.SortByDescending(t => t.top); break;
                case "mid": _items = (order == "asc") ? _items.SortBy(t => t.mid) : _items.SortByDescending(t => t.mid); break;
                case "bottom": _items = (order == "asc") ? _items.SortBy(t => t.bottom) : _items.SortByDescending(t => t.bottom); break;
                case "pump_capacity ": _items = (order == "asc") ? _items.SortBy(t => t.pump_capacity) : _items.SortByDescending(t => t.pump_capacity); break;
                case "pump_efficiency ": _items = (order == "asc") ? _items.SortBy(t => t.pump_efficiency) : _items.SortByDescending(t => t.pump_efficiency); break;
                case "sonolog_date ": _items = (order == "asc") ? _items.SortBy(t => t.sonolog_date) : _items.SortByDescending(t => t.sonolog_date); break;
                case "sonolog_dfl ": _items = (order == "asc") ? _items.SortBy(t => t.sonolog_dfl) : _items.SortByDescending(t => t.sonolog_dfl); break;
                case "sonolog_sfl ": _items = (order == "asc") ? _items.SortBy(t => t.sonolog_sfl) : _items.SortByDescending(t => t.sonolog_sfl); break;
                case "sm ": _items = (order == "asc") ? _items.SortBy(t => t.sm) : _items.SortByDescending(t => t.sm); break;
                case "ps ": _items = (order == "asc") ? _items.SortBy(t => t.ps) : _items.SortByDescending(t => t.ps); break;
                case "pwf ": _items = (order == "asc") ? _items.SortBy(t => t.pwf) : _items.SortByDescending(t => t.pwf); break;
                case "qmax ": _items = (order == "asc") ? _items.SortBy(t => t.qmax) : _items.SortByDescending(t => t.qmax); break;
                case "well_efficiency": _items = (order == "asc") ? _items.SortBy(t => t.well_efficiency) : _items.SortByDescending(t => t.well_efficiency); break;
            }

            switch(mode)
            {
                case "":
                case null:
                    List<Daily> items = _items
                    .Skip(page * pagesize)
                    .Limit(pagesize)
                    .Project<Daily>(_fields_daily).ToList();

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
                    .Project<Daily>(_fields_daily).ToList());

                default :
                    dynamic res;
                    switch (mode) {
                        case "well":
                        case "zone":
                        case "art_lift_size":
                        case "art_lift_type":
                            res = _daily.Distinct<string>(mode, xfilter).ToEnumerable().OrderBy(t => t).ToList();
                            break;
                        //case "test_duration":
                        //    res = _daily.Distinct<int?>(mode, xfilter).ToEnumerable().OrderBy(t => t).ToList();
                        //    break;
                        case "date":
                        case "test_date":
                        case "sonolog_date":
                            res = _daily.Distinct<DateTime?>(mode, xfilter).ToEnumerable().OrderByDescending(t => t).ToList();
                            break;
                        case "interval":
                            //res = _daily.Distinct<decimal[][]>(mode, xfilter).ToEnumerable().OrderBy(t => t).ToList();
                            res = _daily.Find(xfilter).ToEnumerable().Select(t => String.Join(",",t.interval.Select(i => String.Join("-",i)))).Distinct().OrderBy(t => t).ToList();
                            break;
                        default:
                            res = _daily.Distinct<decimal?>(mode, xfilter).ToEnumerable().OrderBy(t => t).ToList();
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
            for(var m=1; m<=12; m++)
            {
                string monthName = CultureInfo.CurrentCulture.DateTimeFormat.GetAbbreviatedMonthName(m).ToLower();
                if(str.IndexOf(monthName) != -1 && str.Trim() != monthName)
                {
                    str = str.Replace(monthName, m.ToString().PadLeft(2, '0'));
                    break;
                }
            }
            return str;
        }

        public ActionResult GetExcel(List<Daily> items)
        {
            var workbook = new ExcelPackage();
            var ws = workbook.Workbook.Worksheets.Add("Daily");
            ws.Cells[1, 1].Value = "Date";
            ws.Cells[1, 1, 3, 1].Merge = true;
            ws.Cells[1, 2].Value = "Well";
            ws.Cells[1, 2, 3, 2].Merge = true;
            ws.Cells[1, 3].Value = "Zone";
            ws.Cells[1, 3, 3, 3].Merge = true;
            ws.Cells[1, 4].Value = "Interval";
            ws.Cells[1, 4, 3, 4].Merge = true;
            ws.Cells[1, 5].Value = "Test Date";
            ws.Cells[1, 5, 3, 5].Merge = true;

            ws.Cells[1, 6].Value = "Test Duration";
            ws.Cells[1, 6, 2, 6].Merge = true;
            ws.Cells[3, 6].Value = "hours";

            ws.Cells[1, 7].Value = "Last Production";
            ws.Cells[2, 7].Value = "Hours";
            ws.Cells[2, 7, 3, 7].Merge = true;
            ws.Cells[2, 8].Value = "Gross";
            ws.Cells[3, 8].Value = "bfpd";
            ws.Cells[2, 9].Value = "Net";
            ws.Cells[3, 9].Value = "bopd";
            ws.Cells[2, 10].Value = "WC";
            ws.Cells[3, 10].Value = "%";
            ws.Cells[1, 7, 1, 10].Merge = true;

            ws.Cells[1, 11].Value = "Gas";
            ws.Cells[1, 11, 2, 11].Merge = true;
            ws.Cells[3, 11].Value = "MSCFD";

            ws.Cells[1, 12].Value = "Artificial Lift";
            ws.Cells[2, 12].Value = "Size";
            ws.Cells[2, 12, 3, 12].Merge = true;
            ws.Cells[2, 13].Value = "Type";
            ws.Cells[2, 13, 3, 13].Merge = true;
            ws.Cells[2, 14].Value = "SL";
            ws.Cells[2, 14, 3, 14].Merge = true;
            ws.Cells[2, 15].Value = "SPM";
            ws.Cells[2, 15, 3, 15].Merge = true;
            ws.Cells[2, 16].Value = "Freq";
            ws.Cells[3, 16].Value = "Hz";
            ws.Cells[2, 17].Value = "Load";
            ws.Cells[3, 17].Value = "Amp";
            ws.Cells[2, 18].Value = "Bean Size";
            ws.Cells[3, 18].Value = "/64";
            ws.Cells[2, 18, 3, 18].Merge = true;
            ws.Cells[1, 12, 1, 18].Merge = true;

            ws.Cells[1, 19].Value = "Thp";
            ws.Cells[1, 19, 2, 19].Merge = true;
            ws.Cells[3, 19].Value = "unit";
            ws.Cells[1, 20].Value = "Chp";
            ws.Cells[1, 20, 2, 20].Merge = true;
            ws.Cells[3, 20].Value = "unit";
            ws.Cells[1, 21].Value = "Pfl";
            ws.Cells[1, 21, 2, 21].Merge = true;
            ws.Cells[3, 21].Value = "unit";
            ws.Cells[1, 22].Value = "Psep";
            ws.Cells[1, 22, 2, 22].Merge = true;
            ws.Cells[3, 22].Value = "unit";
            ws.Cells[1, 23].Value = "Pump Intake";
            ws.Cells[1, 23, 2, 23].Merge = true;
            ws.Cells[3, 23].Value = "unit";

            ws.Cells[1, 24].Value = "Perforation Depth";
            ws.Cells[2, 24].Value = "Top";
            ws.Cells[3, 24].Value = "meter";
            ws.Cells[2, 25].Value = "Mid";
            ws.Cells[3, 25].Value = "meter";
            ws.Cells[2, 26].Value = "Bottom";
            ws.Cells[3, 26].Value = "meter";
            ws.Cells[1, 24, 1, 26].Merge = true;

            ws.Cells[1, 27].Value = "Pump Capacity";
            ws.Cells[1, 27, 2, 27].Merge = true;
            ws.Cells[3, 27].Value = "bfpd";
            ws.Cells[1, 28].Value = "Pump Efficiency";
            ws.Cells[1, 28, 3, 28].Merge = true;

            ws.Cells[1, 29].Value = "Sonolog";
            ws.Cells[2, 29].Value = "Date";
            ws.Cells[2, 29, 3, 29].Merge = true;
            ws.Cells[2, 30].Value = "DFL";
            ws.Cells[3, 30].Value = "meter";
            ws.Cells[2, 31].Value = "SFL";
            ws.Cells[3, 31].Value = "meter";
            ws.Cells[1, 29, 1, 31].Merge = true;

            ws.Cells[1, 32].Value = "Ps";
            ws.Cells[1, 32, 2, 32].Merge = true;
            ws.Cells[3, 32].Value = "psi";
            ws.Cells[1, 33].Value = "Pwf";
            ws.Cells[1, 33, 2, 33].Merge = true;
            ws.Cells[3, 33].Value = "psi";
            ws.Cells[1, 34].Value = "Qmax";
            ws.Cells[1, 34, 2, 34].Merge = true;
            ws.Cells[3, 34].Value = "bfpd";
            ws.Cells[1, 35].Value = "Well Efficiency";
            ws.Cells[1, 35, 2, 35].Merge = true;
            ws.Cells[3, 35].Value = "%";

            ws.Cells[1, 1, 1, 36].Style.Font.Bold = true;
            ws.Cells[1, 1, 3, 36].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            ws.Cells[1, 1, 3, 36].Style.VerticalAlignment = ExcelVerticalAlignment.Top;

            for (int c = 1; c <= 27; c++)
            {
                //ws.Column(c).AutoFit();
            }

            for(int i = 0; i < items.Count(); i++)
            {
                var t = items.ElementAt(i);
                ws.Cells[4 + i, 1].Style.Numberformat.Format = "d-MMM-yy";
                ws.Cells[4 + i, 1].Value = t.date.HasValue? t.date.Value.ToLocalTime().ToOADate() : (double?)null;
                ws.Cells[4 + i, 2].Value = t.well;
                ws.Cells[4 + i, 3].Value = String.Join(", ", t.zone);
                ws.Cells[4 + i, 4].Value = String.Join(", ", t.interval.Select(d => String.Join(" - ", d)).ToArray());
                ws.Cells[4 + i, 5].Style.Numberformat.Format = "d-MMM-yy";
                ws.Cells[4 + i, 5].Value = t.test_date.HasValue? t.test_date.Value.ToLocalTime().ToOADate() : (double?)null;
                ws.Cells[4 + i, 6].Value = t.test_duration;
                ws.Cells[4 + i, 7].Value = t.last_prod_hours;
                ws.Cells[4 + i, 8].Value = t.last_prod_gross;
                ws.Cells[4 + i, 9].Value = t.last_prod_net;
                ws.Cells[4 + i, 10].Value = t.last_prod_wc;
                ws.Cells[4 + i, 11].Value = t.gas;
                ws.Cells[4 + i, 12].Value = t.art_lift_size;
                ws.Cells[4 + i, 13].Value = t.art_lift_type;
                ws.Cells[4 + i, 14].Value = t.art_lift_sl;
                ws.Cells[4 + i, 15].Value = t.art_lift_spm;
                ws.Cells[4 + i, 16].Value = t.art_lift_freq;
                ws.Cells[4 + i, 17].Value = t.art_lift_load;
                ws.Cells[4 + i, 18].Value = t.art_lift_bean_size;
                ws.Cells[4 + i, 19].Value = t.thp;
                ws.Cells[4 + i, 20].Value = t.chp;
                ws.Cells[4 + i, 21].Value = t.pfl;
                ws.Cells[4 + i, 22].Value = t.psep;
                ws.Cells[4 + i, 23].Value = t.pump_intake;

                ws.Cells[4 + i, 24].Value = t.top;
                ws.Cells[4 + i, 25].Value = t.mid;
                ws.Cells[4 + i, 26].Value = t.bottom;

                ws.Cells[4 + i, 27].Value = t.pump_capacity;
                ws.Cells[4 + i, 28].Value = t.pump_efficiency;
                ws.Cells[4 + i, 29].Style.Numberformat.Format = "d-MMM-yy";
                ws.Cells[4 + i, 29].Value = t.sonolog_date.HasValue ? t.sonolog_date.Value.ToLocalTime().ToOADate() : (double?)null;
                ws.Cells[4 + i, 30].Value = t.sonolog_dfl;
                ws.Cells[4 + i, 31].Value = t.sonolog_sfl;
                ws.Cells[4 + i, 32].Value = t.ps;
                ws.Cells[4 + i, 33].Value = t.pwf;
                ws.Cells[4 + i, 34].Value = t.qmax;
                ws.Cells[4 + i, 35].Value = t.well_efficiency;
            }

            ws.Cells[4, 6, 4 + items.Count(), 28].Style.Numberformat.Format = "#,###";
            ws.Cells[4, 30, 4 + items.Count(), 35].Style.Numberformat.Format = "#,###";
            ws.Cells[4, 24, 4 + items.Count(), 26].Style.Numberformat.Format = "#,###.0";

            MemoryStream memoryStream = new MemoryStream(workbook.GetAsByteArray());
            memoryStream.Position = 0;
            return File(memoryStream, "application/vnd.ms-excel", "Daily.xlsx");
        }

       // [Authorize("PeDaily Add")]
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

            List<Daily> items = new List<Daily>();
            int error_count = 0;

            for (var r = 4; r <= rowCount; r++)
            {
                if(!string.IsNullOrWhiteSpace(ws.Cells[r, 1].Value?.ToString()))
                {
                    Daily _row = new Daily();
                    DailyError _row_error = new DailyError();
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
                    } else
                    {
                        _row_error.well = new ErrorItem { value = "(Blank)", message = "Blank Well name is not allowed" };
                        error_count++;
                    }

                    try
                    {
                        _row.zone = ws.Cells[r, 3].Value?.ToString().Trim().Split(",").Select(z => z.Trim()).ToArray();
                    }
                    catch (Exception e)
                    {
                        _row_error.zone = new ErrorItem { value = ws.Cells[r, 3].Value?.ToString(), message = e.Message };
                        error_count++;
                    }

                    try
                    {
                        _row.interval = ws.Cells[r, 4].Value?.ToString().Trim().Split(",").Select(i => i.Trim().Split("-").Select(j => decimal.Parse(j.Trim())).ToArray()).ToArray();
                    }
                    catch (Exception e)
                    {
                        _row_error.interval = new ErrorItem { value = ws.Cells[r, 4].Value?.ToString(), message = e.Message };
                        error_count++;
                    }

                    if (!String.IsNullOrWhiteSpace(ws.Cells[r, 5].Value?.ToString()))
                    {
                        try
                        {
                            if (ws.Cells[r, 5].Value.GetType() == DateTime.Now.GetType())
                            {
                                _row.test_date = (DateTime?)ws.Cells[r, 5].Value;
                            }
                            else
                            {
                                _row.test_date = DateTime.FromOADate(double.Parse(ws.Cells[r, 5].Value?.ToString().Trim()));
                            }
                        }
                        catch (Exception e)
                        {
                            _row_error.test_date = new ErrorItem { value = ws.Cells[r, 5].Value?.ToString(), message = e.Message };
                            error_count++;
                        }
                    }
                    else
                    {
                        _row.test_date = (DateTime?)null;
                    }

                    try
                    {
                        _row.test_duration = (!String.IsNullOrWhiteSpace(ws.Cells[r, 6].Value?.ToString())) ? decimal.Parse(ws.Cells[r, 6].Value?.ToString().Trim()) : (decimal?)null;
                    }
                    catch (Exception e)
                    {
                        _row_error.test_duration = new ErrorItem { value = ws.Cells[r, 6].Value?.ToString(), message = e.Message };
                        error_count++;
                    }

                    try
                    {
                        _row.last_prod_hours = (!String.IsNullOrWhiteSpace(ws.Cells[r, 7].Value?.ToString())) ? decimal.Parse(ws.Cells[r, 7].Value?.ToString().Trim()) : (decimal?)null;
                    }
                    catch (Exception e)
                    {
                        _row_error.last_prod_hours = new ErrorItem { value = ws.Cells[r, 7].Value?.ToString(), message = e.Message };
                        error_count++;
                    }

                    try
                    {
                        _row.last_prod_gross = (!String.IsNullOrWhiteSpace(ws.Cells[r, 8].Value?.ToString())) ? decimal.Parse(ws.Cells[r, 8].Value?.ToString().Trim()) : (decimal?)null;
                    }
                    catch (Exception e)
                    {
                        _row_error.last_prod_gross = new ErrorItem { value = ws.Cells[r, 8].Value?.ToString(), message = e.Message };
                        error_count++;
                    }

                    try
                    {
                        _row.last_prod_net = (!String.IsNullOrWhiteSpace(ws.Cells[r, 9].Value?.ToString())) ? decimal.Parse(ws.Cells[r, 9].Value?.ToString().Trim()) : (decimal?)null;
                    }
                    catch (Exception e)
                    {
                        _row_error.last_prod_net = new ErrorItem { value = ws.Cells[r, 9].Value?.ToString(), message = e.Message };
                        error_count++;
                    }

                    try
                    {
                        _row.last_prod_wc = (!String.IsNullOrWhiteSpace(ws.Cells[r, 10].Value?.ToString())) ? decimal.Parse(ws.Cells[r, 10].Value?.ToString().Trim()) : (decimal?)null;
                    }
                    catch (Exception e)
                    {
                        _row_error.last_prod_wc = new ErrorItem { value = ws.Cells[r, 10].Value?.ToString(), message = e.Message };
                        error_count++;
                    }

                    try
                    {
                        _row.gas = (!String.IsNullOrWhiteSpace(ws.Cells[r, 11].Value?.ToString())) ? decimal.Parse(ws.Cells[r, 11].Value?.ToString().Trim()) : (decimal?)null;
                    }
                    catch (Exception e)
                    {
                        _row_error.gas = new ErrorItem { value = ws.Cells[r, 11].Value?.ToString(), message = e.Message };
                        error_count++;
                    }

                    _row.art_lift_size = ws.Cells[r, 12].Value?.ToString().Trim();
                    _row.art_lift_type = ws.Cells[r, 13].Value?.ToString().Trim();

                    try
                    {
                        _row.art_lift_sl = (!String.IsNullOrWhiteSpace(ws.Cells[r, 14].Value?.ToString())) ? decimal.Parse(ws.Cells[r, 14].Value?.ToString().Trim()) : (decimal?)null;
                    }
                    catch (Exception e)
                    {
                        _row_error.art_lift_sl = new ErrorItem { value = ws.Cells[r, 14].Value?.ToString(), message = e.Message };
                        error_count++;
                    }

                    try
                    {
                        _row.art_lift_spm = (!String.IsNullOrWhiteSpace(ws.Cells[r, 15].Value?.ToString())) ? decimal.Parse(ws.Cells[r, 15].Value?.ToString().Trim()) : (decimal?)null;
                    }
                    catch (Exception e)
                    {
                        _row_error.art_lift_spm = new ErrorItem { value = ws.Cells[r, 15].Value?.ToString(), message = e.Message };
                        error_count++;
                    }

                    try
                    {
                        _row.art_lift_freq = (!String.IsNullOrWhiteSpace(ws.Cells[r, 16].Value?.ToString())) ? decimal.Parse(ws.Cells[r, 16].Value?.ToString().Trim()) : (decimal?)null;
                    }
                    catch (Exception e)
                    {
                        _row_error.art_lift_freq = new ErrorItem { value = ws.Cells[r, 16].Value?.ToString(), message = e.Message };
                        error_count++;
                    }

                    try
                    {
                        _row.art_lift_load = (!String.IsNullOrWhiteSpace(ws.Cells[r, 17].Value?.ToString())) ? decimal.Parse(ws.Cells[r, 17].Value?.ToString().Trim()) : (decimal?)null;
                    }
                    catch (Exception e)
                    {
                        _row_error.art_lift_load = new ErrorItem { value = ws.Cells[r, 17].Value?.ToString(), message = e.Message };
                        error_count++;
                    }

                    try
                    {
                        _row.art_lift_bean_size = (!String.IsNullOrWhiteSpace(ws.Cells[r, 18].Value?.ToString())) ? decimal.Parse(ws.Cells[r, 18].Value?.ToString().Trim()) : (decimal?)null;
                    }
                    catch (Exception e)
                    {
                        _row_error.art_lift_bean_size = new ErrorItem { value = ws.Cells[r, 18].Value?.ToString(), message = e.Message };
                        error_count++;
                    }

                    try
                    {
                        _row.thp = (!String.IsNullOrWhiteSpace(ws.Cells[r, 19].Value?.ToString())) ? decimal.Parse(ws.Cells[r, 19].Value?.ToString().Trim()) : (decimal?)null;
                    }
                    catch (Exception e)
                    {
                        _row_error.thp = new ErrorItem { value = ws.Cells[r, 19].Value?.ToString(), message = e.Message };
                        error_count++;
                    }

                    try
                    {
                        _row.chp = (!String.IsNullOrWhiteSpace(ws.Cells[r, 20].Value?.ToString())) ? decimal.Parse(ws.Cells[r, 20].Value?.ToString().Trim()) : (decimal?)null;
                    }
                    catch (Exception e)
                    {
                        _row_error.chp = new ErrorItem { value = ws.Cells[r, 20].Value?.ToString(), message = e.Message };
                        error_count++;
                    }

                    try
                    {
                        _row.pfl = (!String.IsNullOrWhiteSpace(ws.Cells[r, 21].Value?.ToString())) ? decimal.Parse(ws.Cells[r, 21].Value?.ToString().Trim()) : (decimal?)null;
                    }
                    catch (Exception e)
                    {
                        _row_error.pfl = new ErrorItem { value = ws.Cells[r, 21].Value?.ToString(), message = e.Message };
                        error_count++;
                    }

                    try
                    {
                        _row.psep = (!String.IsNullOrWhiteSpace(ws.Cells[r, 22].Value?.ToString())) ? decimal.Parse(ws.Cells[r, 22].Value?.ToString().Trim()) : (decimal?)null;
                    }
                    catch (Exception e)
                    {
                        _row_error.psep = new ErrorItem { value = ws.Cells[r, 22].Value?.ToString(), message = e.Message };
                        error_count++;
                    }

                    try
                    {
                        _row.pump_intake = (!String.IsNullOrWhiteSpace(ws.Cells[r, 23].Value?.ToString())) ? decimal.Parse(ws.Cells[r, 23].Value?.ToString().Trim()) : (decimal?)null;
                    }
                    catch (Exception e)
                    {
                        _row_error.pump_intake = new ErrorItem { value = ws.Cells[r, 23].Value?.ToString(), message = e.Message };
                        error_count++;
                    }

                    try
                    {
                        _row.top = (!String.IsNullOrWhiteSpace(ws.Cells[r, 24].Value?.ToString())) ? decimal.Parse(ws.Cells[r, 24].Value?.ToString().Trim()) : (decimal?)null;
                    }
                    catch (Exception e)
                    {
                        _row_error.top = new ErrorItem { value = ws.Cells[r, 24].Value?.ToString(), message = e.Message };
                        error_count++;
                    }

                    try
                    {
                        _row.mid = (!String.IsNullOrWhiteSpace(ws.Cells[r, 25].Value?.ToString())) ? decimal.Parse(ws.Cells[r, 25].Value?.ToString().Trim()) : (decimal?)null;
                    }
                    catch (Exception e)
                    {
                        _row_error.mid = new ErrorItem { value = ws.Cells[r, 25].Value?.ToString(), message = e.Message };
                        error_count++;
                    }

                    try
                    {
                        _row.bottom = (!String.IsNullOrWhiteSpace(ws.Cells[r, 26].Value?.ToString())) ? decimal.Parse(ws.Cells[r, 26].Value?.ToString().Trim()) : (decimal?)null;
                    }
                    catch (Exception e)
                    {
                        _row_error.bottom = new ErrorItem { value = ws.Cells[r, 26].Value?.ToString(), message = e.Message };
                        error_count++;
                    }

                    if (_row_error.date == null && _row_error.well == null)
                    {
                        if (_daily.Find(t => t.date == _row.date && t.well == _row.well).CountDocuments() > 0)
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

            DailyTmp _tmp = new DailyTmp {
                error_count = error_count,
                items = items.ToArray()
            };
            _daily_tmp.InsertOne(_tmp);

            return Ok(new
            {
                _id = _tmp._id,
                //items = items,
                error_count = error_count
            });
        }

        //[Authorize("PeDaily Add")]
        [HttpGet("Tmp")]
        public ActionResult GetTmp(string _id, String sort = "date", String order = "desc", int page = 0, int pagesize = 50, String filter = "", String columnfilter = "", string mode = "")
        {
            DailyTmp _tmp = _daily_tmp.Find(t => t._id == _id).FirstOrDefault();
            List<Daily> _tmpitems = _tmp.items.ToList();
            if(mode == "error")
            {
                _tmpitems = _tmpitems.Where(r => r._error._row?.value == "error").ToList();
            } else if (mode == "warning")
            {
                _tmpitems = _tmpitems.Where(r => r._error._row?.value == "warning").ToList();
            }
            int total_count = _tmpitems.Count();
            if (pagesize * (page + 1) > total_count) pagesize = total_count - (page* pagesize);

            if (_tmp != null)
            {
                List<Daily> items = _tmpitems.ToList().GetRange(page * pagesize, pagesize);
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
            } else
            {
                return BadRequest();
            }
            

        }

        //[Authorize("PeDaily Add")]
        [HttpGet("SaveData")]
        public ActionResult SaveData(string _id)
        {
            try
            {
                DailyTmp _tmp = _daily_tmp.Find(t => t._id == _id).FirstOrDefault();

                if(_tmp == null || _tmp.error_count > 0)
                {
                    throw new Exception();
                }

                List<Daily> items = _tmp.items.ToList();

                List<Structure> structure = _structure.Find(s => true).Project<Structure>(_fields_structure).ToList();
                foreach(Structure str in structure)
                {
                    foreach(string prefix in str.prefix)
                    {
                        List<Daily> _dstr = items.Where(i => i.well.StartsWith(prefix)).ToList();
                        foreach(Daily dstr in _dstr)
                        {
                            dstr.structure = new DailyStructure
                            {
                                name = str.name,
                                shortName = str.shortName,
                            };
                        }
                    }
                }

                long modified_count = 0;
                long created_count = items.Count();
                Daily daily;
                foreach(Daily item in items)
                {
                    item._error = null;
                    daily = DailyCommon.CalculateFields(item);

                    var update = Builders<Daily>.Update.Set(t => t.date, item.date)
                        .Set(t => t.well, item.well)
                        .Set(t => t.zone, item.zone)
                        .Set(t => t.interval, item.interval)
                        .Set(t => t.test_date, item.test_date)
                        .Set(t => t.test_duration, item.test_duration)
                        .Set(t => t.last_prod_hours, item.last_prod_hours)
                        .Set(t => t.last_prod_gross, item.last_prod_gross)
                        .Set(t => t.last_prod_net, item.last_prod_net)
                        .Set(t => t.last_prod_wc, item.last_prod_wc)
                        .Set(t => t.gas, item.gas)
                        .Set(t => t.art_lift_size, item.art_lift_size)
                        .Set(t => t.art_lift_type, item.art_lift_type)
                        .Set(t => t.art_lift_sl, item.art_lift_sl)
                        .Set(t => t.art_lift_spm, item.art_lift_spm)
                        .Set(t => t.art_lift_freq, item.art_lift_freq)
                        .Set(t => t.art_lift_load, item.art_lift_load)
                        .Set(t => t.art_lift_bean_size, item.art_lift_bean_size)
                        .Set(t => t.art_lift_efficiency, item.art_lift_efficiency)
                        .Set(t => t.thp, item.thp)
                        .Set(t => t.chp, item.chp)
                        .Set(t => t.pfl, item.pfl)
                        .Set(t => t.psep, item.psep)
                        .Set(t => t.pump_intake, item.pump_intake)
                        .Set(t => t.top, item.top)
                        .Set(t => t.mid, item.mid)
                        .Set(t => t.bottom, item.bottom)
                        .Set(t => t.structure, item.structure)

                        .Set(t => t.pump_capacity, daily.pump_capacity)
                        .Set(t => t.pump_efficiency, daily.pump_efficiency)
                        .Set(t => t.sonolog_date, daily.sonolog_date)
                        .Set(t => t.sonolog_dfl, daily.sonolog_dfl)
                        .Set(t => t.sonolog_sfl, daily.sonolog_sfl)
                        .Set(t => t.sm, daily.sm)
                        .Set(t => t.ps, daily.ps)
                        .Set(t => t.pwf, daily.pwf)
                        .Set(t => t.qmax, daily.qmax)
                        .Set(t => t.well_efficiency, daily.well_efficiency)

                        .Set(t => t.updated_by, User.Identity.Name)
                        .Set(t => t.updated_date, DateTime.Now)
                        .SetOnInsert(t => t.created_by, User.Identity.Name)
                        .SetOnInsert(t => t.created_date, DateTime.Now);

                    UpdateResult res = _daily.UpdateOne(
                        Builders<Daily>.Filter.Eq(t => t.date, item.date) & Builders<Daily>.Filter.Eq(t => t.well, item.well),
                        update, new UpdateOptions() { IsUpsert = true });

                    modified_count += res.ModifiedCount;
                    created_count -= res.ModifiedCount;
                }
                _daily_tmp.DeleteOne(d => d._id == _id);
                
                return Ok(new {
                    modified_count = modified_count,
                    created_count = created_count,
                    total_count = items.Count()
                });
            }
            catch(Exception e)
            {
                return BadRequest();
            }
        }

        //[Authorize("PeDaily Delete")]
        [HttpDelete]
        public ActionResult Delete(string[] _ids)
        {
            try
            {
                long deleted_count = 0;
                long total_count = _ids.Length;
                foreach (string _id in _ids)
                {
                    DeleteResult res = _daily.DeleteOne(t => t._id == _id);
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