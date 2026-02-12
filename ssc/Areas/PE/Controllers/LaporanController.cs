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
    [Route("api/pe/laporan")]
    [ApiController]
    public class LaporanLabController : ControllerBase
    {
        private IMongoDatabase database;
        private readonly IMongoCollection<LaporanLab> _laporan;
        private readonly IMongoCollection<LaporanLabTmp> _laporan_tmp;
        private ProjectionDefinition<LaporanLab> _fields;

        public LaporanLabController(IPEDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            database = client.GetDatabase("pe");

            _laporan = database.GetCollection<LaporanLab>("laporan");
            _laporan_tmp = database.GetCollection<LaporanLabTmp>("laporan_tmp");
            _fields = Builders<LaporanLab>.Projection
                .Include(t => t.nomor)
                .Include(t => t.date)
                .Include(t => t.well)
                .Include(t => t.sed)
                .Include(t => t.water)
                .Include(t => t.sludge)
                .Include(t => t.total)
                .Include(t => t.api)
                .Include(t => t.sg)
                .Include(t => t.density_obs)
                .Include(t => t.density_dua)
                .Include(t => t.pp)
                .Include(t => t.temperature)
                .Include(t => t.visc)
                .Include(t => t.cl)
                .Include(t => t.rw)
                .Include(t => t.keterangan);
        }

        [Authorize("PeLaporanLab Read")]
        [HttpGet]
        public ActionResult Get(String sort = "date", String order = "desc", int page = 0, int pagesize = 50, String filter = "", String columnfilter = "", string mode = "")
        {

            //var _items = _tickets.Find(t => true);
            FilterDefinition<LaporanLab> xfilter = Builders<LaporanLab>.Filter.Ne("a", "b");
            FilterDefinition<LaporanLab> xcolfilter;

            if (!String.IsNullOrWhiteSpace(filter))
            {
                filter = filter.ToLower();
                xfilter =
                    Builders<LaporanLab>.Filter.Regex(t => t.nomor, new BsonRegularExpression(filter, "i")) |
                    Builders<LaporanLab>.Filter.Regex(t => t.date, new BsonRegularExpression(filter, "i")) |
                    Builders<LaporanLab>.Filter.Regex(t => t.well, new BsonRegularExpression(filter, "i")) |
                    Builders<LaporanLab>.Filter.Regex(t => t.sed, new BsonRegularExpression(filter, "i")) |
                    Builders<LaporanLab>.Filter.Regex(t => t.water, new BsonRegularExpression(filter, "i")) |
                    Builders<LaporanLab>.Filter.Regex(t => t.sludge, new BsonRegularExpression(filter, "i")) |
                    Builders<LaporanLab>.Filter.Regex(t => t.total, new BsonRegularExpression(filter, "i")) |
                    Builders<LaporanLab>.Filter.Regex(t => t.api, new BsonRegularExpression(filter, "i")) |
                    Builders<LaporanLab>.Filter.Regex(t => t.sg, new BsonRegularExpression(filter, "i")) |
                    Builders<LaporanLab>.Filter.Regex(t => t.density_obs, new BsonRegularExpression(filter, "i")) |
                    Builders<LaporanLab>.Filter.Regex(t => t.density_dua, new BsonRegularExpression(filter, "i")) |
                    Builders<LaporanLab>.Filter.Regex(t => t.pp, new BsonRegularExpression(filter, "i")) |
                    Builders<LaporanLab>.Filter.Regex(t => t.temperature, new BsonRegularExpression(filter, "i")) |
                    Builders<LaporanLab>.Filter.Regex(t => t.visc, new BsonRegularExpression(filter, "i")) |
                    Builders<LaporanLab>.Filter.Regex(t => t.cl, new BsonRegularExpression(filter, "i")) |
                    Builders<LaporanLab>.Filter.Regex(t => t.rw, new BsonRegularExpression(filter, "i")) |
                    Builders<LaporanLab>.Filter.Regex(t => t.keterangan, new BsonRegularExpression(filter, "i"));
            }

            if (!String.IsNullOrWhiteSpace(columnfilter))
            {
                xcolfilter = Builders<LaporanLab>.Filter.Ne("a", "b");
                LaporanLabList colfilter = JsonConvert.DeserializeObject<LaporanLabList>(columnfilter);
                if (colfilter.nomor?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<LaporanLab>.Filter.Or(colfilter.nomor.ToList().Where(c => !(c is JObject)).Select(c => Builders<LaporanLab>.Filter.Eq(t => t.nomor, Convert.ToDecimal(c))));
                if (colfilter.date?.ToList().Count(c => !(c is JObject)) > 0) { var tzOffset = TimeZoneInfo.Local.BaseUtcOffset.ToString(@"hh\:mm"); xcolfilter = xcolfilter & Builders<LaporanLab>.Filter.Or(colfilter.date.ToList().Select(c => (c is DateTime) ? Builders<LaporanLab>.Filter.Eq(t => t.date, new BsonDateTime(((DateTime)c).ToUniversalTime())) : "{$expr:{$regexMatch:{input:{$dateToString:{format:\"%d %m %Y\",date:\"$date\",timezone:\"+0" + tzOffset + "\"}},regex:/" + ReplaceMonth((string)c) + "/i}}}")); }

                // if (colfilter.date?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<LaporanLab>.Filter.Or(colfilter.date.ToList().Select(c => (c is DateTime) ? Builders<LaporanLab>.Filter.Eq(t => t.date, new BsonDateTime((DateTime)c)) : "{$expr:{$regexMatch:{input:{$dateToString:{format:\"%d %m %Y\",date:\"$date\",timezone:\"" + TimeZoneInfo.Local.DisplayName.Substring(4, 6) + "\"}},regex:/" + ReplaceMonth((string)c) + "/i}}}"));
                if (colfilter.well?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<LaporanLab>.Filter.Or(colfilter.well.ToList().Where(c => !(c is JObject)).Select(c => Builders<LaporanLab>.Filter.Regex(t => t.well, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.sed?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<LaporanLab>.Filter.Or(colfilter.sed.ToList().Where(c => !(c is JObject)).Select(c => Builders<LaporanLab>.Filter.Eq(t => t.sed, Convert.ToDecimal(c))));
                if (colfilter.water?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<LaporanLab>.Filter.Or(colfilter.water.ToList().Where(c => !(c is JObject)).Select(c => Builders<LaporanLab>.Filter.Eq(t => t.water, Convert.ToDecimal(c))));
                if (colfilter.sludge?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<LaporanLab>.Filter.Or(colfilter.sludge.ToList().Where(c => !(c is JObject)).Select(c => Builders<LaporanLab>.Filter.Eq(t => t.sludge, Convert.ToDecimal(c))));
                if (colfilter.total?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<LaporanLab>.Filter.Or(colfilter.total.ToList().Where(c => !(c is JObject)).Select(c => Builders<LaporanLab>.Filter.Eq(t => t.total, Convert.ToDecimal(c))));
                if (colfilter.api?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<LaporanLab>.Filter.Or(colfilter.api.ToList().Where(c => !(c is JObject)).Select(c => Builders<LaporanLab>.Filter.Regex(t => t.api, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.sg?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<LaporanLab>.Filter.Or(colfilter.sg.ToList().Where(c => !(c is JObject)).Select(c => Builders<LaporanLab>.Filter.Eq(t => t.sg, Convert.ToDecimal(c))));
                if (colfilter.density_obs?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<LaporanLab>.Filter.Or(colfilter.density_obs.ToList().Where(c => !(c is JObject)).Select(c => Builders<LaporanLab>.Filter.Eq(t => t.density_obs, Convert.ToDecimal(c))));
                if (colfilter.density_dua?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<LaporanLab>.Filter.Or(colfilter.density_dua.ToList().Where(c => !(c is JObject)).Select(c => Builders<LaporanLab>.Filter.Eq(t => t.density_dua, Convert.ToDecimal(c))));
                if (colfilter.pp?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<LaporanLab>.Filter.Or(colfilter.pp.ToList().Where(c => !(c is JObject)).Select(c => Builders<LaporanLab>.Filter.Regex(t => t.pp, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.temperature?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<LaporanLab>.Filter.Or(colfilter.temperature.ToList().Where(c => !(c is JObject)).Select(c => Builders<LaporanLab>.Filter.Eq(t => t.temperature, Convert.ToDecimal(c))));
                if (colfilter.visc?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<LaporanLab>.Filter.Or(colfilter.visc.ToList().Where(c => !(c is JObject)).Select(c => Builders<LaporanLab>.Filter.Eq(t => t.visc, Convert.ToDecimal(c))));
                if (colfilter.cl?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<LaporanLab>.Filter.Or(colfilter.cl.ToList().Where(c => !(c is JObject)).Select(c => Builders<LaporanLab>.Filter.Regex(t => t.cl, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.rw?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<LaporanLab>.Filter.Or(colfilter.rw.ToList().Where(c => !(c is JObject)).Select(c => Builders<LaporanLab>.Filter.Eq(t => t.rw, Convert.ToDecimal(c))));
                if (colfilter.keterangan?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<LaporanLab>.Filter.Or(colfilter.keterangan.ToList().Where(c => !(c is JObject)).Select(c => Builders<LaporanLab>.Filter.Regex(t => t.keterangan, new BsonRegularExpression((string)c, "i"))));


                foreach (string log in DailyCommon._logical)
                {
                    if (colfilter.nomor?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.nomor.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$nomor\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.date?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.date.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[\"$date\",ISODate(\"{1}\")]}}", ((JObject)c).GetValue("opr"), DateTime.Parse(((JObject)c).GetValue("val").ToString()).ToString("yyyy-MM-ddTHH:mm:ssZ"))).ToArray()), log);
                    if (colfilter.well?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.well.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$well\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.sed?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.sed.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$sed\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.water?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.water.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$water\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.sludge?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.sludge.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$sludge\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.total?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.total.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$total\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.api?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.api.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$api\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.sg?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.sg.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$sg\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.density_obs?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.density_obs.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$density_obs\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.density_dua?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.density_dua.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$density_dua\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.pp?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.pp.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$pp\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.temperature?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.temperature.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$temperature\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.visc?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.visc.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$visc\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.cl?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.cl.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$cl\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.rw?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.rw.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$rw\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.keterangan?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) { xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.keterangan.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$keterangan\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log); }

                }

                xfilter = xfilter & xcolfilter;
            }

            var _items = _laporan.Find(xfilter, new FindOptions() { Collation = new Collation("en_US", numericOrdering: true) });
            var total_count = _items.CountDocuments();

            switch (sort)
            {
                case "nomor": _items = (order == "asc") ? _items.SortBy(t => t.nomor) : _items.SortByDescending(t => t.nomor); break;
                case "date": _items = (order == "asc") ? _items.SortBy(t => t.date) : _items.SortByDescending(t => t.date); break;
                case "well": _items = (order == "asc") ? _items.SortBy(t => t.well) : _items.SortByDescending(t => t.well); break;
                case "sed": _items = (order == "asc") ? _items.SortBy(t => t.sed) : _items.SortByDescending(t => t.sed); break;
                case "water": _items = (order == "asc") ? _items.SortBy(t => t.water) : _items.SortByDescending(t => t.water); break;
                // case "cdfl": _items = (order == "asc") ? _items.SortBy(t => t.cdfl) : _items.SortByDescending(t => t.cdfl); break;
                case "sludge": _items = (order == "asc") ? _items.SortBy(t => t.sludge) : _items.SortByDescending(t => t.sludge); break;
                case "total": _items = (order == "asc") ? _items.SortBy(t => t.total) : _items.SortByDescending(t => t.total); break;
                case "api": _items = (order == "asc") ? _items.SortBy(t => t.api) : _items.SortByDescending(t => t.api); break;
                case "sg": _items = (order == "asc") ? _items.SortBy(t => t.sg) : _items.SortByDescending(t => t.sg); break;
                case "density_obs": _items = (order == "asc") ? _items.SortBy(t => t.density_obs) : _items.SortByDescending(t => t.density_obs); break;
                case "density_dua": _items = (order == "asc") ? _items.SortBy(t => t.density_dua) : _items.SortByDescending(t => t.density_dua); break;
                case "pp": _items = (order == "asc") ? _items.SortBy(t => t.pp) : _items.SortByDescending(t => t.pp); break;
                case "temperature": _items = (order == "asc") ? _items.SortBy(t => t.temperature) : _items.SortByDescending(t => t.temperature); break;
                case "visc": _items = (order == "asc") ? _items.SortBy(t => t.visc) : _items.SortByDescending(t => t.visc); break;
                case "cl": _items = (order == "asc") ? _items.SortBy(t => t.cl) : _items.SortByDescending(t => t.cl); break;
                case "rw": _items = (order == "asc") ? _items.SortBy(t => t.rw) : _items.SortByDescending(t => t.rw); break;
                case "keterangan": _items = (order == "asc") ? _items.SortBy(t => t.keterangan) : _items.SortByDescending(t => t.keterangan); break;
            }

            switch (mode)
            {
                case "":
                case null:
                    List<LaporanLab> items = _items
                    .Skip(page * pagesize)
                    .Limit(pagesize)
                    .Project<LaporanLab>(_fields).ToList();

                    return new JsonResult(new
                    {
                        total_count = total_count,
                        incomplete_result = false,
                        items = items,
                    })
                    {
                        StatusCode = StatusCodes.Status200OK
                    };

                // case "excel":
                //     return GetExcel(_items
                //     //.Limit(10000)
                //     .Project<LaporanLab>(_fields).ToList());

                default:
                    dynamic res;
                    switch (mode)
                    {
                        case "well":
                            res = _laporan.Distinct<string>(mode, xfilter).ToEnumerable().OrderBy(t => t).ToList();
                            break;
                        case "date":
                            res = _laporan.Distinct<DateTime?>(mode, xfilter).ToEnumerable().OrderByDescending(t => t).ToList();
                            break;
                        default:
                            res = _laporan.Distinct<decimal?>(mode, xfilter).ToEnumerable().OrderBy(t => t).ToList();
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

        // public ActionResult GetExcel(List<LaporanLab> items)
        // {
        //     var workbook = new ExcelPackage();
        //     var ws = workbook.Workbook.Worksheets.Add("LaporanLab");
        //     ws.Cells[1, 1].Value = "Date";
        //     ws.Cells[1, 1, 3, 1].Merge = true;
        //     ws.Cells[1, 2].Value = "Well";
        //     ws.Cells[1, 2, 3, 2].Merge = true;
        //     ws.Cells[1, 3].Value = "Pump Intake";
        //     ws.Cells[1, 3, 2, 3].Merge = true;
        //     ws.Cells[3, 3].Value = "meter";

        //     ws.Cells[1, 4].Value = "Fluid Level";
        //     ws.Cells[1, 4, 1, 5].Merge = true;
        //     ws.Cells[2, 4].Value = "Dynamic";
        //     ws.Cells[3, 4].Value = "meter";
        //     // ws.Cells[2, 5].Value = "Cor. Dynamic";
        //     // ws.Cells[3, 5].Value = "meter";
        //     ws.Cells[2, 5].Value = "Static";
        //     ws.Cells[3, 5].Value = "meter";

        //     ws.Cells[1, 6].Value = "Total Gaseous Liq. Column";
        //     ws.Cells[1, 6, 2, 6].Merge = true;
        //     ws.Cells[3, 6].Value = "meter";

        //     ws.Cells[1, 7].Value = "Equivalent Gas Free Liq";
        //     ws.Cells[1, 7, 2, 7].Merge = true;
        //     ws.Cells[3, 7].Value = "meter";

        //     ws.Cells[1, 8].Value = "Liquid";
        //     ws.Cells[1, 8, 2, 8].Merge = true;
        //     ws.Cells[3, 8].Value = "meter";

        //     ws.Cells[1, 9].Value = "THP";
        //     ws.Cells[1, 9, 2, 9].Merge = true;
        //     ws.Cells[3, 9].Value = "meter";

        //     ws.Cells[1, 10].Value = "SPM";
        //     ws.Cells[1, 10, 2, 10].Merge = true;
        //     ws.Cells[3, 10].Value = "meter";

        //     ws.Cells[1, 11].Value = "Cassing Pressure";
        //     ws.Cells[1, 11, 2, 11].Merge = true;
        //     ws.Cells[3, 11].Value = "meter";

        //     ws.Cells[1, 12].Value = "Annular Gas Flow";
        //     ws.Cells[1, 12, 2, 12].Merge = true;
        //     ws.Cells[3, 12].Value = "meter";

        //     ws.Cells[1, 13].Value = "PBHP";
        //     ws.Cells[1, 13, 2, 13].Merge = true;
        //     ws.Cells[3, 13].Value = "meter";

        //     ws.Cells[1, 14].Value = "SBHP";
        //     ws.Cells[1, 14, 2, 14].Merge = true;
        //     ws.Cells[3, 14].Value = "meter";

        //     ws.Cells[1, 15].Value = "TIME";
        //     ws.Cells[1, 15, 2, 15].Merge = true;
        //     ws.Cells[3, 15].Value = "meter";

        //     ws.Cells[1, 16].Value = "Keterangan";
        //     ws.Cells[1, 16, 2, 16].Merge = true;

        //     ws.Cells[1, 1, 1, 16].Style.Font.Bold = true;
        //     ws.Cells[1, 1, 3, 16].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
        //     ws.Cells[1, 1, 3, 16].Style.VerticalAlignment = ExcelVerticalAlignment.Top;

        //     for (int c = 1; c <= 16; c++)
        //     {
        //         //ws.Column(c).AutoFit();
        //     }

        //     for (int i = 0; i < items.Count(); i++)
        //     {
        //         var t = items.ElementAt(i);
        //         ws.Cells[4 + i, 1].Style.Numberformat.Format = "d-MMM-yy";
        //         ws.Cells[4 + i, 1].Value = t.date.HasValue ? t.date.Value.ToLocalTime().ToOADate() : (double?)null;
        //         ws.Cells[4 + i, 2].Value = t.well;
        //         ws.Cells[4 + i, 3].Value = t.pump_intake;
        //         ws.Cells[4 + i, 4].Value = t.dfl;
        //         // ws.Cells[4 + i, 5].Value = t.cdfl;
        //         ws.Cells[4 + i, 5].Value = t.sfl;
        //         ws.Cells[4 + i, 6].Value = t.tglc;
        //         ws.Cells[4 + i, 7].Value = t.egfl;
        //         ws.Cells[4 + i, 8].Value = t.al;
        //         ws.Cells[4 + i, 9].Value = t.thp;
        //         ws.Cells[4 + i, 10].Value = t.spm;
        //         ws.Cells[4 + i, 11].Value = t.cp;
        //         ws.Cells[4 + i, 12].Value = t.agf;
        //         ws.Cells[4 + i, 13].Value = t.pbhp;
        //         ws.Cells[4 + i, 14].Value = t.sbhp;
        //         ws.Cells[4 + i, 15].Value = t.time;
        //         ws.Cells[4 + i, 16].Value = t.keterangan;
        //     }

        //     MemoryStream memoryStream = new MemoryStream(workbook.GetAsByteArray());
        //     memoryStream.Position = 0;
        //     return File(memoryStream, "application/vnd.ms-excel", "LaporanLab.xlsx");
        // }

        [Authorize("PeLaporanLab Add")]
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

            List<LaporanLab> items = new List<LaporanLab>();
            int error_count = 0;

            for (var r = 3; r <= rowCount; r++)
            {
                if (!string.IsNullOrWhiteSpace(ws.Cells[r, 1].Value?.ToString()))
                {
                    LaporanLab _row = new LaporanLab();
                    LaporanLabError _row_error = new LaporanLabError();
                    int last_error_count = error_count;

                    if (!String.IsNullOrWhiteSpace(ws.Cells[r, 2].Value?.ToString()))
                    {
                        try
                        {
                            if (ws.Cells[r, 2].Value.GetType() == DateTime.Now.GetType())
                            {
                                _row.date = (DateTime?)ws.Cells[r, 2].Value;
                            }
                            else
                            {
                                _row.date = DateTime.FromOADate(double.Parse(ws.Cells[r, 2].Value?.ToString().Trim()));
                            }
                        }
                        catch (Exception e)
                        {
                            _row_error.date = new ErrorItem { value = ws.Cells[r, 2].Value?.ToString(), message = e.Message };
                            error_count++;
                        }
                    }
                    else
                    {
                        _row_error.date = new ErrorItem { value = "(Blank)", message = "Blank date is not allowed" };
                        error_count++;
                    }

                    var stringMappings = new[]
                    {
                        // new { key = "nomor", col = 1, required = true, errorMsg = "ID wajib diisi"},
                        new { key = "well", col = 3, required = true, errorMsg = "" },
                        new { key = "api", col = 8, required = false, errorMsg = "" },
                        new { key = "keterangan", col = 17, required = false, errorMsg = "" },
                        new { key = "pp", col = 12, required = false, errorMsg = "" },
                        new { key = "cl", col = 15, required = false, errorMsg = "" },
                    };

                    foreach (var mapping in stringMappings)
                    {
                        var rawValue = ws.Cells[r, mapping.col].Value;
                        var strValue = rawValue?.ToString().Trim();

                        var prop = typeof(LaporanLab).GetProperty(mapping.key);
                        var errorProp = typeof(LaporanLabError).GetProperty(mapping.key);

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

                        new { key = "nomor", col = 1 },
                        new { key = "sed", col = 4 },
                        new { key = "water", col = 5 },
                        new { key = "sludge", col = 6 },
                        new { key = "total", col = 7 },
                        new { key = "sg", col = 9 },
                        new { key = "density_obs", col = 10 },
                        new { key = "density_dua", col = 11 },
                        new { key = "temperature", col = 13 },
                        new { key = "visc", col = 14 },
                        new { key = "rw", col = 16 },
                    };

                    foreach (var mapping in mappings)
                    {
                        var rawValue = ws.Cells[r, mapping.col].Value;

                        // If empty → null
                        if (rawValue == null || string.IsNullOrWhiteSpace(rawValue.ToString()))
                        {
                            typeof(LaporanLab).GetProperty(mapping.key)?.SetValue(_row, null);
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
                            typeof(LaporanLab).GetProperty(mapping.key)?.SetValue(_row, num);
                        }
                        else
                        {
                            typeof(LaporanLab).GetProperty(mapping.key)?.SetValue(_row, null);

                            typeof(LaporanLabError).GetProperty(mapping.key)?.SetValue(
                                _row_error,
                                new ErrorItem
                                {
                                    value = strValue,
                                    message = "Invalid number"
                                }
                            );

                            error_count++;
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

            LaporanLabTmp _tmp = new LaporanLabTmp
            {
                error_count = error_count,
                items = items.ToArray()
            };
            _laporan_tmp.InsertOne(_tmp);

            return Ok(new
            {
                _id = _tmp._id,
                //items = items,
                error_count = error_count
            });
        }

        [Authorize("PeLaporanLab Add")]
        [HttpGet("Tmp")]
        public ActionResult GetTmp(string _id, String sort = "date", String order = "desc", int page = 0, int pagesize = 50, String filter = "", String columnfilter = "", string mode = "")
        {
            LaporanLabTmp _tmp = _laporan_tmp.Find(t => t._id == _id).FirstOrDefault();
            List<LaporanLab> _tmpitems = _tmp.items.ToList();
            if (mode == "error")
            {
                _tmpitems = _tmpitems.Where(r => r._error._row?.value == "error").ToList();
            }
            else if (mode == "warning")
            {
                _tmpitems = _tmpitems.Where(r => r._error._row?.value == "warning").ToList();
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
                List<LaporanLab> items = _tmpitems.ToList().GetRange(page * pagesize, pagesize);
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

        [Authorize("PeLaporanLab Add")]
        [HttpGet("SaveData")]
        public ActionResult SaveData(string _id)
        {
            try
            {
                LaporanLabTmp _tmp = _laporan_tmp.Find(t => t._id == _id).FirstOrDefault();

                if (_tmp == null || _tmp.error_count > 0)
                {
                    throw new Exception();
                }

                List<LaporanLab> items = _tmp.items.ToList();

                DateTime? min_date = items.Select(m => m.date).Min();
                string[] wells = items.Select(m => m.well).ToArray();

                long created_count = 0;
                foreach (LaporanLab item in items)
                {
                    item._error = null;

                    var insert = new LaporanLab()
                    {
                        nomor = item.nomor,
                        date = item.date,
                        well = item.well,
                        sed = item.sed,
                        water = item.water,
                        sludge = item.sludge,
                        // cdfl = item.cdfl,
                        total = item.total,
                        api = item.api,
                        sg = item.sg,
                        density_obs = item.density_obs,
                        density_dua = item.density_dua,
                        pp = item.pp,
                        temperature = item.temperature,
                        visc = item.visc,
                        cl = item.cl,
                        rw = item.rw,
                        keterangan = item.keterangan,
                        updated_by = User.Identity.Name,
                        updated_date = DateTime.Now,
                        created_by = User.Identity.Name,
                        created_date = DateTime.Now
                    };
                    _laporan.InsertOne(insert);
                    created_count++;
                }
                _laporan_tmp.DeleteOne(d => d._id == _id);

                // long modified_count = DailyCommon.RecalculateFields(min_date, wells, User.Identity.Name);

                return Ok(new
                {
                    created_count = created_count,
                    // modified_count = modified_count,
                    total_count = items.Count()
                });
            }
            catch (Exception e)
            {
                return BadRequest();
            }
        }

        [Authorize("PeLaporanLab Delete")]
        [HttpDelete]
        public ActionResult Delete(string[] _ids)
        {
            try
            {
                long deleted_count = 0;
                long total_count = _ids.Length;
                foreach (string _id in _ids)
                {
                    DeleteResult res = _laporan.DeleteOne(t => t._id == _id);
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