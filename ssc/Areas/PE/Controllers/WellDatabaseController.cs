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
                .Include(t => t.date_acc)
                .Include(t => t.gross_acc)
                .Include(t => t.net_acc)
                .Include(t => t.wc_acc)
                .Include(t => t.remarks_acc)
                .Include(t => t.date_unacc)
                .Include(t => t.gross_unacc)
                .Include(t => t.net_unacc)
                .Include(t => t.wc_unacc)
                .Include(t => t.date_acc_static)
                .Include(t => t.sfl_acc)
                .Include(t => t.ps_acc)
                .Include(t => t.date_acc_dynamic)
                .Include(t => t.dfl_acc)
                .Include(t => t.pwf_acc)
                .Include(t => t.acc_pi)
                .Include(t => t.acc_ipr)
                .Include(t => t.date_unacc_static)
                .Include(t => t.sfl_unacc)
                .Include(t => t.ps_unacc)
                .Include(t => t.date_unacc_dynamic)
                .Include(t => t.dfl_unacc)
                .Include(t => t.pwf_unacc)
                .Include(t => t.unacc_pi)
                .Include(t => t.unacc_ipr)

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
                    Builders<WellDatabase>.Filter.Regex(t => t.date_acc, new BsonRegularExpression(filter, "i")) |
                    Builders<WellDatabase>.Filter.Regex(t => t.gross_acc, new BsonRegularExpression(filter, "i")) |
                    Builders<WellDatabase>.Filter.Regex(t => t.net_acc, new BsonRegularExpression(filter, "i")) |
                    Builders<WellDatabase>.Filter.Regex(t => t.wc_acc, new BsonRegularExpression(filter, "i")) |
                    Builders<WellDatabase>.Filter.Regex(t => t.remarks_acc, new BsonRegularExpression(filter, "i")) |
                    Builders<WellDatabase>.Filter.Regex(t => t.date_unacc, new BsonRegularExpression(filter, "i")) |
                    Builders<WellDatabase>.Filter.Regex(t => t.gross_unacc, new BsonRegularExpression(filter, "i")) |
                    Builders<WellDatabase>.Filter.Regex(t => t.net_unacc, new BsonRegularExpression(filter, "i")) |
                    Builders<WellDatabase>.Filter.Regex(t => t.wc_unacc, new BsonRegularExpression(filter, "i")) |
                    Builders<WellDatabase>.Filter.Regex(t => t.remarks_unacc, new BsonRegularExpression(filter, "i")) |
                    Builders<WellDatabase>.Filter.Regex(t => t.date_acc_static, new BsonRegularExpression(filter, "i")) |
                    Builders<WellDatabase>.Filter.Regex(t => t.sfl_acc, new BsonRegularExpression(filter, "i")) |
                    Builders<WellDatabase>.Filter.Regex(t => t.ps_acc, new BsonRegularExpression(filter, "i")) |
                    Builders<WellDatabase>.Filter.Regex(t => t.date_acc_dynamic, new BsonRegularExpression(filter, "i")) |
                    Builders<WellDatabase>.Filter.Regex(t => t.dfl_acc, new BsonRegularExpression(filter, "i")) |
                    Builders<WellDatabase>.Filter.Regex(t => t.pwf_acc, new BsonRegularExpression(filter, "i")) |
                    Builders<WellDatabase>.Filter.Regex(t => t.acc_pi, new BsonRegularExpression(filter, "i")) |
                    Builders<WellDatabase>.Filter.Regex(t => t.acc_ipr, new BsonRegularExpression(filter, "i")) |
                    Builders<WellDatabase>.Filter.Regex(t => t.date_unacc_static, new BsonRegularExpression(filter, "i")) |
                    Builders<WellDatabase>.Filter.Regex(t => t.sfl_unacc, new BsonRegularExpression(filter, "i")) |
                    Builders<WellDatabase>.Filter.Regex(t => t.ps_unacc, new BsonRegularExpression(filter, "i")) |
                    Builders<WellDatabase>.Filter.Regex(t => t.date_unacc_dynamic, new BsonRegularExpression(filter, "i")) |
                    Builders<WellDatabase>.Filter.Regex(t => t.dfl_unacc, new BsonRegularExpression(filter, "i")) |
                    Builders<WellDatabase>.Filter.Regex(t => t.pwf_unacc, new BsonRegularExpression(filter, "i")) |
                    Builders<WellDatabase>.Filter.Regex(t => t.unacc_pi, new BsonRegularExpression(filter, "i")) |
                    Builders<WellDatabase>.Filter.Regex(t => t.unacc_ipr, new BsonRegularExpression(filter, "i")) |
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
                if (colfilter.date_acc?.ToList().Count(c => !(c is JObject)) > 0) { var tzOffset = TimeZoneInfo.Local.BaseUtcOffset.ToString(@"hh\:mm"); xcolfilter = xcolfilter & Builders<WellDatabase>.Filter.Or(colfilter.date_acc.ToList().Select(c => (c is DateTime) ? Builders<WellDatabase>.Filter.Eq(t => t.date_acc, new BsonDateTime(((DateTime)c).ToUniversalTime())) : "{$expr:{$regexMatch:{input:{$dateToString:{format:\"%d %m %Y\",date:\"$date_acc\",timezone:\"+0" + tzOffset + "\"}},regex:/" + ReplaceMonth((string)c) + "/i}}}")); }
                if (colfilter.gross_acc?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellDatabase>.Filter.Or(colfilter.panjang_feature.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellDatabase>.Filter.Eq(t => t.gross_acc, Convert.ToDecimal(c))));
                if (colfilter.net_acc?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellDatabase>.Filter.Or(colfilter.panjang_feature.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellDatabase>.Filter.Eq(t => t.net_acc, Convert.ToDecimal(c))));
                if (colfilter.wc_acc?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellDatabase>.Filter.Or(colfilter.wc_acc.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellDatabase>.Filter.Eq(t => t.wc_acc, Convert.ToDecimal(c))));
                if (colfilter.remarks_acc?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellDatabase>.Filter.Or(colfilter.remarks_acc.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellDatabase>.Filter.Regex(t => t.remarks_acc, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.date_unacc?.ToList().Count(c => !(c is JObject)) > 0) { var tzOffset = TimeZoneInfo.Local.BaseUtcOffset.ToString(@"hh\:mm"); xcolfilter = xcolfilter & Builders<WellDatabase>.Filter.Or(colfilter.date_unacc.ToList().Select(c => (c is DateTime) ? Builders<WellDatabase>.Filter.Eq(t => t.date_unacc, new BsonDateTime(((DateTime)c).ToUniversalTime())) : "{$expr:{$regexMatch:{input:{$dateToString:{format:\"%d %m %Y\",date:\"$last_comp_date\",timezone:\"+0" + tzOffset + "\"}},regex:/" + ReplaceMonth((string)c) + "/i}}}")); }
                if (colfilter.gross_unacc?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellDatabase>.Filter.Or(colfilter.gross_unacc.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellDatabase>.Filter.Eq(t => t.gross_unacc, Convert.ToDecimal(c))));
                if (colfilter.net_unacc?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellDatabase>.Filter.Or(colfilter.net_unacc.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellDatabase>.Filter.Eq(t => t.net_unacc, Convert.ToDecimal(c))));
                if (colfilter.wc_unacc?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellDatabase>.Filter.Or(colfilter.wc_unacc.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellDatabase>.Filter.Eq(t => t.wc_unacc, Convert.ToDecimal(c))));
                if (colfilter.remarks_unacc?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellDatabase>.Filter.Or(colfilter.remarks_unacc.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellDatabase>.Filter.Regex(t => t.remarks_unacc, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.date_acc_static?.ToList().Count(c => !(c is JObject)) > 0) { var tzOffset = TimeZoneInfo.Local.BaseUtcOffset.ToString(@"hh\:mm"); xcolfilter = xcolfilter & Builders<WellDatabase>.Filter.Or(colfilter.date_acc_static.ToList().Select(c => (c is DateTime) ? Builders<WellDatabase>.Filter.Eq(t => t.date_acc_static, new BsonDateTime(((DateTime)c).ToUniversalTime())) : "{$expr:{$regexMatch:{input:{$dateToString:{format:\"%d %m %Y\",date:\"$date_acc_static\",timezone:\"+0" + tzOffset + "\"}},regex:/" + ReplaceMonth((string)c) + "/i}}}")); }
                if (colfilter.sfl_acc?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellDatabase>.Filter.Or(colfilter.sfl_acc.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellDatabase>.Filter.Eq(t => t.sfl_acc, Convert.ToDecimal(c))));
                if (colfilter.ps_acc?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellDatabase>.Filter.Or(colfilter.ps_acc.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellDatabase>.Filter.Eq(t => t.ps_acc, Convert.ToDecimal(c))));
                if (colfilter.date_acc_dynamic?.ToList().Count(c => !(c is JObject)) > 0) { var tzOffset = TimeZoneInfo.Local.BaseUtcOffset.ToString(@"hh\:mm"); xcolfilter = xcolfilter & Builders<WellDatabase>.Filter.Or(colfilter.date_acc_dynamic.ToList().Select(c => (c is DateTime) ? Builders<WellDatabase>.Filter.Eq(t => t.date_acc_dynamic, new BsonDateTime(((DateTime)c).ToUniversalTime())) : "{$expr:{$regexMatch:{input:{$dateToString:{format:\"%d %m %Y\",date:\"$date_acc_dynamic\",timezone:\"+0" + tzOffset + "\"}},regex:/" + ReplaceMonth((string)c) + "/i}}}")); }
                if (colfilter.dfl_acc?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellDatabase>.Filter.Or(colfilter.dfl_acc.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellDatabase>.Filter.Eq(t => t.dfl_acc, Convert.ToDecimal(c))));
                if (colfilter.pwf_acc?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellDatabase>.Filter.Or(colfilter.pwf_acc.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellDatabase>.Filter.Eq(t => t.pwf_acc, Convert.ToDecimal(c))));
                if (colfilter.acc_pi?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellDatabase>.Filter.Or(colfilter.acc_pi.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellDatabase>.Filter.Eq(t => t.acc_pi, Convert.ToDecimal(c))));
                if (colfilter.acc_ipr?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellDatabase>.Filter.Or(colfilter.acc_ipr.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellDatabase>.Filter.Eq(t => t.acc_ipr, Convert.ToDecimal(c))));
                if (colfilter.date_unacc_static?.ToList().Count(c => !(c is JObject)) > 0) { var tzOffset = TimeZoneInfo.Local.BaseUtcOffset.ToString(@"hh\:mm"); xcolfilter = xcolfilter & Builders<WellDatabase>.Filter.Or(colfilter.date_unacc_static.ToList().Select(c => (c is DateTime) ? Builders<WellDatabase>.Filter.Eq(t => t.date_unacc_static, new BsonDateTime(((DateTime)c).ToUniversalTime())) : "{$expr:{$regexMatch:{input:{$dateToString:{format:\"%d %m %Y\",date:\"$date_unacc_static\",timezone:\"+0" + tzOffset + "\"}},regex:/" + ReplaceMonth((string)c) + "/i}}}")); }
                if (colfilter.sfl_unacc?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellDatabase>.Filter.Or(colfilter.sfl_unacc.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellDatabase>.Filter.Eq(t => t.sfl_unacc, Convert.ToDecimal(c))));
                if (colfilter.ps_unacc?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellDatabase>.Filter.Or(colfilter.ps_unacc.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellDatabase>.Filter.Eq(t => t.ps_unacc, Convert.ToDecimal(c))));
                if (colfilter.date_unacc_dynamic?.ToList().Count(c => !(c is JObject)) > 0) { var tzOffset = TimeZoneInfo.Local.BaseUtcOffset.ToString(@"hh\:mm"); xcolfilter = xcolfilter & Builders<WellDatabase>.Filter.Or(colfilter.date_unacc_dynamic.ToList().Select(c => (c is DateTime) ? Builders<WellDatabase>.Filter.Eq(t => t.date_unacc_dynamic, new BsonDateTime(((DateTime)c).ToUniversalTime())) : "{$expr:{$regexMatch:{input:{$dateToString:{format:\"%d %m %Y\",date:\"$date_unacc_dynamic\",timezone:\"+0" + tzOffset + "\"}},regex:/" + ReplaceMonth((string)c) + "/i}}}")); }
                if (colfilter.dfl_unacc?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellDatabase>.Filter.Or(colfilter.dfl_unacc.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellDatabase>.Filter.Eq(t => t.dfl_unacc, Convert.ToDecimal(c))));
                if (colfilter.pwf_unacc?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellDatabase>.Filter.Or(colfilter.pwf_unacc.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellDatabase>.Filter.Eq(t => t.pwf_unacc, Convert.ToDecimal(c))));
                if (colfilter.unacc_pi?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellDatabase>.Filter.Or(colfilter.unacc_pi.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellDatabase>.Filter.Eq(t => t.unacc_pi, Convert.ToDecimal(c))));
                if (colfilter.unacc_ipr?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<WellDatabase>.Filter.Or(colfilter.unacc_ipr.ToList().Where(c => !(c is JObject)).Select(c => Builders<WellDatabase>.Filter.Eq(t => t.unacc_ipr, Convert.ToDecimal(c))));

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
                    if (colfilter.top_2?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.top_2.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$top_2\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.bottom_2?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.bottom_2.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$bottom_2\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.hole_feature?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.hole_feature.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$hole_feature\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.panjang_feature?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.panjang_feature.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$panjang_feature\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.date_acc?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.date_acc.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[\"$date_acc\",ISODate(\"{1}\")]}}", ((JObject)c).GetValue("opr"), DateTime.Parse(((JObject)c).GetValue("val").ToString()).ToString("yyyy-MM-ddTHH:mm:ssZ"))).ToArray()), log);
                    if (colfilter.gross_acc?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.gross_acc.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$gross_acc\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.net_acc?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.net_acc.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$net_acc\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.wc_acc?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.wc_acc.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$wc_acc\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.remarks_acc?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.remarks_acc.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$remarks_acc\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.date_unacc?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.date_unacc.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[\"$date_unacc\",ISODate(\"{1}\")]}}", ((JObject)c).GetValue("opr"), DateTime.Parse(((JObject)c).GetValue("val").ToString()).ToString("yyyy-MM-ddTHH:mm:ssZ"))).ToArray()), log);
                    if (colfilter.gross_unacc?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.gross_unacc.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$gross_unacc\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.net_unacc?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.net_unacc.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$net_unacc\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.wc_unacc?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.wc_unacc.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$wc_unacc\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.remarks_unacc?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.remarks_unacc.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$remarks_unacc\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.date_acc_static?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.date_acc_static.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[\"$date_acc_static\",ISODate(\"{1}\")]}}", ((JObject)c).GetValue("opr"), DateTime.Parse(((JObject)c).GetValue("val").ToString()).ToString("yyyy-MM-ddTHH:mm:ssZ"))).ToArray()), log);
                    if (colfilter.sfl_acc?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.sfl_acc.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$sfl_acc\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.ps_acc?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.ps_acc.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$ps_acc\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.date_acc_dynamic?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.date_acc_dynamic.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[\"$date_acc_dynamic\",ISODate(\"{1}\")]}}", ((JObject)c).GetValue("opr"), DateTime.Parse(((JObject)c).GetValue("val").ToString()).ToString("yyyy-MM-ddTHH:mm:ssZ"))).ToArray()), log);
                    if (colfilter.dfl_acc?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.dfl_acc.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$dfl_acc\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.pwf_acc?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.pwf_acc.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$pwf_acc\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.acc_pi?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.acc_pi.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$acc_pi\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.acc_ipr?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.acc_ipr.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$acc_ipr\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);

                    if (colfilter.date_unacc_static?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.date_unacc_static.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[\"$date_unacc_static\",ISODate(\"{1}\")]}}", ((JObject)c).GetValue("opr"), DateTime.Parse(((JObject)c).GetValue("val").ToString()).ToString("yyyy-MM-ddTHH:mm:ssZ"))).ToArray()), log);
                    if (colfilter.sfl_unacc?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.sfl_unacc.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$sfl_unacc\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.ps_unacc?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.ps_unacc.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$ps_unacc\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.date_unacc_dynamic?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.date_unacc_dynamic.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[\"$date_unacc_dynamic\",ISODate(\"{1}\")]}}", ((JObject)c).GetValue("opr"), DateTime.Parse(((JObject)c).GetValue("val").ToString()).ToString("yyyy-MM-ddTHH:mm:ssZ"))).ToArray()), log);
                    if (colfilter.dfl_unacc?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.dfl_unacc.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$dfl_unacc\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.pwf_unacc?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.pwf_unacc.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$pwf_unacc\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.unacc_pi?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.unacc_pi.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$unacc_pi\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.unacc_ipr?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.unacc_ipr.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$unacc_ipr\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);

                    if (colfilter.rtl?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.rtl.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$rtl\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.remarks?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.remarks.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$remarks\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
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
                case "date_acc": _items = (order == "asc") ? _items.SortBy(t => t.date_acc) : _items.SortByDescending(t => t.date_acc); break;
                case "gross_acc": _items = (order == "asc") ? _items.SortBy(t => t.gross_acc) : _items.SortByDescending(t => t.gross_acc); break;
                case "net_acc": _items = (order == "asc") ? _items.SortBy(t => t.net_acc) : _items.SortByDescending(t => t.net_acc); break;
                case "wc_acc": _items = (order == "asc") ? _items.SortBy(t => t.wc_acc) : _items.SortByDescending(t => t.wc_acc); break;
                case "remarks_acc": _items = (order == "asc") ? _items.SortBy(t => t.remarks_acc) : _items.SortByDescending(t => t.remarks_acc); break;
                case "date_unacc": _items = (order == "asc") ? _items.SortBy(t => t.date_unacc) : _items.SortByDescending(t => t.date_unacc); break;
                case "gross_unacc": _items = (order == "asc") ? _items.SortBy(t => t.gross_unacc) : _items.SortByDescending(t => t.gross_unacc); break;
                case "net_unacc": _items = (order == "asc") ? _items.SortBy(t => t.net_unacc) : _items.SortByDescending(t => t.net_unacc); break;
                case "wc_unacc": _items = (order == "asc") ? _items.SortBy(t => t.wc_unacc) : _items.SortByDescending(t => t.wc_unacc); break;
                case "remarks_unacc": _items = (order == "asc") ? _items.SortBy(t => t.remarks_unacc) : _items.SortByDescending(t => t.remarks_unacc); break;
                case "date_acc_static": _items = (order == "asc") ? _items.SortBy(t => t.date_acc_static) : _items.SortByDescending(t => t.date_acc_static); break;
                case "sfl_acc": _items = (order == "asc") ? _items.SortBy(t => t.sfl_acc) : _items.SortByDescending(t => t.sfl_acc); break;
                case "ps_acc": _items = (order == "asc") ? _items.SortBy(t => t.ps_acc) : _items.SortByDescending(t => t.ps_acc); break;
                case "date_acc_dynamic": _items = (order == "asc") ? _items.SortBy(t => t.date_acc_dynamic) : _items.SortByDescending(t => t.date_acc_dynamic); break;
                case "dfl_acc": _items = (order == "asc") ? _items.SortBy(t => t.dfl_acc) : _items.SortByDescending(t => t.dfl_acc); break;
                case "pwf_acc": _items = (order == "asc") ? _items.SortBy(t => t.pwf_acc) : _items.SortByDescending(t => t.pwf_acc); break;
                case "acc_pi": _items = (order == "asc") ? _items.SortBy(t => t.acc_pi) : _items.SortByDescending(t => t.acc_pi); break;
                case "acc_ipr": _items = (order == "asc") ? _items.SortBy(t => t.acc_ipr) : _items.SortByDescending(t => t.acc_ipr); break;
                case "date_unacc_static": _items = (order == "asc") ? _items.SortBy(t => t.date_unacc_static) : _items.SortByDescending(t => t.date_unacc_static); break;
                case "sfl_unacc": _items = (order == "asc") ? _items.SortBy(t => t.sfl_unacc) : _items.SortByDescending(t => t.sfl_unacc); break;
                case "ps_unacc": _items = (order == "asc") ? _items.SortBy(t => t.ps_unacc) : _items.SortByDescending(t => t.ps_unacc); break;
                case "date_unacc_dynamic": _items = (order == "asc") ? _items.SortBy(t => t.date_unacc_dynamic) : _items.SortByDescending(t => t.date_unacc_dynamic); break;
                case "dfl_unacc": _items = (order == "asc") ? _items.SortBy(t => t.dfl_unacc) : _items.SortByDescending(t => t.dfl_unacc); break;
                case "pwf_unacc": _items = (order == "asc") ? _items.SortBy(t => t.pwf_unacc) : _items.SortByDescending(t => t.pwf_unacc); break;
                case "unacc_pi": _items = (order == "asc") ? _items.SortBy(t => t.unacc_pi) : _items.SortByDescending(t => t.unacc_pi); break;
                case "unacc_ipr": _items = (order == "asc") ? _items.SortBy(t => t.unacc_ipr) : _items.SortByDescending(t => t.unacc_ipr); break;
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

            ws.Cells[1, 13].Value = "Accessed Layer Perfomance";
            ws.Cells[1, 13, 1, 17].Merge = true;
            ws.Cells[2, 13].Value = "Date";
            ws.Cells[2, 14].Value = "Gross";
            ws.Cells[2, 15].Value = "Net";
            ws.Cells[2, 16].Value = "WC";
            ws.Cells[2, 17].Value = "Remarks";

            ws.Cells[1, 18].Value = "Unacessed Layer Perfomance";
            ws.Cells[1, 18, 1, 22].Merge = true;
            ws.Cells[2, 18].Value = "Date";
            ws.Cells[2, 19].Value = "Gross";
            ws.Cells[2, 20].Value = "Net";
            ws.Cells[2, 21].Value = "WC";
            ws.Cells[2, 22].Value = "Remarks";

            ws.Cells[1, 23].Value = "RTL";
            ws.Cells[1, 24].Value = "Remarks";


            ws.Cells[1, 1, 1, 24].Style.Font.Bold = true;
            ws.Cells[1, 1, 1, 24].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            ws.Cells[1, 1, 1, 24].Style.VerticalAlignment = ExcelVerticalAlignment.Top;

            for (int c = 1; c <= 24; c++)
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
                ws.Cells[2 + i, 13].Value = t.date_acc;
                ws.Cells[2 + i, 14].Value = t.gross_acc;
                ws.Cells[2 + i, 15].Value = t.net_acc;
                ws.Cells[2 + i, 16].Value = t.wc_acc;
                ws.Cells[2 + i, 17].Value = t.remarks_acc;
                ws.Cells[2 + i, 18].Value = t.date_unacc;
                ws.Cells[2 + i, 19].Value = t.gross_unacc;
                ws.Cells[2 + i, 20].Value = t.net_unacc;
                ws.Cells[2 + i, 21].Value = t.wc_unacc;
                ws.Cells[2 + i, 22].Value = t.remarks_unacc;
                ws.Cells[2 + i, 23].Value = t.rtl;
                ws.Cells[2 + i, 24].Value = t.remarks;
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
                if (!string.IsNullOrWhiteSpace(ws.Cells[r, 2].Value?.ToString()))
                {
                    WellDatabase _row = new WellDatabase();
                    WellDatabaseError _row_error = new WellDatabaseError();
                    int last_error_count = error_count;

                    if (!String.IsNullOrWhiteSpace(ws.Cells[r, 2].Value?.ToString()))
                    {
                        _row.well = ws.Cells[r, 2].Value?.ToString().Trim();
                    }
                    else
                    {
                        _row_error.well = new ErrorItem { value = "(Blank)", message = "Blank well is not allowed" };
                        error_count++;
                    }

                    // date mappings
                    // Column indexes based on the provided Excel structure
                    var dateMappings = new[]
                    {
                        new { key = "last_comp_date", col = 3 },
                        new { key = "date_acc", col = 14 },
                        new { key = "date_unacc", col = 19 },
                        new { key = "date_acc_static", col = 24 },
                        new { key = "date_acc_dynamic", col = 27 },
                        new { key = "date_unacc_static", col = 32 },
                        new { key = "date_unacc_dynamic", col = 35 },
                    };

                    foreach (var mapping in dateMappings)
                    {
                        var rawValue = ws.Cells[r, mapping.col].Value;
                        var strValue = rawValue?.ToString().Trim();

                        if (!string.IsNullOrWhiteSpace(strValue))
                        {
                            try
                            {
                                DateTime parsedDate;
                                if (rawValue is DateTime dt)
                                {
                                    parsedDate = dt;
                                }
                                else
                                {
                                    parsedDate = DateTime.FromOADate(double.Parse(strValue));
                                }

                                var prop = typeof(WellDatabase).GetProperty(mapping.key);
                                if (prop != null)
                                    prop.SetValue(_row, (DateTime?)parsedDate);
                            }
                            catch (Exception e)
                            {
                                var errorProp = typeof(WellDatabaseError).GetProperty(mapping.key);
                                if (errorProp != null)
                                    errorProp.SetValue(_row_error, new ErrorItem { value = strValue, message = e.Message });

                                error_count++;
                            }
                        }
                        else
                        {
                            var errorProp = typeof(WellDatabaseError).GetProperty(mapping.key);
                            if (errorProp != null)
                                errorProp.SetValue(_row_error, null);
                        }
                    }

                    var arrayMappings = new[]
                    {
                        new
                        {
                            key = "layer_acc",
                            col = 4,
                            required = false,
                            errorMsg = "Blank zone is not allowed",
                            parse = new Func<string, object>(val => val.Split(",").Select(z => z.Trim()).ToArray())
                        },
                        new
                        {
                            key = "interval_acc",
                            col = 5,
                            required = false,
                            errorMsg = "Blank interval is not allowed",
                            parse = new Func<string, object>(val => val.Split(",").Select(i => i.Trim().Split("-").Select(j => decimal.Parse(j.Trim())).ToArray()).ToArray())
                        },

                        new
                        {
                            key = "layer_unacc",
                            col = 8,
                            required = false,
                            errorMsg = "Blank zone is not allowed",
                            parse = new Func<string, object>(val => val.Split(",").Select(z => z.Trim()).ToArray())
                        },
                        new
                        {
                            key = "interval_unacc",
                            col = 9,
                            required = false,
                            errorMsg = "Blank interval is not allowed",
                            parse = new Func<string, object>(val => val.Split(",").Select(i => i.Trim().Split("-").Select(j => decimal.Parse(j.Trim())).ToArray()).ToArray())
                        }
                    };

                    foreach (var mapping in arrayMappings)
                    {
                        var rawValue = ws.Cells[r, mapping.col].Value;
                        var strValue = rawValue?.ToString().Trim();

                        var prop = typeof(WellDatabase).GetProperty(mapping.key);
                        var errorProp = typeof(WellDatabaseError).GetProperty(mapping.key);

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
                        new { key = "top", col = 6 },
                        new { key = "bottom", col = 7 },
                        new { key = "top_2", col = 10 },
                        new { key = "bottom_2", col = 11 },
                        new { key = "panjang_feature", col = 13 },
                        new { key = "gross_acc", col = 15 },
                        new { key = "net_acc", col = 16 },
                        new { key = "wc_acc", col = 17 },
                        new { key = "gross_unacc", col = 20 },
                        new { key = "net_unacc", col = 21 },
                        new { key = "wc_unacc", col = 22 },
                        new { key = "sfl_acc", col = 25 },
                        new { key = "ps_acc", col = 26 },
                        new { key = "dfl_acc", col = 28 },
                        new { key = "pwf_acc", col = 29 },
                        new { key = "acc_pi", col = 30 },
                        new { key = "acc_ipr", col = 31 },
                        new { key = "sfl_unacc", col = 33 },
                        new { key = "ps_unacc", col = 34 },
                        new { key = "dfl_unacc", col = 36 },
                        new { key = "pwf_unacc", col = 37 },
                        new { key = "unacc_pi", col = 38 },
                        new { key = "unacc_ipr", col = 39 },
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
                                var prop = typeof(WellDatabase).GetProperty(mapping.key);
                                if (prop != null)
                                    prop.SetValue(_row, num);
                            }
                            else
                            {
                                var prop = typeof(WellDatabase).GetProperty(mapping.key);
                                if (prop != null)
                                    prop.SetValue(_row, null);

                                var errorProp = typeof(WellDatabaseError).GetProperty(mapping.key);
                                if (errorProp != null)
                                    errorProp.SetValue(_row_error, new ErrorItem { value = strValue, message = "Invalid number" });

                                error_count++;
                            }
                        }
                        else
                        {
                            var prop = typeof(WellDatabase).GetProperty(mapping.key);
                            if (prop != null)
                                prop.SetValue(_row, null);
                        }
                    }


                    if (!String.IsNullOrWhiteSpace(ws.Cells[r, 12].Value?.ToString()))
                    {
                        _row.hole_feature = ws.Cells[r, 12].Value?.ToString().Trim();
                    }
                    else
                    {
                        _row_error.hole_feature = null;
                    }

                    if (!String.IsNullOrWhiteSpace(ws.Cells[r, 18].Value?.ToString()))
                    {
                        try
                        {
                            _row.remarks_acc = ws.Cells[r, 18].Value?.ToString().Trim();
                        }
                        catch (Exception e)
                        {
                            _row_error.remarks_acc = new ErrorItem
                            {
                                value = ws.Cells[r, 18].Value?.ToString(),
                                message = e.Message
                            };
                            error_count++;
                        }
                    }
                    else
                    {
                        _row.remarks_acc = null;
                    }

                    if (!String.IsNullOrWhiteSpace(ws.Cells[r, 23].Value?.ToString()))
                    {
                        try
                        {
                            _row.remarks_unacc = ws.Cells[r, 23].Value?.ToString().Trim();
                        }
                        catch (Exception e)
                        {
                            _row_error.remarks_unacc = new ErrorItem
                            {
                                value = ws.Cells[r, 23].Value?.ToString(),
                                message = e.Message
                            };
                            error_count++;
                        }
                    }
                    else
                    {
                        _row.remarks_unacc = null;
                    }

                    if (!String.IsNullOrWhiteSpace(ws.Cells[r, 24].Value?.ToString()))
                    {
                        try
                        {
                            _row.rtl = ws.Cells[r, 24].Value?.ToString().Trim();
                        }
                        catch (Exception e)
                        {
                            _row_error.rtl = new ErrorItem
                            {
                                value = ws.Cells[r, 24].Value?.ToString(),
                                message = e.Message
                            };
                            error_count++;
                        }
                    }
                    else
                    {
                        _row.rtl = null;
                    }


                    if (!String.IsNullOrWhiteSpace(ws.Cells[r, 25].Value?.ToString()))
                    {
                        try
                        {
                            _row.remarks = ws.Cells[r, 25].Value?.ToString().Trim();
                        }
                        catch (Exception e)
                        {
                            _row_error.remarks = new ErrorItem
                            {
                                value = ws.Cells[r, 25].Value?.ToString(),
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
                        .Set(t => t.date_acc, item.date_acc)
                        .Set(t => t.gross_acc, item.gross_acc)
                        .Set(t => t.net_acc, item.net_acc)
                        .Set(t => t.wc_acc, item.wc_acc)
                        .Set(t => t.remarks_acc, item.remarks_acc)
                        .Set(t => t.date_unacc, item.date_unacc)
                        .Set(t => t.gross_unacc, item.gross_unacc)
                        .Set(t => t.net_unacc, item.net_unacc)
                        .Set(t => t.wc_unacc, item.wc_unacc)
                        .Set(t => t.remarks_unacc, item.remarks_unacc)
                        .Set(t => t.date_acc_static, item.date_acc_static)
                        .Set(t => t.sfl_acc, item.sfl_acc)
                        .Set(t => t.ps_acc, item.ps_acc)
                        .Set(t => t.date_acc_dynamic, item.date_acc_dynamic)
                        .Set(t => t.dfl_acc, item.dfl_acc)
                        .Set(t => t.pwf_acc, item.pwf_acc)
                        .Set(t => t.acc_pi, item.acc_pi)
                        .Set(t => t.acc_ipr, item.acc_ipr)
                        .Set(t => t.date_unacc_static, item.date_unacc_static)
                        .Set(t => t.sfl_unacc, item.sfl_unacc)
                        .Set(t => t.ps_unacc, item.ps_unacc)
                        .Set(t => t.date_unacc_dynamic, item.date_unacc_dynamic)
                        .Set(t => t.dfl_unacc, item.dfl_unacc)
                        .Set(t => t.pwf_unacc, item.pwf_unacc)
                        .Set(t => t.unacc_pi, item.unacc_pi)
                        .Set(t => t.unacc_ipr, item.unacc_ipr)
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
                .Set(t => t.date_acc, payload.date_acc)
                .Set(t => t.gross_acc, payload.gross_acc)
                .Set(t => t.net_acc, payload.net_acc)
                .Set(t => t.wc_acc, payload.wc_acc)
                .Set(t => t.remarks_acc, payload.remarks_acc)
                .Set(t => t.date_unacc, payload.date_unacc)
                .Set(t => t.gross_unacc, payload.gross_unacc)
                .Set(t => t.net_unacc, payload.net_unacc)
                .Set(t => t.wc_unacc, payload.wc_unacc)
                .Set(t => t.remarks_unacc, payload.remarks_unacc)
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
