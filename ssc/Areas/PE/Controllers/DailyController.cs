using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Web.Http;
using MongoDB.Driver;
using MongoDB.Bson;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using ssc.Areas.PE.Models;
using ssc.Services;
using System.Globalization;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System.Drawing;
using System.IO;
using OfficeOpenXml.FormulaParsing.Excel.Functions.Text;

namespace ssc.Areas.PE.Controllers
{
    [Route("api/pe/[controller]")]
    [ApiController]
    public class DailyController : ControllerBase
    {
        private readonly IMongoCollection<Daily> _daily;
        // STEP 1 - define mongo collection for sonolog
        private readonly IMongoCollection<Sonolog> _sonolog;
        private readonly IMongoCollection<DailyTmp> _daily_tmp;
        private readonly IMongoCollection<Structure> _structure;
        // Tambah field di atas constructor
        private readonly IMongoCollection<PeOptimasiQuadrantRemark> _quadrantRemarks;
        private ProjectionDefinition<Daily> _fields_daily;
        private ProjectionDefinition<Structure> _fields_structure;

        private readonly IMongoCollection<Production> _production;
        private readonly IBackgroundTaskQueue _taskQueue;

        public DailyController(IPEDatabaseSettings settings, IBackgroundTaskQueue taskQueue)
        {

            _daily = DailyCommon._daily;
            // STEP 2 - initialize mongo collection for sonolog
            _sonolog = DailyCommon._sonolog;
            _production = DailyCommon._production;
            _daily_tmp = DailyCommon._daily_tmp;
            _structure = DailyCommon._structure;
            _fields_daily = DailyCommon._fields_daily;
            _fields_structure = DailyCommon._fields_structure;
            _taskQueue = taskQueue;

            _quadrantRemarks = DailyCommon.database.GetCollection<PeOptimasiQuadrantRemark>("pe_optimasi_remarks");
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
                if (colfilter.well?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.well.ToList().Where(c => !(c is JObject)).Select(c =>
                    ((string)c == "__NULL__") ? Builders<Daily>.Filter.Or(Builders<Daily>.Filter.Eq(t => t.well, null), Builders<Daily>.Filter.Eq(t => t.well, ""))
                    : Builders<Daily>.Filter.Regex(t => t.well, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.well_string?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Daily>.Filter.Or(colfilter.well_string.ToList().Where(c => !(c is JObject)).Select(c =>
                    ((string)c == "__NULL__") ? Builders<Daily>.Filter.Or(Builders<Daily>.Filter.Eq(t => t.well_string, null), Builders<Daily>.Filter.Eq(t => t.well_string, ""))
                    : Builders<Daily>.Filter.Regex(t => t.well_string, new BsonRegularExpression((string)c, "i"))));
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
        [HttpPost]
        public ActionResult Post(String sort = "date", String order = "desc", int page = 0, int pagesize = 50, String filter = "", [FromBody] dynamic body = null, string mode = "")
        {
            String columnfilter = "";
            if (body != null && body.columnfilter != null)
            {
                columnfilter = JsonConvert.SerializeObject(body.columnfilter);
            }
            return Get(sort, order, page, pagesize, filter, columnfilter, mode);
        }

        [Authorize("PeDaily Read")]
        [HttpGet("GetAreaChart")]
        public ActionResult GetAreaChart(string type, DateTime? date, DateTime? end_date, string[] well = null, string[] well_string = null)
        {
            switch (type)
            {
                case "well_performance_daily":
                    var areaFilter = Builders<Daily>.Filter.Empty;
                    if (well != null && well.Length > 0)
                        areaFilter &= Builders<Daily>.Filter.In(r => r.well, well);
                    if (well_string != null && well_string.Length > 0)
                    {
                        var hasBlankWellString = well_string.Any(s => string.IsNullOrEmpty(s) || s == "NULL");
                        var nonBlankWellStrings = well_string.Where(s => !string.IsNullOrEmpty(s) && s != "NULL").ToArray();
                        FilterDefinition<Daily> wellStringFilter = Builders<Daily>.Filter.Empty;

                        if (nonBlankWellStrings.Length > 0)
                            wellStringFilter = Builders<Daily>.Filter.In(r => r.well_string, nonBlankWellStrings);

                        if (hasBlankWellString)
                        {
                            var blankFilter = Builders<Daily>.Filter.Or(
                                Builders<Daily>.Filter.Eq(r => r.well_string, null),
                                Builders<Daily>.Filter.Eq(r => r.well_string, "")
                            );

                            wellStringFilter = nonBlankWellStrings.Length > 0
                                ? Builders<Daily>.Filter.Or(wellStringFilter, blankFilter)
                                : blankFilter;
                        }

                        areaFilter &= wellStringFilter;
                    }
                    if (date.HasValue)
                        areaFilter &= Builders<Daily>.Filter.Gte(r => r.date, date);
                    if (end_date.HasValue)
                        areaFilter &= Builders<Daily>.Filter.Lte(r => r.date, end_date);

                    var daily_area = _daily.Find(areaFilter)
                    .Project<Daily>(_fields_daily).ToList().OrderBy(t => t.date).Select(s => new
                    {
                        date = TimeZoneInfo.ConvertTimeFromUtc(s.date.Value, TimeZoneInfo.Local),
                        well = s.well,
                        gross = s.fig_curr_gross,
                        net = s.fig_curr_net,
                        sm = s.sm,
                        zone = s.zone,
                        interval = s.interval,
                        wc = s.wc,
                        ls_method = s.ls_method,
                        ds_kd = s.ds_kd,
                        ds_sl = s.ds_sl,
                        ds_spm = s.ds_spm,
                        size = s.ds_size,
                        lifting_capacity = s.ds_pump_displace,
                        gas = s.gas,
                        wor = s.wor,
                        // qmax = s.qmax,
                    });

                    return Ok(new { data = daily_area });
                // STEP 3 - case for taking sfl attribute for biggest date that not null from sonolog
                case "sfl_latest":
                    if (well == null)
                        return BadRequest("well parameter is required");

                    var filter = Builders<Sonolog>.Filter.And(
                        Builders<Sonolog>.Filter.In(x => x.well, well),
                        Builders<Sonolog>.Filter.Ne(x => x.sfl, null)
                    );

                    var latestSfl = _sonolog
                        .Find(filter)
                        .SortByDescending(x => x.date)
                        .FirstOrDefault();

                    return Ok(new { data = latestSfl });

                case "dfl_latest":
                    if (well == null)
                        return BadRequest("well parameter is required");

                    var filter_dfl = Builders<Sonolog>.Filter.And(
                        Builders<Sonolog>.Filter.In(x => x.well, well),
                        Builders<Sonolog>.Filter.Ne(x => x.dfl, null)
                    );

                    var latestDfl = _sonolog
                        .Find(filter_dfl)
                        .SortByDescending(x => x.date)
                        .FirstOrDefault();

                    return Ok(new { data = latestDfl });
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
                        // thp = s.ds_whp,
                        sm = s.sm,
                        thp = s.ds_whp,
                        size = s.ds_size,
                        efficiency = s.ds_efficiency,
                        chp = s.ds_casing

                    });

                    return Ok(new { data = daily_chart });
                case "quadrant_chart":
                    // average sm and wc per well & date
                    var quadrant_data = _daily.Find(
                        r => r.date >= date && r.date <= end_date
                    ).Project<Daily>(_fields_daily).ToList();

                    // Group by well and date, then calculate average sm and wc
                    var quadrant_chart = quadrant_data
                        .GroupBy(s => new
                        {
                            well = s.well,
                            date = s.date.HasValue ? s.date.Value.Date : DateTime.MinValue
                        })
                        .Select(g => new
                        {
                            date = TimeZoneInfo.ConvertTimeFromUtc(g.Key.date, TimeZoneInfo.Local),
                            well = g.Key.well,
                            avg_sm = g.Where(x => x.sm.HasValue).Any() ? g.Where(x => x.sm.HasValue).Average(x => x.sm.Value) : 0,
                            avg_ds_efficiency = g.Where(x => x.ds_efficiency.HasValue).Any() ? g.Where(x => x.ds_efficiency.HasValue).Average(x => x.ds_efficiency.Value) : 0
                        })
                        .OrderBy(t => t.date)
                        .ThenBy(t => t.well);

                    return Ok(new { data = quadrant_chart });
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
                ws.Cells[5 + i, 6].Value = t.zone != null ? String.Join(", ", t.zone) : null;
                ws.Cells[5 + i, 7].Value = t.interval != null ? String.Join(", ", t.interval.Select(d => String.Join(" - ", d)).ToArray()) : null;
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
                ws.Cells[5 + i, 41].Value = t.noted;
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
        [DisableRequestSizeLimit]
        [RequestFormLimits(MultipartBodyLengthLimit = long.MaxValue)]
        public async Task<IActionResult> Post(List<IFormFile> files)
        {
            if (files == null || files.Count == 0)
                return BadRequest("No file uploaded");

            var tempDir = Path.Combine(Directory.GetCurrentDirectory(), "temp");
            Directory.CreateDirectory(tempDir);
            var filePath = Path.Combine(tempDir, Guid.NewGuid() + Path.GetExtension(files[0].FileName));

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await files[0].CopyToAsync(stream);
            }

            // BUAT TMP DULU
            DailyTmp tmp = new DailyTmp
            {
                status = "processing",
                error_count = 0,
                items = Array.Empty<Daily>(),
                message = "Processing started",
                upload_date = DateTime.Now
            };

            _daily_tmp.InsertOne(tmp);

            // Queue background task - ini akan dijalankan oleh QueuedHostedService
            // yang tidak tergantung pada request lifecycle
            _taskQueue.QueueBackgroundWorkItem(async token =>
            {
                try
                {
                    await Task.Run(() => ProcessExcel(filePath, tmp._id), token);
                }
                catch (Exception ex)
                {
                    DailyCommon._daily_tmp.UpdateOne(
                        t => t._id == tmp._id,
                        Builders<DailyTmp>.Update
                            .Set(t => t.status, "failed")
                            .Set(t => t.message, ex.Message)
                    );
                }
            });

            return Ok(new
            {
                _id = tmp._id,
                status = "processing",
                message = "File uploaded. Processing in background."
            });
        }

        // Endpoint untuk cek status upload
        [Authorize("PeDaily Add")]
        [HttpGet("UploadStatus")]
        public ActionResult GetUploadStatus(string _id)
        {
            try
            {
                // MongoDB tidak boleh campur Include dan Exclude dalam satu projection.
                // Gunakan pure Exclude saja — field lain otomatis ikut semua.
                var projection = Builders<DailyTmp>.Projection
                    .Exclude(t => t.items);

                var tmp = _daily_tmp.Find(t => t._id == _id)
                    .Project<DailyTmp>(projection)
                    .FirstOrDefault();

                if (tmp == null)
                {
                    return NotFound(new { message = "Upload not found" });
                }

                return Ok(new
                {
                    _id = tmp._id,
                    status = tmp.status,
                    message = tmp.message,
                    error_count = tmp.error_count,
                    item_count = tmp.item_count,
                    upload_date = tmp.upload_date
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        private void ProcessExcel(string filePath, string tmpId)
        {
            var fi = new FileInfo(filePath);
            var workbook = new ExcelPackage(fi);
            var ws = workbook.Workbook.Worksheets.First();
            int rowCount = ws.Dimension.End.Row;

            // Pre-scan: collect all dates and wells from the sheet first
            var scannedDates = new List<DateTime?>();
            var scannedWells = new List<string>();
            for (var r = 4; r <= rowCount; r++)
            {
                if (!string.IsNullOrWhiteSpace(ws.Cells[r, 1].Value?.ToString()))
                {
                    try
                    {
                        DateTime? d = null;
                        if (ws.Cells[r, 1].Value.GetType() == DateTime.Now.GetType())
                            d = (DateTime?)ws.Cells[r, 1].Value;
                        else
                            d = DateTime.FromOADate(double.Parse(ws.Cells[r, 1].Value?.ToString().Trim()));
                        scannedDates.Add(d);
                    }
                    catch { }

                    var well = ws.Cells[r, 4].Value?.ToString().Trim();
                    if (!string.IsNullOrWhiteSpace(well))
                        scannedWells.Add(well);
                }
            }

            // Pre-load existing date+well keys in ONE query instead of N queries
            HashSet<string> existingKeys = new HashSet<string>();
            if (scannedDates.Count > 0)
            {
                var minDate = scannedDates.Where(d => d.HasValue).Select(d => d.Value).DefaultIfEmpty().Min();
                var maxDate = scannedDates.Where(d => d.HasValue).Select(d => d.Value).DefaultIfEmpty().Max();
                // Pure exclude: hindari mix include+exclude yang error di MongoDB versi lama
                var existingProjection = Builders<Daily>.Projection
                    .Exclude("items")
                    .Exclude("_error")
                    .Exclude("zone")
                    .Exclude("interval");
                var existingDocs = DailyCommon._daily
                    .Find(t => t.date >= minDate && t.date <= maxDate)
                    .Project<Daily>(existingProjection)
                    .ToList();
                existingKeys = new HashSet<string>(
                    existingDocs
                        .Where(d => d.date.HasValue && d.well != null)
                        .Select(d => $"{d.date.Value:yyyy-MM-dd}_{d.well}")
                );
            }

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
                        var existingKey = $"{_row.date.Value:yyyy-MM-dd}_{_row.well}";
                        if (existingKeys.Contains(existingKey))
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

            // Gunakan DailyCommon._daily_tmp karena ini dijalankan di background thread
            // Gunakan string field name untuk item_count agar kompatibel dengan MongoDB driver versi lama
            DailyCommon._daily_tmp.UpdateOne(
                t => t._id == tmpId,
                Builders<DailyTmp>.Update
                    .Set(t => t.items, items.ToArray())
                    .Set("item_count", items.Count)
                    .Set(t => t.error_count, error_count)
                    .Set(t => t.status, "done")
                    .Set(t => t.message, "Processing completed")
            );

            System.IO.File.Delete(filePath);

        }


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

        //     List<Daily> items = new List<Daily>();
        //     int error_count = 0;

        //     for (var r = 4; r <= rowCount; r++)
        //     {
        //         if (!string.IsNullOrWhiteSpace(ws.Cells[r, 1].Value?.ToString()))
        //         {
        //             Daily _row = new Daily();
        //             DailyError _row_error = new DailyError();
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

        //             if (!String.IsNullOrWhiteSpace(ws.Cells[r, 40].Value?.ToString()))
        //             {
        //                 try
        //                 {
        //                     var cellValue = ws.Cells[r, 40].Value;
        //                     DateTime parsedDate;

        //                     if (cellValue is DateTime dt)
        //                     {
        //                         parsedDate = dt;
        //                     }
        //                     else if (cellValue is double dbl)
        //                     {
        //                         parsedDate = DateTime.FromOADate(dbl);
        //                     }
        //                     else
        //                     {
        //                         var strValue = cellValue.ToString().Trim();
        //                         if (DateTime.TryParse(strValue, out parsedDate))
        //                         {
        //                             // parsedDate is set
        //                         }
        //                         else if (double.TryParse(strValue, out dbl))
        //                         {
        //                             parsedDate = DateTime.FromOADate(dbl);
        //                         }
        //                         else
        //                         {
        //                             throw new Exception("Unable to parse date value: " + strValue);
        //                         }
        //                     }

        //                     _row.ds_tgl_pengujian = parsedDate;
        //                 }
        //                 catch (Exception e)
        //                 {
        //                     _row_error.ds_tgl_pengujian = new ErrorItem { value = ws.Cells[r, 40].Value?.ToString(), message = e.Message };
        //                     error_count++;
        //                 }
        //             }
        //             else
        //             {
        //                 _row_error.ds_tgl_pengujian = null;
        //             }

        //             // Define mappings for string properties with their corresponding column indexes
        //             // strings
        //             var stringMappings = new[]
        //             {
        //                 new { key = "location", col = 3, required = true, errorMsg = "Blank location name is not allowed" },
        //                 new { key = "well", col = 4, required = true, errorMsg = "Blank Well String name is not allowed" },
        //                 new { key = "well_string", col = 5, required = false, errorMsg = "" },
        //                 new { key = "ls_method", col = 24, required = false, errorMsg = "" },
        //                 new { key = "ls_brandtype", col = 25, required = false, errorMsg = "" },
        //                 new { key = "ls_prime_mover", col = 26, required = false, errorMsg = "" },
        //                 new { key = "ls_hp", col = 27, required = false, errorMsg = "" },
        //                 // new { key = "ds_tgl_pengujian", col = 40, required = false, errorMsg = "" },
        //                 new { key = "noted", col = 41, required = false, errorMsg = "" },
        //             };

        //             foreach (var mapping in stringMappings)
        //             {
        //                 var rawValue = ws.Cells[r, mapping.col].Value;
        //                 var strValue = rawValue?.ToString().Trim();

        //                 var prop = typeof(Daily).GetProperty(mapping.key);
        //                 var errorProp = typeof(DailyError).GetProperty(mapping.key);

        //                 if (!string.IsNullOrWhiteSpace(strValue))
        //                 {
        //                     prop?.SetValue(_row, strValue);
        //                 }
        //                 else
        //                 {
        //                     if (mapping.required)
        //                     {
        //                         errorProp?.SetValue(_row_error, new ErrorItem { value = "(Blank)", message = mapping.errorMsg });
        //                         error_count++;
        //                     }
        //                     prop?.SetValue(_row, null);
        //                 }
        //             }

        //             //try
        //             //{
        //             //    _row.zone = ws.Cells[r, 6].Value?.ToString().Trim().Split(",").Select(z => z.Trim()).ToArray();
        //             //}
        //             //catch (Exception e)
        //             //{
        //             //    _row_error.zone = new ErrorItem { value = ws.Cells[r, 6].Value?.ToString(), message = e.Message };
        //             //    error_count++;
        //             //}

        //             // Define mappings for array properties with their corresponding column indexes, parsing logic, and required flag
        //             var arrayMappings = new[]
        //             {
        //                 new
        //                 {
        //                     key = "zone",
        //                     col = 6,
        //                     required = false,
        //                     errorMsg = "Blank zone is not allowed",
        //                     parse = new Func<string, object>(val => val.Split(",").Select(z => z.Trim()).ToArray())
        //                 },
        //                 new
        //                 {
        //                     key = "interval",
        //                     col = 7,
        //                     required = false,
        //                     errorMsg = "Blank interval is not allowed",
        //                     parse = new Func<string, object>(val => val.Split(",").Select(i => i.Trim().Split("-").Select(j => decimal.Parse(j.Trim())).ToArray()).ToArray())
        //                 }
        //             };

        //             foreach (var mapping in arrayMappings)
        //             {
        //                 var rawValue = ws.Cells[r, mapping.col].Value;
        //                 var strValue = rawValue?.ToString().Trim();

        //                 var prop = typeof(Daily).GetProperty(mapping.key);
        //                 var errorProp = typeof(DailyError).GetProperty(mapping.key);

        //                 if (!string.IsNullOrWhiteSpace(strValue))
        //                 {
        //                     try
        //                     {
        //                         var parsedValue = mapping.parse(strValue);
        //                         prop?.SetValue(_row, parsedValue);
        //                     }
        //                     catch (Exception e)
        //                     {
        //                         errorProp?.SetValue(_row_error, new ErrorItem { value = strValue, message = e.Message });
        //                         error_count++;
        //                     }
        //                 }
        //                 else
        //                 {
        //                     if (mapping.required)
        //                     {
        //                         errorProp?.SetValue(_row_error, new ErrorItem { value = "(Blank)", message = mapping.errorMsg });
        //                         error_count++;
        //                     }
        //                     prop?.SetValue(_row, null);
        //                 }
        //             }


        //             // decimal mappings
        //             // Column indexes based on the provided Excel structure
        //             var mappings = new[]
        //             {
        //                 new { key = "nomor", col = 2 },
        //                 new { key = "potensi_prod_gross", col = 8 },
        //                 new { key = "potensi_prod_net", col = 9 },
        //                 new { key = "tes_prod_gross", col = 10 },
        //                 new { key = "tes_prod_net", col = 11 },
        //                 new { key = "fig_last_gross", col = 12 },
        //                 new { key = "fig_last_net", col = 13 },
        //                 new { key = "fig_curr_gross", col = 14 },
        //                 new { key = "fig_curr_net", col = 15 },
        //                 new { key = "thp_last_fig", col = 16 },
        //                 new { key = "thp_potensi", col = 17 },
        //                 new { key = "wc", col = 18 },
        //                 new { key = "prod_hours", col = 19 },
        //                 new { key = "wor", col = 20 },
        //                 new { key = "gas", col = 21 },
        //                 new { key = "gor", col = 22 },
        //                 new { key = "glr", col = 23 },
        //                 new { key = "ds_bean", col = 28 },
        //                 new { key = "ds_whp", col = 29 },
        //                 new { key = "ds_fl", col = 30 },
        //                 new { key = "ds_casing", col = 31 },
        //                 new { key = "ds_separator", col = 32 },
        //                 new { key = "ds_spm", col = 33 },
        //                 new { key = "ds_size", col = 34 },
        //                 new { key = "ds_pump_displace", col = 35 },
        //                 new { key = "ds_efficiency", col = 36 },
        //                 new { key = "ds_sl", col = 37 },
        //                 new { key = "ds_kd", col = 38 },
        //                 new { key = "sm", col = 39 },
        //             };

        //             foreach (var mapping in mappings)
        //             {
        //                 var rawValue = ws.Cells[r, mapping.col].Value;
        //                 var strValue = rawValue?.ToString().Trim();

        //                 if (!string.IsNullOrEmpty(strValue))
        //                 {
        //                     string valueToParse = strValue;
        //                     // if the column is "wc", handle percentage and fraction cases
        //                     if (mapping.key == "wc" || mapping.key == "ds_efficiency")
        //                     {
        //                         // Remove percent sign and whitespace for wc
        //                         valueToParse = valueToParse.Replace("%", "").Trim();
        //                         // If value is less than or equal to 1, assume it's a fraction and convert to percent
        //                         if (decimal.TryParse(valueToParse, out decimal wcNum) && wcNum <= 1)
        //                         {
        //                             wcNum *= 100;
        //                             valueToParse = wcNum.ToString(CultureInfo.InvariantCulture);
        //                         }
        //                     }

        //                     if (decimal.TryParse(valueToParse, out decimal num))
        //                     {
        //                         var prop = typeof(Daily).GetProperty(mapping.key);
        //                         if (prop != null)
        //                             prop.SetValue(_row, num);
        //                     }
        //                     else
        //                     {
        //                         var prop = typeof(Daily).GetProperty(mapping.key);
        //                         if (prop != null)
        //                             prop.SetValue(_row, null);

        //                         var errorProp = typeof(DailyError).GetProperty(mapping.key);
        //                         if (errorProp != null)
        //                             errorProp.SetValue(_row_error, new ErrorItem { value = strValue, message = "Invalid number" });

        //                         error_count++;
        //                     }
        //                 }
        //                 else
        //                 {
        //                     var prop = typeof(Daily).GetProperty(mapping.key);
        //                     if (prop != null)
        //                         prop.SetValue(_row, null);
        //                 }
        //             }
        //             // ...existing code...


        //             if (_row_error.date == null && _row_error.well == null)
        //             {
        //                 if (_daily.Find(t => t.date == _row.date && t.well == _row.well).CountDocuments() > 0)
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

        //     DailyTmp _tmp = new DailyTmp

        //     {
        //         error_count = error_count,
        //         items = items.ToArray()
        //     };
        //     _daily_tmp.InsertOne(_tmp);

        //     return Ok(new
        //     {
        //         _id = _tmp._id,
        //         //items = items,
        //         error_count = error_count
        //     });
        // }

        [Authorize("PeDaily Add")]
        [HttpGet("Tmp")]
        public ActionResult GetTmp(string _id, String sort = "date", String order = "desc", int page = 0, int pagesize = 50, String filter = "", String columnfilter = "", string mode = "")
        {
            DailyTmp _tmp = _daily_tmp.Find(t => t._id == _id).FirstOrDefault();
            if (_tmp == null)
            {
                return NotFound(new { message = "Upload data not found" });
            }
            List<Daily> _tmpitems = _tmp.items != null ? _tmp.items.ToList() : new List<Daily>();
            if (mode == "error")
            {
                _tmpitems = _tmpitems.Where(r => r._error._row?.value == "error").ToList();
            }
            else if (mode == "warning")
            {
                _tmpitems = _tmpitems.Where(r => r._error._row?.value == "warning").OrderByDescending(r => r._error != null).ToList();
            }
            else
            {
                _tmpitems = _tmpitems
                .OrderByDescending(r => r._error._row?.value == "error") // error paling atas
                .ThenByDescending(r => r._error._row?.value == "warning") // lanjut warning
                .ThenByDescending(r => r.date) // lalu normal pakai date
                .ToList();
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

                if (_tmp == null)
                {
                    return BadRequest(new { message = "Upload data not found" });
                }

                // Hanya block jika ada error (bukan warning — warning = existing data, tetap bisa disimpan)
                bool hasError = _tmp.items != null && _tmp.items.Any(i => i._error?._row?.value == "error");
                if (hasError)
                {
                    return BadRequest(new { message = "Cannot save data with errors. Please fix errors first." });
                }

                List<Daily> items = _tmp.items != null ? _tmp.items.ToList() : new List<Daily>();
                List<Daily> modified_data = new List<Daily>();
                List<Daily> created_data = new List<Daily>();

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
                var bulkOps = new List<WriteModel<Daily>>();
                foreach (Daily item in items)
                {
                    item._error = null;

                    var filter = Builders<Daily>.Filter.Eq(t => t.date, item.date) &
                                Builders<Daily>.Filter.Eq(t => t.well, item.well) &
                                Builders<Daily>.Filter.Eq(t => t.interval, item.interval);
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

                    // UpdateResult res = _daily.UpdateOne(
                    //     Builders<Daily>.Filter.Eq(t => t.date, item.date) &
                    //     Builders<Daily>.Filter.Eq(t => t.well, item.well) &
                    //     Builders<Daily>.Filter.Eq(t => t.interval, item.interval),
                    //     update, new UpdateOptions() { IsUpsert = true });

                    // if (res.ModifiedCount > 0)
                    // {
                    //     modified_data.Add(item);
                    // }
                    // else if (res.UpsertedId != null)
                    // {
                    //     created_data.Add(item);
                    // }

                    bulkOps.Add(new UpdateOneModel<Daily>(filter, update) { IsUpsert = true });


                }
                BulkWriteResult bulkResult = _daily.BulkWrite(bulkOps);
                modified_count = bulkResult.ModifiedCount;
                created_count = bulkResult.Upserts.Count;
                _daily_tmp.DeleteOne(d => d._id == _id);

                //CalculateFigure();

                return Ok(new
                {
                    modified_count = modified_count,
                    created_count = created_count,
                    total_count = items.Count(),
                    modified_data = modified_data,
                    created_data = created_data,
                    figure = figure
                });
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message });
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
        [HttpGet("delta")]
        public IActionResult GetDailyDelta(
            DateTime? startDate,
            DateTime? endDate,
            int page = 0,
            int pagesize = 50,
            string sort = "well",
            string order = "asc",
            string mode = "",
            string columnfilter = "",
            string groupBy = "well",

            string aggregateMode = "",
            DateTime? period1Start = null,
            DateTime? period1End = null,
            DateTime? period2Start = null,
            DateTime? period2End = null


        )
        {

            if (!startDate.HasValue || !endDate.HasValue)
            {
                return Ok(new
                {
                    items = new List<object>(),
                    total_count = 0,
                    message = "No date selected"
                });
            }

            //mode Excel untuk export data
            if (mode == "excel")
            {
                // Fallback: kalau period1/period2 tidak dikirim (request lama),
                // pakai startDate/endDate untuk kedua-duanya supaya tidak error.
                var p1Start = period1Start ?? startDate;
                var p1End = period1End ?? endDate;
                var p2Start = period2Start ?? startDate;
                var p2End = period2End ?? endDate;

                if (!p1Start.HasValue || !p1End.HasValue || !p2Start.HasValue || !p2End.HasValue)
                {
                    return BadRequest(new { message = "Date range is required for export." });
                }

                string normalizedGroupBy = (groupBy == "station") ? "station" : "well";

                FilterDefinition<Daily> excelfilter = BuildColumnFilter(columnfilter);

                var period1Items = GetAggregatedData(p1Start.Value, p1End.Value, excelfilter, normalizedGroupBy);
                var period2Items = GetAggregatedData(p2Start.Value, p2End.Value, excelfilter, normalizedGroupBy);

                var mergedRows = MergeAggregateRows(period1Items, period2Items, normalizedGroupBy);

                var period1Label = FormatPeriodLabel(aggregateMode, p1Start.Value, p1End.Value);
                var period2Label = FormatPeriodLabel(aggregateMode, p2Start.Value, p2End.Value);

                var fileBytes = BuildAggregateExcel(mergedRows, normalizedGroupBy, period1Label, period2Label);

                var fileName = $"{(string.IsNullOrEmpty(aggregateMode) ? "Aggregate" : aggregateMode)}_{DateTime.Now:yyyyMMdd_HHmmss}.xlsx";

                return File(
                    fileBytes,
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    fileName
                );
            }


            var todayDate = endDate.Value.ToUniversalTime().Date;
            var yesterdayDate = startDate.Value.ToUniversalTime().Date;

            string baseMode = mode ?? "";
            if (baseMode.EndsWith("_period1")) { baseMode = baseMode.Substring(0, baseMode.Length - "_period1".Length); }
            else if (baseMode.EndsWith("_period2")) { baseMode = baseMode.Substring(0, baseMode.Length - "_period2".Length); }

            bool isAverageMode =
                baseMode == "weekly_average" ||
                baseMode == "monthly_average" ||
                baseMode == "daily_average" ||
                baseMode == "annual_average";

            // Normalisasi groupBy — hanya terima "well" atau "station", selain itu fallback ke "well"
            groupBy = (groupBy == "station") ? "station" : "well";

            System.Diagnostics.Debug.WriteLine($"=== GetDailyDelta DEBUG ===");
            System.Diagnostics.Debug.WriteLine($"startDate: {startDate:yyyy-MM-dd HH:mm:ss}");
            System.Diagnostics.Debug.WriteLine($"endDate: {endDate:yyyy-MM-dd HH:mm:ss}");
            System.Diagnostics.Debug.WriteLine($"mode (raw): {mode}, baseMode: {baseMode}, isAverageMode: {isAverageMode}");
            System.Diagnostics.Debug.WriteLine($"groupBy: {groupBy}");
            System.Diagnostics.Debug.WriteLine($"columnfilter: {columnfilter}");

            // xfilter 
            FilterDefinition<Daily> xfilter = Builders<Daily>.Filter.Empty;

            if (!string.IsNullOrWhiteSpace(columnfilter))
            {
                try
                {
                    dynamic colfilter = Newtonsoft.Json.JsonConvert.DeserializeObject<dynamic>(columnfilter);

                    if (colfilter?.well != null)
                    {
                        var jarr = colfilter.well as Newtonsoft.Json.Linq.JArray;
                        if (jarr != null && jarr.Count > 0)
                        {
                            var wells = jarr
                                .Where(x => !(x is Newtonsoft.Json.Linq.JObject))
                                .Select(x => x.ToString())
                                .ToList();

                            if (wells.Any())
                            {
                                var regexFilters = wells
                                    .Select(w => Builders<Daily>.Filter.Regex(d => d.well, new MongoDB.Bson.BsonRegularExpression(w, "i")))
                                    .ToList();
                                xfilter = Builders<Daily>.Filter.Or(regexFilters);
                            }
                        }
                    }

                    if (colfilter?.well_string != null)
                    {
                        var jarr = colfilter.well_string as Newtonsoft.Json.Linq.JArray;
                        if (jarr != null && jarr.Count > 0)
                        {
                            var wellStrings = jarr
                                .Where(x => !(x is Newtonsoft.Json.Linq.JObject))
                                .Select(x => x.ToString())
                                .ToList();

                            if (wellStrings.Any())
                            {
                                var regexFilters = wellStrings
                                    .Select(w => Builders<Daily>.Filter.Regex(d => d.well_string, new MongoDB.Bson.BsonRegularExpression(w, "i")))
                                    .ToList();
                                xfilter = xfilter & Builders<Daily>.Filter.Or(regexFilters);
                            }
                        }
                    }

                    // filter station
                    if (colfilter?.station != null)
                    {
                        var jarr = colfilter.station as Newtonsoft.Json.Linq.JArray;
                        if (jarr != null && jarr.Count > 0)
                        {
                            var stations = jarr
                                .Where(x => !(x is Newtonsoft.Json.Linq.JObject))
                                .Select(x => x.ToString())
                                .ToList();

                            if (stations.Any())
                            {
                                var regexFilters = stations
                                    .Select(w => Builders<Daily>.Filter.Regex(d => d.station, new MongoDB.Bson.BsonRegularExpression(w, "i")))
                                    .ToList();
                                xfilter = xfilter & Builders<Daily>.Filter.Or(regexFilters);
                            }
                        }
                    }
                }
                catch
                {
                }
            }

            // untuk dropdown xfilter
            if (!string.IsNullOrEmpty(mode) && mode != "excel" && mode != "delta" && !isAverageMode)
            {
                switch (mode)
                {
                    case "well":
                        var wells = _daily.Distinct<string>("well", xfilter)
                            .ToEnumerable().OrderBy(t => t).ToList();
                        return Ok(new { items = wells });
                    case "well_string":
                        var wellStrings = _daily.Distinct<string>("well_string", xfilter)
                            .ToEnumerable().Where(t => !string.IsNullOrEmpty(t)).OrderBy(t => t).ToList();
                        return Ok(new { items = wellStrings });
                    case "station":
                        var stations = _daily.Distinct<string>("station", xfilter)
                            .ToEnumerable().Where(t => !string.IsNullOrEmpty(t)).OrderBy(t => t).ToList();
                        return Ok(new { items = stations });
                    case "date":
                        var dates = _daily.Distinct<DateTime?>("date", xfilter)
                            .ToEnumerable().OrderByDescending(t => t).ToList();
                        return Ok(new { items = dates });
                    case "location":
                        var locations = _daily.Distinct<string>("location", xfilter)
                            .ToEnumerable().OrderBy(t => t).ToList();
                        return Ok(new { items = locations });
                    case "gas":
                        var gas = _daily.Distinct<decimal?>("gas", xfilter).ToEnumerable().Select(t => t * 1000).OrderBy(t => t).ToList();
                        return Ok(new { items = gas });
                    default:
                        return Ok(new { items = new List<string>() });
                }
            }

            var mongoFilter = Builders<Daily>.Filter.And(
                xfilter,
                Builders<Daily>.Filter.Gte(d => d.date, yesterdayDate),
                Builders<Daily>.Filter.Lt(d => d.date, todayDate.AddDays(1))
            );

            System.Diagnostics.Debug.WriteLine($"MongoDB Filter: {mongoFilter}");
            System.Diagnostics.Debug.WriteLine($"Query will fetch records where date >= {yesterdayDate:yyyy-MM-dd} and date < {todayDate.AddDays(1):yyyy-MM-dd}");

            var rawData = _daily
                .Find(mongoFilter)
                .SortByDescending(d => d.date)
                .ToList();

            System.Diagnostics.Debug.WriteLine($"rawData count: {rawData.Count}");

            List<dynamic> result;

            if (isAverageMode)
            {
                if (groupBy == "station")
                {
                    result = rawData
                        .Where(x => x.date.HasValue && !string.IsNullOrEmpty(x.station))
                        .GroupBy(x => x.station)
                        .Select(g =>
                        {
                            return new
                            {
                                well = (string)null,
                                well_string = (string)null,
                                station = g.Key,
                                location = g.FirstOrDefault()?.location,

                                fig_curr_gross = g.Where(x => x.fig_curr_gross.HasValue).Any()
                                    ? g.Where(x => x.fig_curr_gross.HasValue).Sum(x => x.fig_curr_gross)
                                    : 0m,
                                fig_curr_net = g.Where(x => x.fig_curr_net.HasValue).Any()
                                    ? g.Where(x => x.fig_curr_net.HasValue).Sum(x => x.fig_curr_net)
                                    : 0m,
                                wc = g.Where(x => x.wc.HasValue).Any()
                                    ? g.Where(x => x.wc.HasValue).Average(x => x.wc)
                                    : 0m,
                                gas = g.Where(x => x.gas.HasValue).Any()
                                    ? g.Where(x => x.gas.HasValue).Sum(x => x.gas)
                                    : 0m,
                                ds_efficiency = g.Where(x => x.ds_efficiency.HasValue).Any()
                                    ? g.Where(x => x.ds_efficiency.HasValue).Average(x => x.ds_efficiency)
                                    : 0m,
                                sm = g.Where(x => x.sm.HasValue).Any()
                                    ? g.Where(x => x.sm.HasValue).Average(x => x.sm)
                                    : 0m,
                            };
                        })
                        .Where(x => x != null)
                        .Cast<dynamic>()
                        .ToList();
                }
                else
                {
                    // GROUP BY WELL 
                    result = rawData
                        .Where(x => x.date.HasValue)
                        .GroupBy(x => new { x.well, x.well_string })
                        .Select(g =>
                        {
                            var latestDate = g.Where(x => x.date.HasValue)
                                .OrderByDescending(x => x.date)
                                .FirstOrDefault()?.date;

                            return new
                            {
                                well = g.Key.well,
                                well_string = g.Key.well_string,
                                station = g.FirstOrDefault()?.station,
                                location = g.FirstOrDefault()?.location,
                                latest_date = latestDate,

                                //merata-ratakan
                                fig_curr_gross = g.Where(x => x.fig_curr_gross.HasValue).Any()
                                    ? g.Where(x => x.fig_curr_gross.HasValue).Average(x => x.fig_curr_gross)
                                    : 0m,
                                fig_curr_net = g.Where(x => x.fig_curr_net.HasValue).Any()
                                    ? g.Where(x => x.fig_curr_net.HasValue).Average(x => x.fig_curr_net)
                                    : 0m,
                                wc = g.Where(x => x.wc.HasValue).Any()
                                    ? g.Where(x => x.wc.HasValue).Average(x => x.wc)
                                    : 0m,
                                gas = g.Where(x => x.gas.HasValue).Any()
                                    ? g.Where(x => x.gas.HasValue).Average(x => x.gas)
                                    : 0m,
                                ds_efficiency = g.Where(x => x.ds_efficiency.HasValue).Any()
                                    ? g.Where(x => x.ds_efficiency.HasValue).Average(x => x.ds_efficiency)
                                    : 0m,
                                sm = g.Where(x => x.sm.HasValue).Any()
                                    ? g.Where(x => x.sm.HasValue).Average(x => x.sm)
                                    : 0m,
                            };
                        })
                        .Where(x => x != null)
                        .Cast<dynamic>()
                        .ToList();
                }
            }
            else
            {
                // Delta mode
                result = rawData
                    .Where(x => x.date.HasValue)
                    .GroupBy(x => new { x.well, x.well_string })
                    .Select(g =>
                    {
                        var ordered = g.OrderByDescending(x => x.date).ToList();

                        var today = ordered
                            .Where(x => x.date.Value.Date == todayDate)
                            .OrderByDescending(x => x.fig_curr_gross)
                            .FirstOrDefault();

                        var yesterday = ordered
                            .Where(x => x.date.Value.Date == yesterdayDate)
                            .OrderByDescending(x => x.fig_curr_gross)
                            .FirstOrDefault();

                        if (today == null && yesterday == null) { return null; }

                        var reference = today ?? yesterday;

                        return new
                        {
                            well = reference.well,
                            well_string = reference.well_string,
                            station = reference.station,
                            location = reference.location,

                            fig_curr_gross_today = today?.fig_curr_gross,
                            fig_curr_gross_prev = yesterday?.fig_curr_gross,
                            delta_fig_curr_gross = (today?.fig_curr_gross ?? 0) - (yesterday?.fig_curr_gross ?? 0),

                            fig_curr_net_today = today?.fig_curr_net,
                            fig_curr_net_prev = yesterday?.fig_curr_net,
                            delta_fig_curr_net = (today?.fig_curr_net ?? 0) - (yesterday?.fig_curr_net ?? 0),

                            wc_today = today?.wc,
                            wc_prev = yesterday?.wc,
                            delta_wc = (today?.wc ?? 0) - (yesterday?.wc ?? 0),

                            gas_today = today?.gas,
                            gas_prev = yesterday?.gas,
                            delta_gas = (today?.gas ?? 0) - (yesterday?.gas ?? 0),

                            sm_today = today?.sm,
                            sm_prev = yesterday?.sm,
                            delta_sm = (today?.sm ?? 0) - (yesterday?.sm ?? 0),

                            ds_efficiency_today = today?.ds_efficiency,
                            ds_efficiency_prev = yesterday?.ds_efficiency,
                            delta_ds_efficiency = (today?.ds_efficiency ?? 0) - (yesterday?.ds_efficiency ?? 0)
                        };
                    })
                    .Where(x => x != null)
                    .Cast<dynamic>()
                    .ToList();
            }

            bool isDesc = order == "desc";

            switch (sort?.ToLower())
            {
                case "well":
                    result = isDesc
                        ? result.OrderByDescending(x => x.well).ToList()
                        : result.OrderBy(x => x.well).ToList();
                    break;
                case "well_string":
                    result = isDesc
                        ? result.OrderByDescending(x => x.well_string).ToList()
                        : result.OrderBy(x => x.well_string).ToList();
                    break;
                case "station":
                    result = isDesc
                        ? result.OrderByDescending(x => x.station).ToList()
                        : result.OrderBy(x => x.station).ToList();
                    break;
                case "location":
                    result = isDesc
                        ? result.OrderByDescending(x => x.location).ToList()
                        : result.OrderBy(x => x.location).ToList();
                    break;

                case "fig_curr_gross":
                case "fig_curr_gross_today":
                    if (!isAverageMode)
                    {
                        result = isDesc
                            ? result.OrderByDescending(x => x.fig_curr_gross_today).ToList()
                            : result.OrderBy(x => x.fig_curr_gross_today).ToList();
                    }
                    else
                    {
                        result = isDesc
                            ? result.OrderByDescending(x => x.fig_curr_gross).ToList()
                            : result.OrderBy(x => x.fig_curr_gross).ToList();
                    }
                    break;

                case "fig_curr_gross_prev":
                    if (!isAverageMode)
                    {
                        result = isDesc
                            ? result.OrderByDescending(x => x.fig_curr_gross_prev).ToList()
                            : result.OrderBy(x => x.fig_curr_gross_prev).ToList();
                    }
                    break;

                case "delta_fig_curr_gross":
                    if (!isAverageMode)
                    {
                        result = isDesc
                            ? result.OrderByDescending(x => x.delta_fig_curr_gross).ToList()
                            : result.OrderBy(x => x.delta_fig_curr_gross).ToList();
                    }
                    break;

                case "fig_curr_net":
                case "fig_curr_net_today":
                    if (!isAverageMode)
                    {
                        result = isDesc
                            ? result.OrderByDescending(x => x.fig_curr_net_today).ToList()
                            : result.OrderBy(x => x.fig_curr_net_today).ToList();
                    }
                    else
                    {
                        result = isDesc
                            ? result.OrderByDescending(x => x.fig_curr_net).ToList()
                            : result.OrderBy(x => x.fig_curr_net).ToList();
                    }
                    break;

                case "fig_curr_net_prev":
                    if (!isAverageMode)
                    {
                        result = isDesc
                            ? result.OrderByDescending(x => x.fig_curr_net_prev).ToList()
                            : result.OrderBy(x => x.fig_curr_net_prev).ToList();
                    }
                    break;

                case "delta_fig_curr_net":
                    if (!isAverageMode)
                    {
                        result = isDesc
                            ? result.OrderByDescending(x => x.delta_fig_curr_net).ToList()
                            : result.OrderBy(x => x.delta_fig_curr_net).ToList();
                    }
                    break;

                case "wc":
                case "wc_today":
                    if (!isAverageMode)
                    {
                        result = isDesc
                            ? result.OrderByDescending(x => x.wc_today).ToList()
                            : result.OrderBy(x => x.wc_today).ToList();
                    }
                    else
                    {
                        result = isDesc
                            ? result.OrderByDescending(x => x.wc).ToList()
                            : result.OrderBy(x => x.wc).ToList();
                    }
                    break;

                case "wc_prev":
                    if (!isAverageMode)
                    {
                        result = isDesc
                            ? result.OrderByDescending(x => x.wc_prev).ToList()
                            : result.OrderBy(x => x.wc_prev).ToList();
                    }
                    break;

                case "delta_wc":
                    if (!isAverageMode)
                    {
                        result = isDesc
                            ? result.OrderByDescending(x => x.delta_wc).ToList()
                            : result.OrderBy(x => x.delta_wc).ToList();
                    }
                    break;

                case "gas":
                case "gas_today":
                    if (!isAverageMode)
                    {
                        result = isDesc
                            ? result.OrderByDescending(x => x.gas_today).ToList()
                            : result.OrderBy(x => x.gas_today).ToList();
                    }
                    else
                    {
                        result = isDesc
                            ? result.OrderByDescending(x => x.gas).ToList()
                            : result.OrderBy(x => x.gas).ToList();
                    }
                    break;

                case "gas_prev":
                    if (!isAverageMode)
                    {
                        result = isDesc
                            ? result.OrderByDescending(x => x.gas_prev).ToList()
                            : result.OrderBy(x => x.gas_prev).ToList();
                    }
                    break;

                case "delta_gas":
                    if (!isAverageMode)
                    {
                        result = isDesc
                            ? result.OrderByDescending(x => x.delta_gas).ToList()
                            : result.OrderBy(x => x.delta_gas).ToList();
                    }
                    break;

                case "sm":
                case "sm_today":
                    if (!isAverageMode)
                    {
                        result = isDesc
                            ? result.OrderByDescending(x => x.sm_today).ToList()
                            : result.OrderBy(x => x.sm_today).ToList();
                    }
                    else
                    {
                        result = isDesc
                            ? result.OrderByDescending(x => x.sm).ToList()
                            : result.OrderBy(x => x.sm).ToList();
                    }
                    break;

                case "sm_prev":
                    if (!isAverageMode)
                    {
                        result = isDesc
                            ? result.OrderByDescending(x => x.sm_prev).ToList()
                            : result.OrderBy(x => x.sm_prev).ToList();
                    }
                    break;

                case "delta_sm":
                    if (!isAverageMode)
                    {
                        result = isDesc
                            ? result.OrderByDescending(x => x.delta_sm).ToList()
                            : result.OrderBy(x => x.delta_sm).ToList();
                    }
                    break;

                case "ds_efficiency":
                case "ds_efficiency_today":
                    if (!isAverageMode)
                    {
                        result = isDesc
                            ? result.OrderByDescending(x => x.ds_efficiency_today).ToList()
                            : result.OrderBy(x => x.ds_efficiency_today).ToList();
                    }
                    else
                    {
                        result = isDesc
                            ? result.OrderByDescending(x => x.ds_efficiency).ToList()
                            : result.OrderBy(x => x.ds_efficiency).ToList();
                    }
                    break;

                case "ds_efficiency_prev":
                    if (!isAverageMode)
                    {
                        result = isDesc
                            ? result.OrderByDescending(x => x.ds_efficiency_prev).ToList()
                            : result.OrderBy(x => x.ds_efficiency_prev).ToList();
                    }
                    break;

                case "delta_ds_efficiency":
                    if (!isAverageMode)
                    {
                        result = isDesc
                            ? result.OrderByDescending(x => x.delta_ds_efficiency).ToList()
                            : result.OrderBy(x => x.delta_ds_efficiency).ToList();
                    }
                    break;

                default:
                    result = isDesc
                        ? result.OrderByDescending(x => x.well).ToList()
                        : result.OrderBy(x => x.well).ToList();
                    break;
            }

            var totalCount = result.Count;

            System.Diagnostics.Debug.WriteLine($"result count after processing: {totalCount}");
            System.Diagnostics.Debug.WriteLine($"baseMode used: {baseMode}, groupBy: {groupBy}");

            var paged = result
                .Skip(page * pagesize)
                .Take(pagesize)
                .ToList();

            return Ok(new
            {
                items = paged,
                total_count = totalCount,
                message = "Success"
            });
        }
        private FilterDefinition<Daily> BuildColumnFilter(string columnfilter)
        {
            FilterDefinition<Daily> xfilter = Builders<Daily>.Filter.Empty;

            if (string.IsNullOrWhiteSpace(columnfilter)) { return xfilter; }

            try
            {
                dynamic colfilter = Newtonsoft.Json.JsonConvert.DeserializeObject<dynamic>(columnfilter);

                if (colfilter?.well != null)
                {
                    var jarr = colfilter.well as Newtonsoft.Json.Linq.JArray;
                    if (jarr != null && jarr.Count > 0)
                    {
                        var wells = jarr.Where(x => !(x is Newtonsoft.Json.Linq.JObject)).Select(x => x.ToString()).ToList();
                        if (wells.Any())
                        {
                            var regexFilters = wells.Select(w => Builders<Daily>.Filter.Regex(d => d.well, new MongoDB.Bson.BsonRegularExpression(w, "i"))).ToList();
                            xfilter = Builders<Daily>.Filter.Or(regexFilters);
                        }
                    }
                }

                if (colfilter?.well_string != null)
                {
                    var jarr = colfilter.well_string as Newtonsoft.Json.Linq.JArray;
                    if (jarr != null && jarr.Count > 0)
                    {
                        var wellStrings = jarr.Where(x => !(x is Newtonsoft.Json.Linq.JObject)).Select(x => x.ToString()).ToList();
                        if (wellStrings.Any())
                        {
                            var regexFilters = wellStrings.Select(w => Builders<Daily>.Filter.Regex(d => d.well_string, new MongoDB.Bson.BsonRegularExpression(w, "i"))).ToList();
                            xfilter = xfilter & Builders<Daily>.Filter.Or(regexFilters);
                        }
                    }
                }

                if (colfilter?.station != null)
                {
                    var jarr = colfilter.station as Newtonsoft.Json.Linq.JArray;
                    if (jarr != null && jarr.Count > 0)
                    {
                        var stations = jarr.Where(x => !(x is Newtonsoft.Json.Linq.JObject)).Select(x => x.ToString()).ToList();
                        if (stations.Any())
                        {
                            var regexFilters = stations.Select(w => Builders<Daily>.Filter.Regex(d => d.station, new MongoDB.Bson.BsonRegularExpression(w, "i"))).ToList();
                            xfilter = xfilter & Builders<Daily>.Filter.Or(regexFilters);
                        }
                    }
                }
            }
            catch { }

            return xfilter;
        }


        private List<dynamic> GetAggregatedData(DateTime startDate, DateTime endDate, FilterDefinition<Daily> xfilter, string groupBy)
        {
            var todayDate = endDate.ToUniversalTime().Date;
            var yesterdayDate = startDate.ToUniversalTime().Date;

            var mongoFilter = Builders<Daily>.Filter.And(
                xfilter,
                Builders<Daily>.Filter.Gte(d => d.date, yesterdayDate),
                Builders<Daily>.Filter.Lt(d => d.date, todayDate.AddDays(1))
            );

            var rawData = _daily.Find(mongoFilter).ToList();

            if (groupBy == "station")
            {
                return rawData
                    .Where(x => x.date.HasValue && !string.IsNullOrEmpty(x.station))
                    .GroupBy(x => x.station)
                    .Select(g => (dynamic)new
                    {
                        well = (string)null,
                        well_string = (string)null,
                        station = g.Key,

                        fig_curr_gross = g.Where(x => x.fig_curr_gross.HasValue).Any() ? g.Where(x => x.fig_curr_gross.HasValue).Sum(x => x.fig_curr_gross) : 0m,
                        fig_curr_net = g.Where(x => x.fig_curr_net.HasValue).Any() ? g.Where(x => x.fig_curr_net.HasValue).Sum(x => x.fig_curr_net) : 0m,
                        wc = g.Where(x => x.wc.HasValue).Any() ? g.Where(x => x.wc.HasValue).Average(x => x.wc) : 0m,
                        gas = g.Where(x => x.gas.HasValue).Any() ? g.Where(x => x.gas.HasValue).Sum(x => x.gas) : 0m,
                        ds_efficiency = g.Where(x => x.ds_efficiency.HasValue).Any() ? g.Where(x => x.ds_efficiency.HasValue).Average(x => x.ds_efficiency) : 0m,
                        sm = g.Where(x => x.sm.HasValue).Any() ? g.Where(x => x.sm.HasValue).Average(x => x.sm) : 0m,
                    })
                    .ToList();
            }
            else
            {
                return rawData
                    .Where(x => x.date.HasValue)
                    .GroupBy(x => new { x.well, x.well_string })
                    .Select(g => (dynamic)new
                    {
                        well = g.Key.well,
                        well_string = g.Key.well_string,
                        station = g.FirstOrDefault()?.station,

                        fig_curr_gross = g.Where(x => x.fig_curr_gross.HasValue).Any() ? g.Where(x => x.fig_curr_gross.HasValue).Average(x => x.fig_curr_gross) : 0m,
                        fig_curr_net = g.Where(x => x.fig_curr_net.HasValue).Any() ? g.Where(x => x.fig_curr_net.HasValue).Average(x => x.fig_curr_net) : 0m,
                        wc = g.Where(x => x.wc.HasValue).Any() ? g.Where(x => x.wc.HasValue).Average(x => x.wc) : 0m,
                        gas = g.Where(x => x.gas.HasValue).Any() ? g.Where(x => x.gas.HasValue).Average(x => x.gas) : 0m,
                        ds_efficiency = g.Where(x => x.ds_efficiency.HasValue).Any() ? g.Where(x => x.ds_efficiency.HasValue).Average(x => x.ds_efficiency) : 0m,
                        sm = g.Where(x => x.sm.HasValue).Any() ? g.Where(x => x.sm.HasValue).Average(x => x.sm) : 0m,
                    })
                    .ToList();
            }
        }

        private List<AggregateExportRow> MergeAggregateRows(List<dynamic> period1Items, List<dynamic> period2Items, string groupBy)
        {
            string MakeKey(dynamic item)
            {
                if (groupBy == "station") { return (string)item.station ?? ""; }
                return $"{item.well ?? ""}||{item.well_string ?? ""}";
            }

            var p1Map = period1Items.ToDictionary(MakeKey, x => x);
            var p2Map = period2Items.ToDictionary(MakeKey, x => x);

            var allKeys = new HashSet<string>(p1Map.Keys.Concat(p2Map.Keys));

            var rows = new List<AggregateExportRow>();

            foreach (var key in allKeys)
            {
                dynamic p1 = p1Map.ContainsKey(key) ? p1Map[key] : null;
                dynamic p2 = p2Map.ContainsKey(key) ? p2Map[key] : null;
                dynamic reference = p2 ?? p1;

                decimal p1Gross = p1 != null ? (decimal)p1.fig_curr_gross : 0m;
                decimal p1Net = p1 != null ? (decimal)p1.fig_curr_net : 0m;
                decimal p1Wc = p1 != null ? (decimal)p1.wc : 0m;
                decimal p1Gas = p1 != null ? (decimal)p1.gas : 0m;
                decimal p1Ds = p1 != null ? (decimal)p1.ds_efficiency : 0m;
                decimal p1Sm = p1 != null ? (decimal)p1.sm : 0m;

                decimal p2Gross = p2 != null ? (decimal)p2.fig_curr_gross : 0m;
                decimal p2Net = p2 != null ? (decimal)p2.fig_curr_net : 0m;
                decimal p2Wc = p2 != null ? (decimal)p2.wc : 0m;
                decimal p2Gas = p2 != null ? (decimal)p2.gas : 0m;
                decimal p2Ds = p2 != null ? (decimal)p2.ds_efficiency : 0m;
                decimal p2Sm = p2 != null ? (decimal)p2.sm : 0m;

                rows.Add(new AggregateExportRow
                {
                    Label = groupBy == "station" ? (string)reference.station : (string)reference.well,
                    WellString = groupBy == "station" ? "" : (string)(reference.well_string ?? ""),

                    P1Gross = p1Gross,
                    P1Net = p1Net,
                    P1Wc = p1Wc,
                    P1Gas = p1Gas,
                    P1Ds = p1Ds,
                    P1Sm = p1Sm,
                    P2Gross = p2Gross,
                    P2Net = p2Net,
                    P2Wc = p2Wc,
                    P2Gas = p2Gas,
                    P2Ds = p2Ds,
                    P2Sm = p2Sm,

                    GainGross = p2Gross - p1Gross,
                    GainNet = p2Net - p1Net,
                    GainWc = p2Wc - p1Wc,
                    GainGas = p2Gas - p1Gas,
                    GainDs = p2Ds - p1Ds,
                    GainSm = p2Sm - p1Sm,
                });
            }

            return rows.OrderBy(r => r.Label).ToList();
        }

        /// Label periode untuk header Excel
        private string FormatPeriodLabel(string aggregateMode, DateTime start, DateTime end)
        {
            switch (aggregateMode)
            {
                case "monthly_average":
                    return start.ToString("MMM-yyyy");
                case "annual_average":
                    return start.Year.ToString();
                case "weekly_average":
                case "daily_average":
                default:
                    return $"{start:MMM d, yyyy} - {end:MMM d, yyyy}";
            }
        }


        /// Bangun file .xlsx pakai EPPlus dari data yang sudah digabung.
        /// Struktur kolom: Well/Station | Period1(6 kolom) | Period2(6 kolom) | Gain/Loss(6 kolom)

        private byte[] BuildAggregateExcel(List<AggregateExportRow> rows, string groupBy, string period1Label, string period2Label)
        {
            // EPPlus 5+/6+/7+ WAJIB baris ini (community/non-commercial use):
            // ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            // (EPPlus 4.x tidak perlu baris ini — hapus kalau pakai versi 4.x)
            // OfficeOpenXml.ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.NonCommercial;

            using (var package = new OfficeOpenXml.ExcelPackage())
            {
                var sheet = package.Workbook.Worksheets.Add("Aggregate");

                string firstColHeader = groupBy == "station" ? "Station" : "Well";
                int col = 1;

                // Baris 1: judul kolom & grup periode
                sheet.Cells[1, col].Value = firstColHeader;
                sheet.Cells[1, col, 2, col].Merge = true; // rowspan 2 baris untuk kolom identitas

                int identityCols = 1;
                if (groupBy != "station")
                {
                    col++;
                    sheet.Cells[1, col].Value = "Well String";
                    sheet.Cells[1, col, 2, col].Merge = true;
                    identityCols = 2;
                }

                int p1StartCol = col + 1;
                sheet.Cells[1, p1StartCol, 1, p1StartCol + 5].Merge = true;
                sheet.Cells[1, p1StartCol].Value = period1Label;

                int p2StartCol = p1StartCol + 6;
                sheet.Cells[1, p2StartCol, 1, p2StartCol + 5].Merge = true;
                sheet.Cells[1, p2StartCol].Value = period2Label;

                int gainStartCol = p2StartCol + 6;
                sheet.Cells[1, gainStartCol, 1, gainStartCol + 5].Merge = true;
                sheet.Cells[1, gainStartCol].Value = "Gain / Loss";

                // Baris 2: sub-header 
                string[] subHeaders = { "Gross", "Net", "WC", "Gas", "DS Eff.", "SM" };
                for (int i = 0; i < 6; i++)
                {
                    sheet.Cells[2, p1StartCol + i].Value = subHeaders[i];
                    sheet.Cells[2, p2StartCol + i].Value = subHeaders[i];
                    sheet.Cells[2, gainStartCol + i].Value = subHeaders[i];
                }

                // ── Styling header ──
                using (var headerRange = sheet.Cells[1, 1, 2, gainStartCol + 5])
                {
                    headerRange.Style.Font.Bold = true;
                    headerRange.Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                    headerRange.Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Center;
                    headerRange.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                    headerRange.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.FromArgb(255, 245, 245));
                    headerRange.Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin, System.Drawing.Color.FromArgb(239, 83, 80));
                }

                // ── Data rows ──
                int rowIdx = 3;
                foreach (var r in rows)
                {
                    int c = 1;
                    sheet.Cells[rowIdx, c].Value = r.Label; c++;

                    if (groupBy != "station")
                    {
                        sheet.Cells[rowIdx, c].Value = r.WellString; c++;
                    }

                    // Period 1
                    sheet.Cells[rowIdx, c].Value = r.P1Gross; c++;
                    sheet.Cells[rowIdx, c].Value = r.P1Net; c++;
                    sheet.Cells[rowIdx, c].Value = r.P1Wc; c++;
                    sheet.Cells[rowIdx, c].Value = r.P1Gas; c++;
                    sheet.Cells[rowIdx, c].Value = r.P1Ds; c++;
                    sheet.Cells[rowIdx, c].Value = r.P1Sm; c++;

                    // Period 2
                    sheet.Cells[rowIdx, c].Value = r.P2Gross; c++;
                    sheet.Cells[rowIdx, c].Value = r.P2Net; c++;
                    sheet.Cells[rowIdx, c].Value = r.P2Wc; c++;
                    sheet.Cells[rowIdx, c].Value = r.P2Gas; c++;
                    sheet.Cells[rowIdx, c].Value = r.P2Ds; c++;
                    sheet.Cells[rowIdx, c].Value = r.P2Sm; c++;

                    // Gain/Loss — dengan warna hijau (naik) / kuning (turun)
                    void WriteGainCell(decimal value)
                    {
                        var cell = sheet.Cells[rowIdx, c];
                        cell.Value = value;
                        if (value > 0)
                        {
                            cell.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                            cell.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.FromArgb(165, 214, 167)); // hijau
                        }
                        else if (value < 0)
                        {
                            cell.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                            cell.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.FromArgb(255, 245, 157)); // kuning
                        }
                        c++;
                    }

                    WriteGainCell(r.GainGross);
                    WriteGainCell(r.GainNet);
                    WriteGainCell(r.GainWc);
                    WriteGainCell(r.GainGas);
                    WriteGainCell(r.GainDs);
                    WriteGainCell(r.GainSm);

                    rowIdx++;
                }

                // Auto-fit lebar kolom
                // sheet.Cells[sheet.Dimension.Address].AutoFitColumns();
                sheet.Column(1).Width = 16;  // Well/Station
                int dataStartCol = groupBy != "station" ? 3 : 2;

                for (int c = dataStartCol; c <= gainStartCol + 5; c++)
                {
                    sheet.Column(c).Width = 12;
                }

                return package.GetAsByteArray();
            }
        }

        /// DTO internal untuk 1 baris hasil merge, dipakai saat build Excel



        [Authorize("PeDaily Read")]
        [HttpGet("optimasi")]
        public IActionResult GetDailyOptimasi(
            // DateTime? date,
            DateTime? startDate,
            DateTime? endDate,
            int page = 0,
            int pagesize = 50,
            string sort = "well",
            string order = "asc",
            string mode = "",
            string columnfilter = ""
        )
        {
            // Jika date tidak dipilih, kembalikan data kosong
            if (!startDate.HasValue || !endDate.HasValue)
            {
                return Ok(new
                {
                    items = new List<object>(),
                    total_count = 0,
                    message = "No date selected"
                });
            }

            var todayDate = endDate.Value.ToUniversalTime().Date;
            var yesterdayDate = startDate.Value.ToUniversalTime().Date;
            // xfilter = filter tambahan dari columnfilter (well, dll)
            FilterDefinition<Daily> xfilter = Builders<Daily>.Filter.Empty;
            if (!string.IsNullOrWhiteSpace(columnfilter))
            {
                try
                {
                    dynamic colfilter = Newtonsoft.Json.JsonConvert.DeserializeObject<dynamic>(columnfilter);

                    // Filter WELL jika ada
                    if (colfilter?.well != null)
                    {
                        var jarr = colfilter.well as Newtonsoft.Json.Linq.JArray;
                        if (jarr != null && jarr.Count > 0)
                        {
                            // Ambil list string well
                            var wells = jarr
                                .Where(x => !(x is Newtonsoft.Json.Linq.JObject))
                                .Select(x => x.ToString())
                                .ToList();

                            if (wells.Any())
                            {
                                // Gunakan Regex OR 
                                var regexFilters = wells
                                    .Select(w =>
                                        Builders<Daily>.Filter.Regex(
                                            d => d.well,
                                            new MongoDB.Bson.BsonRegularExpression(w, "i")
                                        )
                                    )
                                    .ToList();

                                xfilter = Builders<Daily>.Filter.Or(regexFilters);
                            }
                        }
                    }
                }
                catch
                {
                    // Handle error
                }
            }
            if (!string.IsNullOrEmpty(mode) && mode != "excel" && mode != "optimasi" && mode != "optimasi_chart")
            {
                switch (mode)
                {
                    case "well":
                        var wells = _daily.Distinct<string>("well", xfilter)
                            .ToEnumerable().OrderBy(t => t).ToList();
                        return Ok(new { items = wells });
                    default:
                        return Ok(new { items = new List<string>() });
                }
            }

            var mongoFilter = Builders<Daily>.Filter.And(
                xfilter,
                Builders<Daily>.Filter.Gte(d => d.date, yesterdayDate),
                Builders<Daily>.Filter.Lt(d => d.date, todayDate.AddDays(1))
            );

            var rawData = _daily
                .Find(mongoFilter)
                .SortByDescending(d => d.date)
                .ToList();

            // Group by well dan hitung average dari sm, ds_efficiency
            var groupedData = rawData
                .GroupBy(d => d.well)
                .Select(g =>
                {
                    var avgSm = g.Where(x => x.sm.HasValue).Any()
                        ? g.Where(x => x.sm.HasValue).Average(x => x.sm.Value)
                        : 0;

                    var avgEfficiency = g.Where(x => x.ds_efficiency.HasValue).Any()
                        ? g.Where(x => x.ds_efficiency.HasValue).Average(x => x.ds_efficiency.Value)
                        : 0;

                    // Konversi ke percent 
                    if (avgEfficiency > 0 && avgEfficiency < 2)
                    {
                        avgEfficiency *= 100;
                    }
                    return new
                    {
                        well = g.Key,
                        avg_sm = avgSm,
                        avg_ds_efficiency = avgEfficiency,
                        data_count = g.Count()
                    };
                })
                .ToList();

            // Sorting
            if (order == "asc")
            {
                switch (sort)
                {
                    case "well":
                        groupedData = groupedData.OrderBy(x => x.well).ToList();
                        break;
                    case "avg_sm":
                        groupedData = groupedData.OrderBy(x => x.avg_sm).ToList();
                        break;
                    case "avg_ds_efficiency":
                        groupedData = groupedData.OrderBy(x => x.avg_ds_efficiency).ToList();
                        break;
                    default:
                        groupedData = groupedData.OrderBy(x => x.well).ToList();
                        break;
                }
            }
            else
            {
                switch (sort)
                {
                    case "well":
                        groupedData = groupedData.OrderByDescending(x => x.well).ToList();
                        break;
                    case "avg_sm":
                        groupedData = groupedData.OrderByDescending(x => x.avg_sm).ToList();
                        break;
                    case "avg_ds_efficiency":
                        groupedData = groupedData.OrderByDescending(x => x.avg_ds_efficiency).ToList();
                        break;
                    default:
                        groupedData = groupedData.OrderByDescending(x => x.well).ToList();
                        break;
                }
            }

            var totalCount = groupedData.Count;

            // show all if optimasi chart mode
            var pagedData = groupedData.ToList();
            // Pagination if optimasi mode (for list table)
            if (mode == "optimasi")
            {
                pagedData = groupedData
                    .Skip(page * pagesize)
                    .Take(pagesize)
                    .ToList();
            }

            return Ok(new
            {
                items = pagedData,
                total_count = totalCount
            });
        }

        [Authorize("PeDaily Read")]
        [HttpGet("optimasi/quadrant-remark")]
        public IActionResult GetQuadrantRemarks()
        {
            var items = _quadrantRemarks.Find(_ => true).ToList();
            return Ok(new { items });
        }

        [Authorize("PeDaily Read")]
        [HttpPost("optimasi/quadrant-remark")]
        public IActionResult UpsertQuadrantRemark([FromBody] PeOptimasiQuadrantRemark body)
        {
            if (string.IsNullOrWhiteSpace(body.well))
                return BadRequest(new { message = "well is required" });

            var filter = Builders<PeOptimasiQuadrantRemark>.Filter.Eq(r => r.well, body.well);
            var update = Builders<PeOptimasiQuadrantRemark>.Update
                .Set(r => r.well, body.well)
                .Set(r => r.remark, body.remark)
                .Set(r => r.updated_at, DateTime.UtcNow);

            _quadrantRemarks.UpdateOne(filter, update, new UpdateOptions { IsUpsert = true });

            return Ok(new { success = true });
        }





        // [Authorize("PeDaily Read")]
        // [HttpGet("buildfigure")]
        // public ActionResult GetFigure()
        // {


        //     var _items = _daily.Find(new BsonDocument(), new FindOptions() { Collation = new Collation("en_US", numericOrdering: true) });


        //     var total_count = _items.CountDocuments();

        //     List<Daily> items = _items
        //     .Project<Daily>(_fields_daily).ToList();
        //     // Sementara , kalau sudah hapus.
        //     var figure = items.GroupBy(g => new
        //     {
        //         date = g.date
        //     }).Select(s => new
        //     {
        //         date = s.Key.date,
        //         figure = s.Sum(p => p.fig_curr_net)
        //     }).ToList();
        //     foreach (var item in figure)
        //     {
        //         var update = Builders<Production>.Update
        //       .Set(t => t.figure, item.figure)
        //       .Set(t => t.date, item.date);
        //         UpdateResult result = _production.UpdateOne(
        //             Builders<Production>.Filter.Eq(t => t.date, item.date.Value.ToLocalTime()),
        //             update, new UpdateOptions() { IsUpsert = true });

        //     }

        //     return new JsonResult(new
        //     {
        //         total_count = total_count,
        //         incomplete_result = false,
        //         items = figure,
        //     })
        //     {
        //         StatusCode = StatusCodes.Status200OK
        //     };
        // }


        // public void CalculateFigure()
        // {
        //     var _items = _daily.Find(new BsonDocument(), new FindOptions() { Collation = new Collation("en_US", numericOrdering: true) });
        //     var total_count = _items.CountDocuments();

        //     List<Daily> items = _items
        //             .Project<Daily>(_fields_daily).ToList();
        //     // Sementara , kalau sudah hapus.
        //     var figure = items.GroupBy(g => new
        //     {
        //         date = g.date
        //     }).Select(s => new
        //     {
        //         date = s.Key.date,
        //         figure = s.Sum(p => p.fig_curr_net)
        //     }).ToList();
        //     foreach (var item in figure)
        //     {
        //         var update = Builders<Production>.Update
        //       .Set(t => t.figure, item.figure)
        //       .Set(t => t.date, item.date);
        //         UpdateResult result = _production.UpdateOne(
        //             Builders<Production>.Filter.Eq(t => t.date, item.date.Value.ToLocalTime()),
        //             update, new UpdateOptions() { IsUpsert = true });

        //     }
        // }

    }
}
