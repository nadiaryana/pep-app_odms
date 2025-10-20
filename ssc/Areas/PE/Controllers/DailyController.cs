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
using OfficeOpenXml.FormulaParsing.Excel.Functions.Text;

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
        private readonly IMongoCollection<Production> _production;

        public DailyController(IPEDatabaseSettings settings)
        {

            _daily = DailyCommon._daily;
            _production = DailyCommon._production;
            _daily_tmp = DailyCommon._daily_tmp;
            _structure = DailyCommon._structure;
            _fields_daily = DailyCommon._fields_daily;
            _fields_structure = DailyCommon._fields_structure;
        }

        [Authorize("PeDaily Read")]
        [HttpGet]
        public ActionResult Get(String sort = "date", String order = "desc", int page = 0, int pagesize = 50, String filter = "", String columnfilter = "", string mode = "")
        {

            //var _items = _tickets.Find(t => true);
            FilterDefinition<Daily> xfilter = Builders<Daily>.Filter.Ne("a", "b");
            FilterDefinition<Daily> xcolfilter;

            if (!String.IsNullOrWhiteSpace(filter))
            {
                filter = filter.ToLower();

                if (filter == "gas")
                {
                    //xfilter = Builders<Daily>.Filter.Where(t => t.gas > 0 && t.art_lift_type.Contains("N"));
                    xfilter = Builders<Daily>.Filter.Where(t => t.gas > 0);
                }
                else
                {

                    xfilter =
                        Builders<Daily>.Filter.Regex(t => t.date, new BsonRegularExpression(filter, "i")) |
                        Builders<Daily>.Filter.Regex(t => t.nomor, new BsonRegularExpression(filter, "i")) |
                        Builders<Daily>.Filter.Regex(t => t.location, new BsonRegularExpression(filter, "i")) |
                        Builders<Daily>.Filter.Regex(t => t.well, new BsonRegularExpression(filter, "i")) |
                        Builders<Daily>.Filter.Regex(t => t.well_string, new BsonRegularExpression(filter, "i")) |
                        Builders<Daily>.Filter.Regex(t => t.zone, new BsonRegularExpression(filter, "i")) |
                        Builders<Daily>.Filter.Regex(t => t.interval, new BsonRegularExpression(filter, "i")) |
                        // Builders<Daily>.Filter.Regex(t => t.test_date, new BsonRegularExpression(filter, "i")) |
                        // Builders<Daily>.Filter.Regex(t => t.test_duration, new BsonRegularExpression(filter, "i")) |
                        Builders<Daily>.Filter.Regex(t => t.potensi_prod_gross, new BsonRegularExpression(filter, "i")) |
                        Builders<Daily>.Filter.Regex(t => t.potensi_prod_net, new BsonRegularExpression(filter, "i")) |
                        Builders<Daily>.Filter.Regex(t => t.tes_prod_gross, new BsonRegularExpression(filter, "i")) |
                        Builders<Daily>.Filter.Regex(t => t.tes_prod_net, new BsonRegularExpression(filter, "i")) |
                        Builders<Daily>.Filter.Regex(t => t.fig_last_gross, new BsonRegularExpression(filter, "i")) |
                        Builders<Daily>.Filter.Regex(t => t.fig_last_net, new BsonRegularExpression(filter, "i")) |
                        Builders<Daily>.Filter.Regex(t => t.fig_curr_gross, new BsonRegularExpression(filter, "i")) |
                        Builders<Daily>.Filter.Regex(t => t.fig_curr_net, new BsonRegularExpression(filter, "i")) |
                        Builders<Daily>.Filter.Regex(t => t.thp_last_fig, new BsonRegularExpression(filter, "i")) |
                        Builders<Daily>.Filter.Regex(t => t.thp_potensi, new BsonRegularExpression(filter, "i")) |
                        Builders<Daily>.Filter.Regex(t => t.wc, new BsonRegularExpression(filter, "i")) |
                        Builders<Daily>.Filter.Regex(t => t.prod_hours, new BsonRegularExpression(filter, "i")) |
                        Builders<Daily>.Filter.Regex(t => t.wor, new BsonRegularExpression(filter, "i")) |
                        Builders<Daily>.Filter.Regex(t => t.gas, new BsonRegularExpression(filter, "i")) |
                        Builders<Daily>.Filter.Regex(t => t.gor, new BsonRegularExpression(filter, "i")) |
                        Builders<Daily>.Filter.Regex(t => t.glr, new BsonRegularExpression(filter, "i")) |
                        Builders<Daily>.Filter.Regex(t => t.ls_method, new BsonRegularExpression(filter, "i")) |
                        Builders<Daily>.Filter.Regex(t => t.ls_brandtype, new BsonRegularExpression(filter, "i")) |
                        Builders<Daily>.Filter.Regex(t => t.ls_prime_mover, new BsonRegularExpression(filter, "i")) |
                        Builders<Daily>.Filter.Regex(t => t.ls_hp, new BsonRegularExpression(filter, "i")) |
                        Builders<Daily>.Filter.Regex(t => t.ds_size, new BsonRegularExpression(filter, "i")) |
                        Builders<Daily>.Filter.Regex(t => t.ds_spm, new BsonRegularExpression(filter, "i")) |
                        Builders<Daily>.Filter.Regex(t => t.ds_bean, new BsonRegularExpression(filter, "i")) |
                        Builders<Daily>.Filter.Regex(t => t.ds_whp, new BsonRegularExpression(filter, "i")) |
                        Builders<Daily>.Filter.Regex(t => t.ds_fl, new BsonRegularExpression(filter, "i")) |
                        Builders<Daily>.Filter.Regex(t => t.ds_casing, new BsonRegularExpression(filter, "i")) |
                        Builders<Daily>.Filter.Regex(t => t.ds_separator, new BsonRegularExpression(filter, "i")) |
                        Builders<Daily>.Filter.Regex(t => t.ds_pump_displace, new BsonRegularExpression(filter, "i")) |
                        Builders<Daily>.Filter.Regex(t => t.ds_efficiency, new BsonRegularExpression(filter, "i")) |
                        Builders<Daily>.Filter.Regex(t => t.ds_sl, new BsonRegularExpression(filter, "i")) |
                        Builders<Daily>.Filter.Regex(t => t.ds_kd, new BsonRegularExpression(filter, "i")) |
                        Builders<Daily>.Filter.Regex(t => t.sm, new BsonRegularExpression(filter, "i")) |
                        Builders<Daily>.Filter.Regex(t => t.ds_tgl_pengujian, new BsonRegularExpression(filter, "i")) |
                        Builders<Daily>.Filter.Regex(t => t.noted, new BsonRegularExpression(filter, "i"));

                }
            }

            if (!String.IsNullOrWhiteSpace(columnfilter))
            {
                decimal wor;
                xcolfilter = Builders<Daily>.Filter.Ne("a", "b");
                DailyList colfilter = JsonConvert.DeserializeObject<DailyList>(columnfilter);
                if (colfilter.date?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.date.ToList().Select(c => (c is DateTime) ? Builders<Daily>.Filter.Eq(t => t.date, new BsonDateTime((DateTime)c)) : "{$expr:{$regexMatch:{input:{$dateToString:{format:\"%d %m %Y\",date:\"$date\",timezone:\"" + TimeZoneInfo.Local.DisplayName.Substring(4, 6) + "\"}},regex:/" + ReplaceMonth((string)c) + "/i}}}"));
                if (colfilter.nomor?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.nomor.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Regex(t => t.nomor, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.location?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.location.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Regex(t => t.location, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.well?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.well.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Regex(t => t.well, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.well_string?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.well_string.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Regex(t => t.well_string, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.zone?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.zone.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Regex(t => t.zone, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.interval?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.interval.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq("interval", ((string)c).Split(",").Select(i => i.Split("-")).ToArray())));
                //if (colfilter.interval?.Length > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.interval.ToList().Select(c => Builders<Daily>.Filter.AnyEq("interval", c)));
                // if (colfilter.test_date?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.test_date.ToList().Select(c => (c is DateTime) ? Builders<Daily>.Filter.Eq(t => t.test_date, new BsonDateTime((DateTime)c)) : "{$expr:{$regexMatch:{input:{$dateToString:{format:\"%d %m %Y\",date:\"$date\",timezone:\"" + TimeZoneInfo.Local.DisplayName.Substring(4, 6) + "\"}},regex:/" + ReplaceMonth((string)c) + "/i}}}"));
                // if (colfilter.test_duration?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.test_duration.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.test_duration, Convert.ToDecimal(c))));
                if (colfilter.potensi_prod_gross?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.potensi_prod_gross.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.potensi_prod_gross, Convert.ToDecimal(c))));
                if (colfilter.potensi_prod_net?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.potensi_prod_net.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.potensi_prod_net, Convert.ToDecimal(c))));
                if (colfilter.tes_prod_gross?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.tes_prod_gross.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.tes_prod_gross, Convert.ToDecimal(c))));
                if (colfilter.tes_prod_net?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.tes_prod_net.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.tes_prod_net, Convert.ToDecimal(c))));
                if (colfilter.fig_last_gross?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.fig_last_gross.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.fig_last_gross, Convert.ToDecimal(c))));
                if (colfilter.fig_last_net?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.fig_last_net.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.fig_last_net, Convert.ToDecimal(c))));
                if (colfilter.fig_curr_gross?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.fig_curr_gross.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.fig_curr_gross, Convert.ToDecimal(c))));
                if (colfilter.fig_curr_net?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.fig_curr_net.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.fig_curr_net, Convert.ToDecimal(c))));
                if (colfilter.thp_last_fig?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.thp_last_fig.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.thp_last_fig, Convert.ToDecimal(c))));
                if (colfilter.thp_potensi?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.thp_potensi.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.thp_potensi, Convert.ToDecimal(c))));
                if (colfilter.wc?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.wc.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.wc, Convert.ToDecimal(c))));
                if (colfilter.prod_hours?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.prod_hours.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.prod_hours, Convert.ToDecimal(c))));
                if (colfilter.wor?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.wor.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.wor, Convert.ToDecimal(c))));
                if (colfilter.gas?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.gas.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.gas, Convert.ToDecimal(c))));
                if (colfilter.gor?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.gor.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.gor, Convert.ToDecimal(c))));
                if (colfilter.glr?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.glr.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.glr, Convert.ToDecimal(c))));
                // if (colfilter.ls_method?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.ls_method.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Regex(t => t.ls_method, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.ls_method?.ToList().Count(c => !(c is JObject)) > 0)
                {
                    var validMethods = colfilter.ls_method
                        .ToList()
                        .Where(c => !(c is JObject) && c != null && !string.IsNullOrEmpty(c.ToString()))
                        .Select(c => Builders<Daily>.Filter.Regex(
                            t => t.ls_method,
                            new BsonRegularExpression(c.ToString(), "i")
                        ));

                    if (validMethods.Any())
                        xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(validMethods);
                }

                if (colfilter.ls_brandtype?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.ls_brandtype.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Regex(t => t.ls_brandtype, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.ls_prime_mover?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.ls_prime_mover.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Regex(t => t.ls_prime_mover, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.ls_hp?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.ls_hp.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Regex(t => t.ls_hp, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.ds_size?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.ds_size.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.ds_size, Convert.ToDecimal(c))));
                if (colfilter.ds_spm?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.ds_spm.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.ds_spm, Convert.ToDecimal(c))));
                if (colfilter.ds_bean?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.ds_bean.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.ds_bean, Convert.ToDecimal(c))));
                if (colfilter.ds_whp?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.ds_whp.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.ds_whp, Convert.ToDecimal(c))));
                if (colfilter.ds_fl?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.ds_fl.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.ds_fl, Convert.ToDecimal(c))));
                if (colfilter.ds_casing?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.ds_casing.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.ds_casing, Convert.ToDecimal(c))));
                if (colfilter.ds_separator?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.ds_separator.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.ds_separator, Convert.ToDecimal(c))));
                if (colfilter.ds_pump_displace?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.ds_pump_displace.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.ds_pump_displace, Convert.ToDecimal(c))));
                if (colfilter.ds_efficiency?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.ds_efficiency.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.ds_efficiency, Convert.ToDecimal(c))));
                if (colfilter.ds_sl?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.ds_sl.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.ds_sl, Convert.ToDecimal(c))));
                if (colfilter.ds_kd?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.ds_kd.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.ds_kd, Convert.ToDecimal(c))));
                if (colfilter.sm?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.sm.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.sm, Convert.ToDecimal(c))));
                if (colfilter.ds_tgl_pengujian?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.ds_tgl_pengujian.ToList().Select(c => (c is DateTime) ? Builders<Daily>.Filter.Eq(t => t.ds_tgl_pengujian, new BsonDateTime((DateTime)c)) : "{$expr:{$regexMatch:{input:{$dateToString:{format:\"%d %m %Y\",date:\"$ds_tgl_pengujian\",timezone:\"" + TimeZoneInfo.Local.DisplayName.Substring(4, 6) + "\"}},regex:/" + ReplaceMonth((string)c) + "/i}}}"));
                if (colfilter.noted?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.noted.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Regex(t => t.noted, new BsonRegularExpression((string)c, "i"))));
                //if(filter == "wor")
                //{
                //    if (colfilter.last_prod_gross?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.last_prod_gross.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => (t.last_prod_gross - t.last_prod_net) / t.last_prod_net, Convert.ToDecimal(c))));

                //}

                if (filter == "gas")
                {
                    if (colfilter.gas?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.gas.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.gas, Convert.ToDecimal(c) / 1000)));

                }
                else
                {
                    if (colfilter.gas?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.gas.ToList().Where(c => !(c is JObject)).Select(c => Builders<Daily>.Filter.Eq(t => t.gas, Convert.ToDecimal(c))));

                }

                foreach (string log in DailyCommon._logical)
                {
                    if (colfilter.date?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.date.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[\"$date\",ISODate(\"{1}\")]}}", ((JObject)c).GetValue("opr"), DateTime.Parse(((JObject)c).GetValue("val").ToString()).ToString("yyyy-MM-ddTHH:mm:ssZ"))).ToArray()), log);
                    if (colfilter.nomor?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.nomor.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$nomor\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.location?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.location.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$location\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.well?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.well.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$well\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.well_string?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.well_string.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$well_string\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.zone?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.zone.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$in:[true,{{$map:{{input:\"$zone\",in:{{$regexMatch:{{input:{{$toString:\"$$this\"}},regex:\"{0}\",options:\"i\"}}}}}}}}]}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.interval?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.interval.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$in:[true,{{$map:{{input:{{$reduce:{{input:\"$interval\",initialValue:[],in:{{$concatArrays:[\"$$value\",\"$$this\"]}}}}}},in:{{$regexMatch:{{input:{{$toString:\"$$this\"}},regex:\"{0}\",options:\"i\"}}}}}}}}]}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    // if (colfilter.test_date?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.test_date.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[\"$test_date\",ISODate(\"{1}\")]}}", ((JObject)c).GetValue("opr"), DateTime.Parse(((JObject)c).GetValue("val").ToString()).ToString("yyyy-MM-ddTHH:mm:ssZ"))).ToArray()), log);
                    // if (colfilter.test_duration?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.test_duration.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$test_duration\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.potensi_prod_gross?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.potensi_prod_gross.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$potensi_prod_gross\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.potensi_prod_net?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.potensi_prod_net.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$potensi_prod_net\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.tes_prod_gross?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.tes_prod_gross.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$tes_prod_gross\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.tes_prod_net?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.tes_prod_net.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$tes_prod_net\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.fig_last_gross?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.fig_last_gross.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$fig_last_gross\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.fig_last_net?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.fig_last_net.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$fig_last_net\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.fig_curr_gross?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.fig_curr_gross.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$fig_curr_gross\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.fig_curr_net?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.fig_curr_net.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$fig_curr_net\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.thp_last_fig?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.thp_last_fig.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$thp_last_fig\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.thp_potensi?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.thp_potensi.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$thp_potensi\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.wc?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.wc.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$wc\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.prod_hours?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.prod_hours.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$prod_hours\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.wor?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.wor.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$wor\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.gas?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.gas.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$gas\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.gor?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.gor.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$gor\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.glr?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.glr.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$glr\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.ls_method?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.ls_method.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$ls_method\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.ls_brandtype?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.ls_brandtype.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$ls_brandtype\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.ls_prime_mover?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.ls_prime_mover.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$ls_prime_mover\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.ls_hp?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.ls_hp.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$ls_hp\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.ds_size?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.ds_size.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$ds_size\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.ds_spm?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.ds_spm.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$ds_spm\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.ds_bean?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.ds_bean.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$ds_bean\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.ds_whp?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.ds_whp.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$ds_whp\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.ds_fl?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.ds_fl.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$ds_fl\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.ds_casing?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.ds_casing.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$ds_casing\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.ds_separator?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.ds_separator.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$ds_separator\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.ds_pump_displace?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.ds_pump_displace.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$ds_pump_displace\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.ds_efficiency?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.ds_efficiency.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$ds_efficiency\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.ds_sl?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.ds_sl.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$ds_sl\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.ds_kd?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.ds_kd.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$ds_kd\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.sm?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.sm.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$sm\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.ds_tgl_pengujian?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.date.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[\"$ds_tgl_pengujian\",ISODate(\"{1}\")]}}", ((JObject)c).GetValue("opr"), DateTime.Parse(((JObject)c).GetValue("val").ToString()).ToString("yyyy-MM-ddTHH:mm:ssZ"))).ToArray()), log);
                    if (colfilter.noted?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.noted.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$noted\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    // if (colfilter.gas?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.gas.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$gas\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                }

                xfilter = xfilter & xcolfilter;
            }

            var _items = _daily.Find(xfilter, new FindOptions() { Collation = new Collation("en_US", numericOrdering: true) });


            var total_count = _items.CountDocuments();

            switch (sort)
            {
                case "date": _items = (order == "asc") ? _items.SortBy(t => t.date) : _items.SortByDescending(t => t.date); break;
                case "nomor": _items = (order == "asc") ? _items.SortBy(t => t.nomor) : _items.SortByDescending(t => t.nomor); break;
                case "location": _items = (order == "asc") ? _items.SortBy(t => t.location) : _items.SortByDescending(t => t.location); break;
                case "well": _items = (order == "asc") ? _items.SortBy(t => t.well) : _items.SortByDescending(t => t.well); break;
                case "well_string": _items = (order == "asc") ? _items.SortBy(t => t.well_string) : _items.SortByDescending(t => t.well_string); break;
                case "zone": _items = (order == "asc") ? _items.SortBy(t => t.zone) : _items.SortByDescending(t => t.zone); break;
                case "interval": _items = (order == "asc") ? _items.SortBy(t => t.interval) : _items.SortByDescending(t => t.interval); break;
                // case "test_date": _items = (order == "asc") ? _items.SortBy(t => t.test_date) : _items.SortByDescending(t => t.test_date); break;
                // case "test_duration": _items = (order == "asc") ? _items.SortBy(t => t.test_duration) : _items.SortByDescending(t => t.test_duration); break;
                case "potensi_prod_gross": _items = (order == "asc") ? _items.SortBy(t => t.potensi_prod_gross) : _items.SortByDescending(t => t.potensi_prod_gross); break;
                case "potensi_prod_net": _items = (order == "asc") ? _items.SortBy(t => t.potensi_prod_net) : _items.SortByDescending(t => t.potensi_prod_net); break;
                case "tes_prod_gross": _items = (order == "asc") ? _items.SortBy(t => t.tes_prod_gross) : _items.SortByDescending(t => t.tes_prod_gross); break;
                case "tes_prod_net": _items = (order == "asc") ? _items.SortBy(t => t.tes_prod_net) : _items.SortByDescending(t => t.tes_prod_net); break;
                case "fig_last_gross": _items = (order == "asc") ? _items.SortBy(t => t.fig_last_gross) : _items.SortByDescending(t => t.fig_last_gross); break;
                case "fig_last_net": _items = (order == "asc") ? _items.SortBy(t => t.fig_last_net) : _items.SortByDescending(t => t.fig_last_net); break;
                case "fig_curr_gross": _items = (order == "asc") ? _items.SortBy(t => t.fig_curr_gross) : _items.SortByDescending(t => t.fig_curr_gross); break;
                case "fig_curr_net": _items = (order == "asc") ? _items.SortBy(t => t.fig_curr_net) : _items.SortByDescending(t => t.fig_curr_net); break;
                case "thp_last_fig": _items = (order == "asc") ? _items.SortBy(t => t.thp_last_fig) : _items.SortByDescending(t => t.thp_last_fig); break;
                case "thp_potensi": _items = (order == "asc") ? _items.SortBy(t => t.thp_potensi) : _items.SortByDescending(t => t.thp_potensi); break;
                case "wc": _items = (order == "asc") ? _items.SortBy(t => t.wc) : _items.SortByDescending(t => t.wc); break;
                case "prod_hours": _items = (order == "asc") ? _items.SortBy(t => t.prod_hours) : _items.SortByDescending(t => t.prod_hours); break;
                case "wor": _items = (order == "asc") ? _items.SortBy(t => t.wor) : _items.SortByDescending(t => t.wor); break;
                case "gas": _items = (order == "asc") ? _items.SortBy(t => t.gas) : _items.SortByDescending(t => t.gas); break;
                case "gor": _items = (order == "asc") ? _items.SortBy(t => t.gor) : _items.SortByDescending(t => t.gor); break;
                case "glr": _items = (order == "asc") ? _items.SortBy(t => t.glr) : _items.SortByDescending(t => t.glr); break;
                case "ls_method": _items = (order == "asc") ? _items.SortBy(t => t.ls_method) : _items.SortByDescending(t => t.ls_method); break;
                case "ls_brandtype": _items = (order == "asc") ? _items.SortBy(t => t.ls_brandtype) : _items.SortByDescending(t => t.ls_brandtype); break;
                case "ls_prime_mover": _items = (order == "asc") ? _items.SortBy(t => t.ls_prime_mover) : _items.SortByDescending(t => t.ls_prime_mover); break;
                case "ls_hp": _items = (order == "asc") ? _items.SortBy(t => t.ls_hp) : _items.SortByDescending(t => t.ls_hp); break;
                case "ds_size": _items = (order == "asc") ? _items.SortBy(t => t.ds_size) : _items.SortByDescending(t => t.ds_size); break;
                case "ds_spm": _items = (order == "asc") ? _items.SortBy(t => t.ds_spm) : _items.SortByDescending(t => t.ds_spm); break;
                case "ds_bean": _items = (order == "asc") ? _items.SortBy(t => t.ds_bean) : _items.SortByDescending(t => t.ds_bean); break;
                case "ds_whp": _items = (order == "asc") ? _items.SortBy(t => t.ds_whp) : _items.SortByDescending(t => t.ds_whp); break;
                case "ds_fl": _items = (order == "asc") ? _items.SortBy(t => t.ds_fl) : _items.SortByDescending(t => t.ds_fl); break;
                case "ds_casing": _items = (order == "asc") ? _items.SortBy(t => t.ds_casing) : _items.SortByDescending(t => t.ds_casing); break;
                case "ds_separator": _items = (order == "asc") ? _items.SortBy(t => t.ds_separator) : _items.SortByDescending(t => t.ds_separator); break;
                case "ds_pump_displace": _items = (order == "asc") ? _items.SortBy(t => t.ds_pump_displace) : _items.SortByDescending(t => t.ds_pump_displace); break;
                case "ds_efficiency": _items = (order == "asc") ? _items.SortBy(t => t.ds_efficiency) : _items.SortByDescending(t => t.ds_efficiency); break;
                case "ds_sl": _items = (order == "asc") ? _items.SortBy(t => t.ds_sl) : _items.SortByDescending(t => t.ds_sl); break;
                case "ds_kd": _items = (order == "asc") ? _items.SortBy(t => t.ds_kd) : _items.SortByDescending(t => t.ds_kd); break;
                case "sm": _items = (order == "asc") ? _items.SortBy(t => t.sm) : _items.SortByDescending(t => t.sm); break;
                case "ds_tgl_pengujian": _items = (order == "asc") ? _items.SortBy(t => t.ds_tgl_pengujian) : _items.SortByDescending(t => t.ds_tgl_pengujian); break;
                case "noted": _items = (order == "asc") ? _items.SortBy(t => t.noted) : _items.SortByDescending(t => t.noted); break;
            }

            switch (mode)
            {
                case "":
                case null:
                    List<Daily> items = _items
                    .Skip(page * pagesize)
                    .Limit(pagesize)
                    .Project<Daily>(_fields_daily).ToList();

                    //if (filter == "gas") items = items.Where(t => (t.last_prod_gross == 0 || t.gas / t.last_prod_gross > (decimal)0.005))
                    if (filter == "gas") items = items.Where(t => (t.gas != 0))
                                  .Select(n => { n.gas = n.gas * 1000; return n; }).ToList();
                    return new JsonResult(new
                    {
                        total_count = total_count,
                        incomplete_result = false,
                        items = items,
                        test = "test",
                    })
                    {
                        StatusCode = StatusCodes.Status200OK
                    };

                case "excel":
                    return GetExcel(_items
                    //.Limit(10000)
                    .Project<Daily>(_fields_daily).ToList());

                default:
                    dynamic res;
                    switch (mode)
                    {
                        case "location":
                        case "well":
                        case "well_string":
                        case "zone":
                        case "art_lift_size":
                        case "ls_method":
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
                            res = _daily.Find(xfilter).ToEnumerable().Select(t => String.Join(",", t.interval.Select(i => String.Join("-", i)))).Distinct().OrderBy(t => t).ToList();
                            break;
                        case "gas":
                            if (filter == "gas")
                            {
                                res = _daily.Distinct<decimal?>(mode, xfilter).ToEnumerable().Select(t => t * 1000).OrderBy(t => t).ToList();
                            }
                            else
                            {
                                res = _daily.Distinct<decimal?>(mode, xfilter).ToEnumerable().OrderBy(t => t).ToList();
                            }
                            break;
                        default:
                            // res = _daily.Distinct<decimal?>(mode, xfilter).ToEnumerable().OrderBy(t => t).ToList();
                            // break;
                            try
                            {
                                // coba ambil sebagai angka
                                res = _daily.Distinct<decimal?>(mode, xfilter).ToEnumerable().OrderBy(t => t).ToList();
                            }
                            catch (FormatException)
                            {
                                // kalau gagal, fallback ke string
                                res = _daily.Distinct<string>(mode, xfilter).ToEnumerable().OrderBy(t => t).ToList();
                            }
                            break;
                    }

                    return new JsonResult(new
                    {
                        //total_count = res.Count(),
                        items = res,
                    });
            }

        }

        [Authorize("PeDaily Read")]
        [HttpGet("GetAreaChart")]
        public ActionResult GetAreaChart(string type, DateTime? date, DateTime? end_date, string[] well)
        {
            switch (type)
            {
                case "well_performance_daily":
                    var daily_area = _daily.Find(
                        r => well.Contains(r.well) &&
                        r.date >= date && r.date <= end_date
                    ).Project<Daily>(_fields_daily).ToList().OrderBy(t => t.date).Select(s => new
                    {
                        date = TimeZoneInfo.ConvertTimeFromUtc(s.date.Value, TimeZoneInfo.Local),
                        well = s.well,
                        gross = s.fig_curr_gross,
                        net = s.fig_curr_net,
                        sm = s.sm,
                    });

                    return Ok(new { data = daily_area });
                default:
                    return Ok(new { });
            }
        }

        [Authorize("PeDaily Read")]
        [HttpGet("GetChart")]

        public ActionResult GetChart(string type, DateTime? date, DateTime? end_date, string[] well)
        {
            switch (type)
            {
                case "well_performance":
                    var daily_chart = _daily.Find(
                        r => well.Contains(r.well) &&
                        r.date >= date && r.date <= end_date
                    ).Project<Daily>(_fields_daily).ToList().OrderBy(t => t.date).Select(s => new
                    {
                        date = TimeZoneInfo.ConvertTimeFromUtc(s.date.Value, TimeZoneInfo.Local),
                        well = s.well,
                        gross = s.fig_curr_gross,
                        net = s.fig_curr_net,
                        gas = s.gas,
                        sl = s.ds_sl,
                        spm = s.ds_spm,
                        wc = s.wc,
                        kd = s.ds_kd,
                        thp = s.thp_potensi,
                        sm = s.sm,
                        whp = s.ds_whp,
                    });

                    return Ok(new { data = daily_chart });
                default:
                    return Ok(new { });
            }
        }

        [Authorize("PeDaily Read")]
        [HttpGet("GetSemilogChart")]

        public ActionResult GetSemilogChart(string type, DateTime? date, DateTime? end_date, string[] well)
        {
            switch (type)
            {
                case "well_performance_semilog":
                    var daily_chart = _daily.Find(
                        r => well.Contains(r.well) &&
                        r.date >= date && r.date <= end_date
                    ).Project<Daily>(_fields_daily).ToList().OrderBy(t => t.date).Select(s => new
                    {
                        date = TimeZoneInfo.ConvertTimeFromUtc(s.date.Value, TimeZoneInfo.Local),
                        well = s.well,
                        gross = s.fig_curr_gross,
                        net = s.fig_curr_net,
                    });

                    return Ok(new { data = daily_chart });
                default:
                    return Ok(new { });
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

        public ActionResult GetExcel(List<Daily> items)
        {
            var workbook = new ExcelPackage();
            var ws = workbook.Workbook.Worksheets.Add("Daily");
            ws.Cells[1, 1].Value = "Date";
            ws.Cells[1, 1, 4, 1].Merge = true;
            ws.Cells[1, 2].Value = "No";
            ws.Cells[1, 2, 4, 2].Merge = true;
            ws.Cells[1, 3].Value = "Location";
            ws.Cells[1, 3, 4, 3].Merge = true;
            ws.Cells[1, 4].Value = "Well";
            ws.Cells[1, 4, 4, 4].Merge = true;
            ws.Cells[1, 5].Value = "LS/SS";
            ws.Cells[1, 5, 4, 5].Merge = true;
            ws.Cells[1, 6].Value = "Zone";
            ws.Cells[1, 6, 4, 6].Merge = true;
            ws.Cells[1, 7].Value = "Interval";
            ws.Cells[1, 7, 4, 7].Merge = true;

            ws.Cells[1, 8].Value = "POTENSI PRODUKSI (IPR)";
            ws.Cells[1, 8, 1, 9].Merge = true;    // merge H1:I1
            ws.Cells[2, 8].Value = "GROSS";
            ws.Cells[2, 9].Value = "NET";
            ws.Cells[2, 8, 2, 9].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;

            ws.Cells[3, 8].Value = "(BLPD)";
            ws.Cells[3, 8, 4, 8].Merge = true;
            ws.Cells[3, 9].Value = "(BOPD)";
            ws.Cells[3, 9, 4, 9].Merge = true;

            ws.Cells[1, 10].Value = "TES PRODUKSI";
            ws.Cells[1, 10, 1, 11].Merge = true;   // merge J1:K1
            ws.Cells[2, 10].Value = "GROSS";
            ws.Cells[2, 11].Value = "NET";

            ws.Cells[3, 10].Value = "(BLPD)";
            ws.Cells[3, 10, 4, 10].Merge = true;
            ws.Cells[3, 11].Value = "(BOPD)";
            ws.Cells[3, 11, 4, 11].Merge = true;

            ws.Cells[1, 12].Value = "FIGURE";
            ws.Cells[1, 12, 1, 15].Merge = true;   // merge L1:O1

            // Subheader untuk Last Tes (kolom L-M)
            ws.Cells[2, 12].Value = "GROSS";
            ws.Cells[2, 13].Value = "NET";
            ws.Cells[3, 12].Value = "(BLPD)";
            ws.Cells[3, 13].Value = "(BOPD)";
            ws.Cells[4, 12].Value = "Last Tes";
            ws.Cells[4, 12, 4, 13].Merge = true;   // merge L2:M2

            // Subheader untuk Current Tes (kolom N-O)
            ws.Cells[2, 14].Value = "GROSS";
            ws.Cells[2, 15].Value = "NET";
            ws.Cells[3, 14].Value = "(BLPD)";
            ws.Cells[3, 15].Value = "(BOPD)";
            ws.Cells[4, 14].Value = "Current Tes";
            ws.Cells[4, 14, 4, 15].Merge = true;   // merge N2:O2

            ws.Cells[1, 16].Value = "L/O/G thp Last Figure";
            ws.Cells[1, 16, 4, 16].Merge = true;
            ws.Cells[1, 17].Value = "L/O/G thp Potensi";
            ws.Cells[1, 17, 4, 17].Merge = true;
            ws.Cells[1, 18].Value = "WC %";
            ws.Cells[1, 18, 4, 18].Merge = true;

            ws.Cells[1, 19].Value = "PROD HOURS";
            ws.Cells[1, 19, 2, 19].Merge = true;
            ws.Cells[3, 19].Value = "(JAM)";
            ws.Cells[3, 19, 4, 19].Merge = true;

            ws.Cells[1, 20].Value = "WOR";
            ws.Cells[1, 20, 4, 20].Merge = true;

            ws.Cells[1, 21].Value = "Q. GAS";
            ws.Cells[1, 21, 3, 21].Merge = true;
            ws.Cells[4, 21].Value = "mmscfd";

            ws.Cells[1, 22].Value = "GOR";
            ws.Cells[1, 22, 3, 22].Merge = true;
            ws.Cells[4, 22].Value = "scf/bbl";

            ws.Cells[1, 23].Value = "GLR";
            ws.Cells[1, 23, 3, 23].Merge = true;
            ws.Cells[4, 23].Value = "scf/bbl";

            ws.Cells[1, 24].Value = " LIFTING STATUS";
            ws.Cells[1, 24, 1, 27].Merge = true;

            ws.Cells[2, 24].Value = "METHOD";
            ws.Cells[2, 24, 4, 24].Merge = true;
            ws.Cells[2, 25].Value = "BRANDTYPE";
            ws.Cells[2, 25, 4, 25].Merge = true;
            ws.Cells[2, 26].Value = "PRIME OVER";
            ws.Cells[2, 26, 4, 26].Merge = true;
            ws.Cells[2, 27].Value = "HP/VRG";
            ws.Cells[2, 27, 4, 27].Merge = true;

            ws.Cells[1, 28].Value = "DATA SUMUR";
            ws.Cells[1, 28, 1, 40].Merge = true;

            ws.Cells[2, 28].Value = "BEAN";
            ws.Cells[2, 28, 3, 28].Merge = true;
            ws.Cells[4, 28].Value = "(MM)";

            ws.Cells[2, 29].Value = "WHP";
            ws.Cells[2, 29, 3, 29].Merge = true;
            ws.Cells[4, 29].Value = "(PSI)";

            ws.Cells[2, 30].Value = "FL";
            ws.Cells[2, 30, 3, 30].Merge = true;
            ws.Cells[4, 30].Value = "(PSI)";

            ws.Cells[2, 31].Value = "CASING";
            ws.Cells[2, 31, 3, 31].Merge = true;
            ws.Cells[4, 31].Value = "(PSI)";

            ws.Cells[2, 32].Value = "SEPARATOR";
            ws.Cells[2, 32, 3, 32].Merge = true;
            ws.Cells[4, 32].Value = "(PSI)";

            ws.Cells[2, 33].Value = "SPM / Freq.";
            ws.Cells[2, 33, 4, 33].Merge = true;

            ws.Cells[2, 34].Value = "PUMP SIZE";
            ws.Cells[2, 34, 3, 34].Merge = true;
            ws.Cells[4, 34].Value = "(INCH)";

            ws.Cells[2, 35].Value = "PUMP DISPLACE";
            ws.Cells[2, 35, 3, 35].Merge = true;
            ws.Cells[4, 35].Value = "(BLPD)";

            ws.Cells[2, 36].Value = "PUMP EFF.";
            ws.Cells[2, 36, 3, 36].Merge = true;
            ws.Cells[4, 36].Value = "(%)";

            ws.Cells[2, 37].Value = "SL";
            ws.Cells[2, 37, 3, 37].Merge = true;
            ws.Cells[4, 37].Value = "(INCH)";

            ws.Cells[2, 38].Value = "KD";
            ws.Cells[2, 38, 3, 38].Merge = true;
            ws.Cells[4, 38].Value = "(M)";

            ws.Cells[2, 39].Value = "SM";
            ws.Cells[2, 39, 3, 39].Merge = true;
            ws.Cells[4, 39].Value = "(M)";

            ws.Cells[2, 40].Value = "TGL. PENGUJIAN SUMUR";
            ws.Cells[2, 40, 4, 40].Merge = true;

            ws.Cells[1, 41].Value = "KETERANGAN";
            ws.Cells[1, 41, 4, 41].Merge = true;


            ws.Cells[1, 1, 1, 41].Style.Font.Bold = true;
            ws.Cells[1, 1, 3, 41].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            ws.Cells[1, 1, 3, 41].Style.VerticalAlignment = ExcelVerticalAlignment.Top;

            for (int c = 1; c <= 27; c++)
            {
                //ws.Column(c).AutoFit();
            }

            for (int i = 0; i < items.Count(); i++)
            {
                var t = items.ElementAt(i);
                ws.Cells[5 + i, 1].Style.Numberformat.Format = "d-MMM-yy";
                ws.Cells[5 + i, 1].Value = t.date.HasValue ? t.date.Value.ToLocalTime().ToOADate() : (double?)null;
                ws.Cells[5 + i, 2].Value = t.nomor;
                ws.Cells[5 + i, 3].Value = t.location;
                ws.Cells[5 + i, 4].Value = t.well;
                ws.Cells[5 + i, 5].Value = t.well_string;
                ws.Cells[5 + i, 6].Value = String.Join(", ", t.zone);
                ws.Cells[5 + i, 7].Value = String.Join(", ", t.interval.Select(d => String.Join(" - ", d)).ToArray());
                // ws.Cells[4 + i, 8].Style.Numberformat.Format = "d-MMM-yy";
                // ws.Cells[4 + i, 5].Value = t.test_date.HasValue ? t.test_date.Value.ToLocalTime().ToOADate() : (double?)null;
                // ws.Cells[4 + i, 6].Value = t.test_duration;
                ws.Cells[5 + i, 8].Value = t.potensi_prod_gross;
                ws.Cells[5 + i, 9].Value = t.potensi_prod_net;
                ws.Cells[5 + i, 10].Value = t.tes_prod_gross;
                ws.Cells[5 + i, 11].Value = t.tes_prod_net;
                ws.Cells[5 + i, 12].Value = t.fig_last_gross;
                ws.Cells[5 + i, 13].Value = t.fig_last_net;
                ws.Cells[5 + i, 14].Value = t.fig_curr_gross;
                ws.Cells[5 + i, 15].Value = t.fig_curr_net;
                ws.Cells[5 + i, 16].Value = t.thp_last_fig;
                ws.Cells[5 + i, 17].Value = t.thp_potensi;
                ws.Cells[5 + i, 18].Value = t.wc;
                ws.Cells[5 + i, 19].Value = t.prod_hours;
                ws.Cells[5 + i, 20].Value = t.wor;
                ws.Cells[5 + i, 21].Value = t.gas;
                ws.Cells[5 + i, 22].Value = t.gor;
                ws.Cells[5 + i, 23].Value = t.glr;
                ws.Cells[5 + i, 24].Value = t.ls_method;
                ws.Cells[5 + i, 25].Value = t.ls_brandtype;
                ws.Cells[5 + i, 26].Value = t.ls_prime_mover;
                ws.Cells[5 + i, 27].Value = t.ls_hp;
                ws.Cells[5 + i, 28].Value = t.ds_bean;
                ws.Cells[5 + i, 29].Value = t.ds_whp;
                ws.Cells[5 + i, 30].Value = t.ds_fl;
                ws.Cells[5 + i, 31].Value = t.ds_casing;
                ws.Cells[5 + i, 32].Value = t.ds_separator;
                ws.Cells[5 + i, 33].Value = t.ds_spm;
                ws.Cells[5 + i, 34].Value = t.ds_size;
                ws.Cells[5 + i, 35].Value = t.ds_pump_displace;
                ws.Cells[5 + i, 36].Value = t.ds_efficiency;
                ws.Cells[5 + i, 37].Value = t.ds_sl;
                ws.Cells[5 + i, 38].Value = t.ds_kd;
                ws.Cells[5 + i, 39].Value = t.sm;
                ws.Cells[5 + i, 40].Style.Numberformat.Format = "d-MMM-yy";
                ws.Cells[5 + i, 40].Value = t.ds_tgl_pengujian.HasValue ? t.ds_tgl_pengujian.Value.ToLocalTime().ToOADate() : (double?)null;
                ws.Cells[5 + i, 42].Value = t.noted;
            }

            ws.Cells[5, 6, 5 + items.Count(), 28].Style.Numberformat.Format = "#,###";
            ws.Cells[5, 30, 5 + items.Count(), 35].Style.Numberformat.Format = "#,###";
            ws.Cells[5, 24, 5 + items.Count(), 26].Style.Numberformat.Format = "#,###.0";

            MemoryStream memoryStream = new MemoryStream(workbook.GetAsByteArray());
            memoryStream.Position = 0;
            return File(memoryStream, "application/vnd.ms-excel", "Daily.xlsx");
        }

        [Authorize("PeDaily Add")]
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
                if (!string.IsNullOrWhiteSpace(ws.Cells[r, 1].Value?.ToString()))
                {
                    Daily _row = new Daily();
                    DailyError _row_error = new DailyError();
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

                    if (!String.IsNullOrWhiteSpace(ws.Cells[r, 40].Value?.ToString()))
                    {
                        try
                        {
                            var cellValue = ws.Cells[r, 40].Value;
                            DateTime parsedDate;

                            if (cellValue is DateTime dt)
                            {
                                parsedDate = dt;
                            }
                            else if (cellValue is double dbl)
                            {
                                parsedDate = DateTime.FromOADate(dbl);
                            }
                            else
                            {
                                var strValue = cellValue.ToString().Trim();
                                if (DateTime.TryParse(strValue, out parsedDate))
                                {
                                    // parsedDate is set
                                }
                                else if (double.TryParse(strValue, out dbl))
                                {
                                    parsedDate = DateTime.FromOADate(dbl);
                                }
                                else
                                {
                                    throw new Exception("Unable to parse date value: " + strValue);
                                }
                            }

                            _row.ds_tgl_pengujian = parsedDate;
                        }
                        catch (Exception e)
                        {
                            _row_error.ds_tgl_pengujian = new ErrorItem { value = ws.Cells[r, 40].Value?.ToString(), message = e.Message };
                            error_count++;
                        }
                    }
                    else
                    {
                        _row_error.ds_tgl_pengujian = null;
                    }

                    // Define mappings for string properties with their corresponding column indexes
                    // strings
                    var stringMappings = new[]
                    {
                        new { key = "location", col = 3, required = true, errorMsg = "Blank location name is not allowed" },
                        new { key = "well", col = 4, required = true, errorMsg = "Blank Well String name is not allowed" },
                        new { key = "well_string", col = 5, required = false, errorMsg = "" },
                        new { key = "ls_method", col = 24, required = false, errorMsg = "" },
                        new { key = "ls_brandtype", col = 25, required = false, errorMsg = "" },
                        new { key = "ls_prime_mover", col = 26, required = false, errorMsg = "" },
                        new { key = "ls_hp", col = 27, required = false, errorMsg = "" },
                        // new { key = "ds_tgl_pengujian", col = 40, required = false, errorMsg = "" },
                        new { key = "noted", col = 41, required = false, errorMsg = "" },
                    };

                    foreach (var mapping in stringMappings)
                    {
                        var rawValue = ws.Cells[r, mapping.col].Value;
                        var strValue = rawValue?.ToString().Trim();

                        var prop = typeof(Daily).GetProperty(mapping.key);
                        var errorProp = typeof(DailyError).GetProperty(mapping.key);

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

                    //try
                    //{
                    //    _row.zone = ws.Cells[r, 6].Value?.ToString().Trim().Split(",").Select(z => z.Trim()).ToArray();
                    //}
                    //catch (Exception e)
                    //{
                    //    _row_error.zone = new ErrorItem { value = ws.Cells[r, 6].Value?.ToString(), message = e.Message };
                    //    error_count++;
                    //}

                    // Define mappings for array properties with their corresponding column indexes, parsing logic, and required flag
                    var arrayMappings = new[]
                    {
                        new
                        {
                            key = "zone",
                            col = 6,
                            required = false,
                            errorMsg = "Blank zone is not allowed",
                            parse = new Func<string, object>(val => val.Split(",").Select(z => z.Trim()).ToArray())
                        },
                        new
                        {
                            key = "interval",
                            col = 7,
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
                        new { key = "nomor", col = 2 },
                        new { key = "potensi_prod_gross", col = 8 },
                        new { key = "potensi_prod_net", col = 9 },
                        new { key = "tes_prod_gross", col = 10 },
                        new { key = "tes_prod_net", col = 11 },
                        new { key = "fig_last_gross", col = 12 },
                        new { key = "fig_last_net", col = 13 },
                        new { key = "fig_curr_gross", col = 14 },
                        new { key = "fig_curr_net", col = 15 },
                        new { key = "thp_last_fig", col = 16 },
                        new { key = "thp_potensi", col = 17 },
                        new { key = "wc", col = 18 },
                        new { key = "prod_hours", col = 19 },
                        new { key = "wor", col = 20 },
                        new { key = "gas", col = 21 },
                        new { key = "gor", col = 22 },
                        new { key = "glr", col = 23 },
                        new { key = "ds_bean", col = 28 },
                        new { key = "ds_whp", col = 29 },
                        new { key = "ds_fl", col = 30 },
                        new { key = "ds_casing", col = 31 },
                        new { key = "ds_separator", col = 32 },
                        new { key = "ds_spm", col = 33 },
                        new { key = "ds_size", col = 34 },
                        new { key = "ds_pump_displace", col = 35 },
                        new { key = "ds_efficiency", col = 36 },
                        new { key = "ds_sl", col = 37 },
                        new { key = "ds_kd", col = 38 },
                        new { key = "sm", col = 39 },
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
                    // ...existing code...


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

            DailyTmp _tmp = new DailyTmp

            {
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

        [Authorize("PeDaily Add")]
        [HttpGet("Tmp")]
        public ActionResult GetTmp(string _id, String sort = "date", String order = "desc", int page = 0, int pagesize = 50, String filter = "", String columnfilter = "", string mode = "")
        {
            DailyTmp _tmp = _daily_tmp.Find(t => t._id == _id).FirstOrDefault();
            List<Daily> _tmpitems = _tmp.items.ToList();
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
            }
            else
            {
                return BadRequest();
            }
        }

        [Authorize("PeDaily Add")]
        [HttpGet("SaveData")]
        public ActionResult SaveData(string _id)
        {
            try
            {
                DailyTmp _tmp = _daily_tmp.Find(t => t._id == _id).FirstOrDefault();

                if (_tmp == null || _tmp.error_count > 0)
                {
                    throw new Exception();
                }

                List<Daily> items = _tmp.items != null ? _tmp.items.ToList() : new List<Daily>();

                var figure = items.GroupBy(g => new
                {
                    date = g.date
                }).Select(s => new
                {
                    date = s.Key.date,
                    figure = s.Sum(p => p.fig_curr_net)
                }).ToList();
                foreach (var item in figure)
                {
                    var update = Builders<Production>.Update
                  .Set(t => t.figure, item.figure)
                  .Set(t => t.date, item.date);
                    UpdateResult res = _production.UpdateOne(
                        Builders<Production>.Filter.Eq(t => t.date, item.date.Value.ToLocalTime()),
                        update, new UpdateOptions() { IsUpsert = true });

                }
                if (_fields_structure != null)
                {
                    List<Structure> structure = _structure.Find(s => true).Project<Structure>(_fields_structure).ToList();
                    foreach (Structure str in structure)
                    {
                        foreach (string prefix in str.prefix)
                        {
                            List<Daily> _dstr = items.Where(i => i.well.StartsWith(prefix)).ToList();
                            foreach (Daily dstr in _dstr)
                            {
                                dstr.structure = new DailyStructure
                                {
                                    name = str.name,
                                    shortName = str.shortName,
                                };
                            }
                        }
                    }
                }

                long modified_count = 0;
                long created_count = items.Count();
                Daily daily;
                foreach (Daily item in items)
                {
                    item._error = null;
                    // daily = DailyCommon.CalculateFields(item);

                    var update = Builders<Daily>.Update.Set(t => t.date, item.date)
                        .Set(t => t.nomor, item.nomor)
                        .Set(t => t.location, item.location)
                        .Set(t => t.well, item.well)
                        .Set(t => t.well_string, item.well_string)
                        .Set(t => t.zone, item.zone)
                        .Set(t => t.interval, item.interval)
                        .Set(t => t.potensi_prod_gross, item.potensi_prod_gross)
                        .Set(t => t.potensi_prod_net, item.potensi_prod_net)
                        .Set(t => t.tes_prod_gross, item.tes_prod_gross)
                        .Set(t => t.tes_prod_net, item.tes_prod_net)
                        .Set(t => t.fig_last_gross, item.fig_last_gross)
                        .Set(t => t.fig_last_net, item.fig_last_net)
                        .Set(t => t.fig_curr_gross, item.fig_curr_gross)
                        .Set(t => t.fig_curr_net, item.fig_curr_net)
                        .Set(t => t.thp_last_fig, item.thp_last_fig)
                        .Set(t => t.thp_potensi, item.thp_potensi)
                        .Set(t => t.wc, item.wc)
                        .Set(t => t.prod_hours, item.prod_hours)
                        .Set(t => t.wor, item.wor)
                        .Set(t => t.gas, item.gas)
                        .Set(t => t.gor, item.gor)
                        .Set(t => t.glr, item.glr)
                        .Set(t => t.ls_method, item.ls_method)
                        .Set(t => t.ls_brandtype, item.ls_brandtype)
                        .Set(t => t.ls_prime_mover, item.ls_prime_mover)
                        .Set(t => t.ls_hp, item.ls_hp)
                        .Set(t => t.ds_size, item.ds_size)
                        .Set(t => t.ds_spm, item.ds_spm)
                        .Set(t => t.ds_bean, item.ds_bean)
                        .Set(t => t.ds_whp, item.ds_whp)
                        .Set(t => t.ds_fl, item.ds_fl)
                        .Set(t => t.ds_casing, item.ds_casing)
                        .Set(t => t.ds_separator, item.ds_separator)
                        .Set(t => t.ds_pump_displace, item.ds_pump_displace)
                        .Set(t => t.ds_efficiency, item.ds_efficiency)
                        .Set(t => t.ds_sl, item.ds_sl)
                        .Set(t => t.ds_kd, item.ds_kd)
                        .Set(t => t.sm, item.sm)
                        .Set(t => t.ds_tgl_pengujian, item.ds_tgl_pengujian)
                        .Set(t => t.noted, item.noted)

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

                //CalculateFigure();

                return Ok(new
                {
                    modified_count = modified_count,
                    created_count = created_count,
                    total_count = items.Count(),
                    figure = figure
                });
            }
            catch (Exception e)
            {
                return BadRequest();
            }
        }

        [Authorize("PeDaily Delete")]
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


        [Authorize("PeDaily Read")]
        [HttpGet("buildfigure")]
        public ActionResult GetFigure()
        {


            var _items = _daily.Find(new BsonDocument(), new FindOptions() { Collation = new Collation("en_US", numericOrdering: true) });


            var total_count = _items.CountDocuments();

            List<Daily> items = _items
            .Project<Daily>(_fields_daily).ToList();
            // Sementara , kalau sudah hapus.
            var figure = items.GroupBy(g => new
            {
                date = g.date
            }).Select(s => new
            {
                date = s.Key.date,
                figure = s.Sum(p => p.fig_curr_net)
            }).ToList();
            foreach (var item in figure)
            {
                var update = Builders<Production>.Update
              .Set(t => t.figure, item.figure)
              .Set(t => t.date, item.date);
                UpdateResult result = _production.UpdateOne(
                    Builders<Production>.Filter.Eq(t => t.date, item.date.Value.ToLocalTime()),
                    update, new UpdateOptions() { IsUpsert = true });

            }

            return new JsonResult(new
            {
                total_count = total_count,
                incomplete_result = false,
                items = figure,
            })
            {
                StatusCode = StatusCodes.Status200OK
            };
        }


        public void CalculateFigure()
        {
            var _items = _daily.Find(new BsonDocument(), new FindOptions() { Collation = new Collation("en_US", numericOrdering: true) });
            var total_count = _items.CountDocuments();

            List<Daily> items = _items
                    .Project<Daily>(_fields_daily).ToList();
            // Sementara , kalau sudah hapus.
            var figure = items.GroupBy(g => new
            {
                date = g.date
            }).Select(s => new
            {
                date = s.Key.date,
                figure = s.Sum(p => p.fig_curr_net)
            }).ToList();
            foreach (var item in figure)
            {
                var update = Builders<Production>.Update
              .Set(t => t.figure, item.figure)
              .Set(t => t.date, item.date);
                UpdateResult result = _production.UpdateOne(
                    Builders<Production>.Filter.Eq(t => t.date, item.date.Value.ToLocalTime()),
                    update, new UpdateOptions() { IsUpsert = true });

            }
        }

    }
}
