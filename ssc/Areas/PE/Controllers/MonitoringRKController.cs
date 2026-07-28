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
using System.Text.RegularExpressions;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System.IO;

namespace ssc.Areas.PE.Controllers
{
    [Route("api/pe/[controller]")]
    [ApiController]
    public class MonitoringRKController : ControllerBase
    {
        private readonly IMongoCollection<MonitoringRK> _monitoring_rk;
        private readonly IMongoCollection<MonitoringRKTmp> _monitoring_rk_tmp;
        private readonly IMongoDatabase _database;

        public MonitoringRKController(IPEDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            _database = client.GetDatabase(settings.DatabaseName);
            _monitoring_rk = _database.GetCollection<MonitoringRK>("monitoring_rk");
            _monitoring_rk_tmp = _database.GetCollection<MonitoringRKTmp>("monitoring_rk_tmp");
        }

        [Authorize("PeMonitoringRK Read")]
        [HttpGet]
        public ActionResult Get(
            String sort = "plan_start",
            String order = "desc",
            int page = 0,
            int pagesize = 50,
            String filter = "",
            String columnfilter = "",
            string mode = "",
            DateTime? start_date = null,
            DateTime? end_date = null,
            string chart_type = "",
            string wells = ""
            )
        {
            FilterDefinition<MonitoringRK> xfilter = Builders<MonitoringRK>.Filter.Ne("a", "b");
            FilterDefinition<MonitoringRK> xcolfilter;
            if (!String.IsNullOrWhiteSpace(filter))
            {
                filter = filter.ToLower();
                xfilter =
                    Builders<MonitoringRK>.Filter.Regex(t => t.well, new BsonRegularExpression(filter, "i")) |
                    Builders<MonitoringRK>.Filter.Regex(t => t.job, new BsonRegularExpression(filter, "i")) |
                    Builders<MonitoringRK>.Filter.Regex(t => t.rig, new BsonRegularExpression(filter, "i")) |
                    Builders<MonitoringRK>.Filter.Regex(t => t.remarks, new BsonRegularExpression(filter, "i")) |
                    Builders<MonitoringRK>.Filter.Regex(t => t.plan_start, new BsonRegularExpression(filter, "i")) |
                    Builders<MonitoringRK>.Filter.Regex(t => t.plan_end, new BsonRegularExpression(filter, "i"));
            }

            if (!String.IsNullOrWhiteSpace(columnfilter))
            {
                xcolfilter = Builders<MonitoringRK>.Filter.Ne("a", "b");
                MonitoringRKList colfilter = JsonConvert.DeserializeObject<MonitoringRKList>(columnfilter);

                if (colfilter.well?.ToList().Count(c => !(c is JObject)) > 0)
                    xcolfilter = xcolfilter & Builders<MonitoringRK>.Filter.Or(colfilter.well.ToList().Where(c => !(c is JObject)).Select(c => Builders<MonitoringRK>.Filter.Regex(t => t.well, new BsonRegularExpression((string)c, "i"))));

                if (colfilter.job?.ToList().Count(c => !(c is JObject)) > 0)
                    xcolfilter = xcolfilter & Builders<MonitoringRK>.Filter.Or(colfilter.job.ToList().Where(c => !(c is JObject)).Select(c => Builders<MonitoringRK>.Filter.Regex(t => t.job, new BsonRegularExpression((string)c, "i"))));

                if (colfilter.rig?.ToList().Count(c => !(c is JObject)) > 0)
                    xcolfilter = xcolfilter & Builders<MonitoringRK>.Filter.Or(colfilter.rig.ToList().Where(c => !(c is JObject)).Select(c => Builders<MonitoringRK>.Filter.Regex(t => t.rig, new BsonRegularExpression((string)c, "i"))));

                if (colfilter.plan_start?.ToList().Count(c => !(c is JObject)) > 0)
                    xcolfilter = xcolfilter & Builders<MonitoringRK>.Filter.Or(colfilter.plan_start.ToList().Select(c => (c is DateTime) ? Builders<MonitoringRK>.Filter.Eq(t => t.plan_start, new BsonDateTime((DateTime)c)) : "{$expr:{$regexMatch:{input:{$dateToString:{format:\"%d %m %Y\",date:\"$plan_start\",timezone:\"" + TimeZoneInfo.Local.DisplayName.Substring(4, 6) + "\"}},regex:/" + (string)c + "/i}}}"));

                if (colfilter.plan_end?.ToList().Count(c => !(c is JObject)) > 0)
                    xcolfilter = xcolfilter & Builders<MonitoringRK>.Filter.Or(colfilter.plan_end.ToList().Select(c => (c is DateTime) ? Builders<MonitoringRK>.Filter.Eq(t => t.plan_end, new BsonDateTime((DateTime)c)) : "{$expr:{$regexMatch:{input:{$dateToString:{format:\"%d %m %Y\",date:\"$plan_end\",timezone:\"" + TimeZoneInfo.Local.DisplayName.Substring(4, 6) + "\"}},regex:/" + (string)c + "/i}}}"));

                if (colfilter.remarks?.ToList().Count(c => !(c is JObject)) > 0)
                    xcolfilter = xcolfilter & Builders<MonitoringRK>.Filter.Or(colfilter.remarks.ToList().Where(c => !(c is JObject)).Select(c => Builders<MonitoringRK>.Filter.Regex(t => t.remarks, new BsonRegularExpression((string)c, "i"))));

                xfilter = xfilter & xcolfilter;
            }

            var _items = _monitoring_rk.Find(xfilter, new FindOptions() { Collation = new Collation("en_US", numericOrdering: true) });

            var total_count = _items.CountDocuments();

            switch (sort)
            {
                case "well": _items = (order == "asc") ? _items.SortBy(t => t.well) : _items.SortByDescending(t => t.well); break;
                case "job": _items = (order == "asc") ? _items.SortBy(t => t.job) : _items.SortByDescending(t => t.job); break;
                case "rig": _items = (order == "asc") ? _items.SortBy(t => t.rig) : _items.SortByDescending(t => t.rig); break;
                case "plan_start": _items = (order == "asc") ? _items.SortBy(t => t.plan_start) : _items.SortByDescending(t => t.plan_start); break;
                case "plan_end": _items = (order == "asc") ? _items.SortBy(t => t.plan_end) : _items.SortByDescending(t => t.plan_end); break;
                case "remarks": _items = (order == "asc") ? _items.SortBy(t => t.remarks) : _items.SortByDescending(t => t.remarks); break;
            }

            switch (mode)
            {
                case "":
                case null:
                    // Filter: hanya non-rigless (tabel RIG tidak boleh menampilkan rigless)
                    var rigRigFilter = Builders<MonitoringRK>.Filter.Not(
                        Builders<MonitoringRK>.Filter.Regex(t => t.rig, new BsonRegularExpression("rigless", "i"))
                    );
                    var rigFilteredXFilter = xfilter & rigRigFilter;

                    // Ambil semua MonitoringRK yang terfilter (tanpa pagination) untuk di-merge
                    var allFilteredRk = _monitoring_rk.Find(rigFilteredXFilter).ToList();

                    // Kumpulkan well yang sudah ada di MonitoringRK (untuk cek duplikat)
                    var rkWells = new HashSet<string>(allFilteredRk
                        .Where(r => !string.IsNullOrEmpty(r.well))
                        .Select(r => r.well));

                    // Ambil data Barchart dengan text filter + column filter yang sama
                    var barchartCollection = _database.GetCollection<Barchart>("barchart");
                    FilterDefinition<Barchart> bcFilter = Builders<Barchart>.Filter.Ne("a", "b");
                    if (!String.IsNullOrWhiteSpace(filter))
                    {
                        var lowerFilter = filter.ToLower();
                        bcFilter =
                            Builders<Barchart>.Filter.Regex(t => t.well, new BsonRegularExpression(lowerFilter, "i")) |
                            Builders<Barchart>.Filter.Regex(t => t.job, new BsonRegularExpression(lowerFilter, "i")) |
                            Builders<Barchart>.Filter.Regex(t => t.rig, new BsonRegularExpression(lowerFilter, "i")) |
                            Builders<Barchart>.Filter.Regex(t => t.remarks, new BsonRegularExpression(lowerFilter, "i")) |
                            Builders<Barchart>.Filter.Regex(t => t.plan_start, new BsonRegularExpression(lowerFilter, "i")) |
                            Builders<Barchart>.Filter.Regex(t => t.plan_end, new BsonRegularExpression(lowerFilter, "i"));
                    }
                    // Apply column filter ke barchart
                    if (!String.IsNullOrWhiteSpace(columnfilter))
                    {
                        try
                        {
                            var cf = JObject.Parse(columnfilter);
                            if (cf["well"] != null && cf["well"].Type == JTokenType.Array)
                            {
                                var vals = cf["well"].ToObject<string[]>().Where(v => !string.IsNullOrEmpty(v)).ToArray();
                                if (vals.Length > 0)
                                    bcFilter = bcFilter & Builders<Barchart>.Filter.Or(vals.Select(v => Builders<Barchart>.Filter.Regex(t => t.well, new BsonRegularExpression("^" + v.TrimStart('^').TrimEnd('$') + "$", "i"))).ToArray());
                            }
                            if (cf["job"] != null && cf["job"].Type == JTokenType.Array)
                            {
                                var vals = cf["job"].ToObject<string[]>().Where(v => !string.IsNullOrEmpty(v)).ToArray();
                                if (vals.Length > 0)
                                    bcFilter = bcFilter & Builders<Barchart>.Filter.Or(vals.Select(v => Builders<Barchart>.Filter.Regex(t => t.job, new BsonRegularExpression("^" + v.TrimStart('^').TrimEnd('$') + "$", "i"))).ToArray());
                            }
                            if (cf["rig"] != null && cf["rig"].Type == JTokenType.Array)
                            {
                                var vals = cf["rig"].ToObject<string[]>().Where(v => !string.IsNullOrEmpty(v)).ToArray();
                                if (vals.Length > 0)
                                    bcFilter = bcFilter & Builders<Barchart>.Filter.Or(vals.Select(v => Builders<Barchart>.Filter.Regex(t => t.rig, new BsonRegularExpression("^" + v.TrimStart('^').TrimEnd('$') + "$", "i"))).ToArray());
                            }
                            if (cf["remarks"] != null && cf["remarks"].Type == JTokenType.Array)
                            {
                                var vals = cf["remarks"].ToObject<string[]>().Where(v => !string.IsNullOrEmpty(v)).ToArray();
                                if (vals.Length > 0)
                                    bcFilter = bcFilter & Builders<Barchart>.Filter.Or(vals.Select(v => Builders<Barchart>.Filter.Regex(t => t.remarks, new BsonRegularExpression("^" + v.TrimStart('^').TrimEnd('$') + "$", "i"))).ToArray());
                            }
                        }
                        catch { }
                    }
                    var allBarchart = barchartCollection.Find(bcFilter).ToList();

                    // Merge items: barchart non-rigless yang well-nya belum ada di MonitoringRK
                    var mergeItems = allBarchart
                        .Where(b => b.rig != null
                                    && !b.rig.ToLower().Contains("rigless")
                                    && !string.IsNullOrEmpty(b.well)
                                    && !rkWells.Contains(b.well))
                        .Select(b => new MonitoringRK
                        {
                            well = b.well,
                            job = b.job,
                            rig = b.rig,
                            plan_start = b.plan_start,
                            plan_end = b.plan_end,
                            remarks = null,
                            pop = null,
                            target_oil = null,
                            target_gas = null,
                            realisasi_oil = null,
                            realisasi_gas = null
                        })
                        .ToList();

                    // Gabungkan MonitoringRK + merge items untuk sorting & pagination terpadu
                    var mergedList = allFilteredRk.Concat(mergeItems).ToList();

                    // Apply sorting ke combined list
                    IEnumerable<MonitoringRK> sortedList;
                    switch (sort)
                    {
                        case "well": sortedList = (order == "asc") ? mergedList.OrderBy(t => t.well) : mergedList.OrderByDescending(t => t.well); break;
                        case "job": sortedList = (order == "asc") ? mergedList.OrderBy(t => t.job) : mergedList.OrderByDescending(t => t.job); break;
                        case "rig": sortedList = (order == "asc") ? mergedList.OrderBy(t => t.rig) : mergedList.OrderByDescending(t => t.rig); break;
                        case "plan_start": sortedList = (order == "asc") ? mergedList.OrderBy(t => t.plan_start) : mergedList.OrderByDescending(t => t.plan_start); break;
                        case "plan_end": sortedList = (order == "asc") ? mergedList.OrderBy(t => t.plan_end) : mergedList.OrderByDescending(t => t.plan_end); break;
                        case "pop": sortedList = (order == "asc") ? mergedList.OrderBy(t => t.pop) : mergedList.OrderByDescending(t => t.pop); break;
                        case "target_oil": sortedList = (order == "asc") ? mergedList.OrderBy(t => t.target_oil) : mergedList.OrderByDescending(t => t.target_oil); break;
                        case "target_gas": sortedList = (order == "asc") ? mergedList.OrderBy(t => t.target_gas) : mergedList.OrderByDescending(t => t.target_gas); break;
                        case "realisasi_oil": sortedList = (order == "asc") ? mergedList.OrderBy(t => t.realisasi_oil) : mergedList.OrderByDescending(t => t.realisasi_oil); break;
                        case "realisasi_gas": sortedList = (order == "asc") ? mergedList.OrderBy(t => t.realisasi_gas) : mergedList.OrderByDescending(t => t.realisasi_gas); break;
                        case "remarks": sortedList = (order == "asc") ? mergedList.OrderBy(t => t.remarks) : mergedList.OrderByDescending(t => t.remarks); break;
                        default: sortedList = mergedList.OrderByDescending(t => t.plan_start); break;
                    }

                    // Apply pagination ke combined list
                    var combinedTotal = mergedList.Count;
                    var pageItems = sortedList
                        .Skip(page * pagesize)
                        .Take(pagesize)
                        .ToList();

                    // Distinct values untuk autocomplete di frontend (dari semua barchart)
                    var allBarchartUnfiltered = barchartCollection
                        .Find(Builders<Barchart>.Filter.Ne("a", "b"))
                        .ToList();
                    var distinctWells = allBarchartUnfiltered
                        .Where(b => !string.IsNullOrEmpty(b.well))
                        .Select(b => b.well)
                        .Distinct()
                        .OrderBy(w => w)
                        .ToList();
                    var distinctJobs = allBarchartUnfiltered
                        .Where(b => !string.IsNullOrEmpty(b.job))
                        .Select(b => b.job)
                        .Distinct()
                        .OrderBy(j => j)
                        .ToList();
                    var distinctRigs = allBarchartUnfiltered
                        .Where(b => !string.IsNullOrEmpty(b.rig))
                        .Select(b => b.rig)
                        .Distinct()
                        .OrderBy(r => r)
                        .ToList();

                    return new JsonResult(new
                    {
                        total_count = combinedTotal,
                        incomplete_result = false,
                        items = pageItems,
                        distinct_wells = distinctWells,
                        distinct_jobs = distinctJobs,
                        distinct_rigs = distinctRigs,
                    })
                    {
                        StatusCode = StatusCodes.Status200OK
                    };

                case "chart":
                    // Filter rig type (dipakai untuk chartData DAN untuk distinct_wells)
                    FilterDefinition<MonitoringRK> chartTypeFilter;
                    if (chart_type == "rigless")
                    {
                        chartTypeFilter = Builders<MonitoringRK>.Filter.Regex(t => t.rig, new BsonRegularExpression("rigless", "i"));
                    }
                    else if (chart_type == "rig")
                    {
                        chartTypeFilter = Builders<MonitoringRK>.Filter.And(
                            Builders<MonitoringRK>.Filter.Exists(t => t.rig),
                            Builders<MonitoringRK>.Filter.Not(Builders<MonitoringRK>.Filter.Regex(t => t.rig, new BsonRegularExpression("rigless", "i")))
                        );
                    }
                    else
                    {
                        chartTypeFilter = Builders<MonitoringRK>.Filter.Ne("a", "b");
                    }

                    // chartFilter = chartTypeFilter + wells (khusus untuk ambil data chart)
                    var chartFilter = chartTypeFilter;

                    if (!string.IsNullOrWhiteSpace(wells))
                    {
                        var wellList = wells.Split(',').Select(w => w.Trim()).Where(w => !string.IsNullOrEmpty(w)).ToArray();
                        if (wellList.Length > 0)
                        {
                            var wellFilter = Builders<MonitoringRK>.Filter.Or(
                                wellList.Select(w => Builders<MonitoringRK>.Filter.Regex(t => t.well, new BsonRegularExpression("^" + Regex.Escape(w) + "$", "i"))).ToArray()
                            );
                            chartFilter = chartFilter & wellFilter;
                        }
                    }

                    // Filter date range by pop field 
                    var combinedChartFilter = chartFilter;
                    if (start_date.HasValue && end_date.HasValue)
                    {
                        FilterDefinition<MonitoringRK> dateFilter =
                            Builders<MonitoringRK>.Filter.And(
                                Builders<MonitoringRK>.Filter.Gte(r => r.pop, start_date),
                                Builders<MonitoringRK>.Filter.Lte(r => r.pop, end_date)
                            );
                        combinedChartFilter = chartFilter & dateFilter;
                    }

                    var chartData = _monitoring_rk.Find(combinedChartFilter).ToList()
                        .Select(s => new
                        {
                            well = s.well,
                            job = s.job,
                            rig = s.rig,
                            remarks = s.remarks,
                            plan_start = s.plan_start,
                            plan_end = s.plan_end,
                            target_oil = s.target_oil,
                            target_gas = s.target_gas,
                            realisasi_oil = s.realisasi_oil,
                            realisasi_gas = s.realisasi_gas
                        });

                    var barchartCollectionForChart = _database.GetCollection<Barchart>("barchart");
                    FilterDefinition<Barchart> bcChartTypeFilter;
                    if (chart_type == "rigless")
                    {
                        bcChartTypeFilter = Builders<Barchart>.Filter.Regex(t => t.rig, new BsonRegularExpression("rigless", "i"));
                    }
                    else if (chart_type == "rig")
                    {
                        bcChartTypeFilter = Builders<Barchart>.Filter.And(
                            Builders<Barchart>.Filter.Exists(t => t.rig),
                            Builders<Barchart>.Filter.Not(Builders<Barchart>.Filter.Regex(t => t.rig, new BsonRegularExpression("rigless", "i")))
                        );
                    }
                    else
                    {
                        bcChartTypeFilter = Builders<Barchart>.Filter.Ne("a", "b");
                    }

                    var rkWellsForType = _monitoring_rk
                        .Find(chartTypeFilter)
                        .ToList()
                        .Where(s => !string.IsNullOrEmpty(s.well))
                        .Select(s => s.well);

                    var bcWellsForType = barchartCollectionForChart
                        .Find(bcChartTypeFilter)
                        .ToList()
                        .Where(b => !string.IsNullOrEmpty(b.well))
                        .Select(b => b.well);

                    var distinctWellsChart = rkWellsForType
                        .Union(bcWellsForType)
                        .Distinct()
                        .OrderBy(w => w)
                        .ToList();

                    var distinctPopDates = _monitoring_rk
                        .Find(chartFilter)
                        .ToList()
                        .Select(s => s.pop)
                        .Where(d => d.HasValue)
                        .Select(d => d.Value)
                        .Distinct()
                        .OrderBy(d => d)
                        .ToList();

                    return Ok(new { data = chartData, distinct_wells = distinctWellsChart, distinct_pop_dates = distinctPopDates });

                case "excel":
                    return GetExcel(_items.ToList());

                default:
                    dynamic res;
                    var bcCollection = _database.GetCollection<Barchart>("barchart");

                    // Bangun filter untuk Barchart dari columnfilter (untuk xFilter search)
                    FilterDefinition<Barchart> xfBcFilter = Builders<Barchart>.Filter.Ne("a", "b");
                    if (!string.IsNullOrWhiteSpace(columnfilter) && !string.IsNullOrWhiteSpace(mode))
                    {
                        try
                        {
                            var cf = JObject.Parse(columnfilter);
                            if (cf[mode] != null && cf[mode].Type == JTokenType.Array)
                            {
                                var searchVals = cf[mode].ToObject<string[]>();
                                if (searchVals.Length > 0)
                                {
                                    var pattern = string.Join("|", searchVals.Select(v => v.TrimStart('^').TrimEnd('$')));
                                    xfBcFilter = xfBcFilter & Builders<Barchart>.Filter.Regex(mode, new BsonRegularExpression(pattern, "i"));
                                }
                            }
                        }
                        catch { }
                    }

                    switch (mode)
                    {
                        case "well":
                        case "job":
                        case "remarks":
                            var rkDistinct = _monitoring_rk.Distinct<string>(mode, xfilter).ToEnumerable().ToList();
                            var bcDistinct = bcCollection.Distinct<string>(mode, xfBcFilter).ToEnumerable().ToList();
                            res = rkDistinct.Union(bcDistinct).OrderBy(t => t).ToList();
                            break;
                        case "rig":
                            // Filter khusus RIG: exclude rigless agar tidak muncul di xFilter kolom RIG
                            var rigExcludeFilter = xfilter & Builders<MonitoringRK>.Filter.Not(
                                Builders<MonitoringRK>.Filter.Regex(t => t.rig, new BsonRegularExpression("rigless", "i"))
                            );
                            var rkRigDistinct = _monitoring_rk.Distinct<string>("rig", rigExcludeFilter).ToEnumerable().ToList();
                            var bcRigExcludeFilter = xfBcFilter & Builders<Barchart>.Filter.Not(
                                Builders<Barchart>.Filter.Regex(t => t.rig, new BsonRegularExpression("rigless", "i"))
                            );
                            var bcRigDistinct = bcCollection.Distinct<string>("rig", bcRigExcludeFilter).ToEnumerable().ToList();
                            res = rkRigDistinct.Union(bcRigDistinct).OrderBy(t => t).ToList();
                            break;
                        case "plan_start":
                        case "plan_end":
                            var rkDates = _monitoring_rk.Distinct<DateTime?>(mode, xfilter).ToEnumerable().ToList();
                            var bcDates = bcCollection.Distinct<DateTime?>(mode, xfBcFilter).ToEnumerable().ToList();
                            res = rkDates.Union(bcDates).OrderByDescending(t => t).ToList();
                            break;
                        case "pop":
                            res = _monitoring_rk.Distinct<DateTime?>(mode, xfilter).ToEnumerable().OrderByDescending(t => t).ToList();
                            break;
                        case "target_oil":
                        case "target_gas":
                        case "realisasi_oil":
                        case "realisasi_gas":
                            res = _monitoring_rk.Distinct<decimal?>(mode, xfilter).ToEnumerable().OrderByDescending(t => t).ToList();
                            break;
                        default:
                            res = _monitoring_rk.Distinct<string>(mode, xfilter).ToEnumerable().OrderBy(t => t).ToList();
                            break;
                    }
                    return new JsonResult(new
                    {
                        total_count = total_count,
                        incomplete_result = false,
                        items = res,
                    })
                    {
                        StatusCode = StatusCodes.Status200OK
                    };
            }
        }

        [Authorize("PeMonitoringRK Read")]
        [HttpGet("rigless")]
        public ActionResult GetRigless(String sort = "plan_start", String order = "desc", int page = 0, int pagesize = 50, String filter = "", String columnfilter = "", string mode = "")
        {
            var barchartCollection = _database.GetCollection<Barchart>("barchart");

            // Ambil monitoring_rk dengan rig=Rigless
            FilterDefinition<MonitoringRK> rkFilter = Builders<MonitoringRK>.Filter.Regex(t => t.rig, new BsonRegularExpression("rigless", "i"));
            FilterDefinition<Barchart> bcFilter = Builders<Barchart>.Filter.Regex(t => t.rig, new BsonRegularExpression("rigless", "i"));

            // Text filter
            if (!String.IsNullOrWhiteSpace(filter))
            {
                filter = filter.ToLower();
                var rkTextFilter =
                    Builders<MonitoringRK>.Filter.Regex(t => t.well, new BsonRegularExpression(filter, "i")) |
                    Builders<MonitoringRK>.Filter.Regex(t => t.job, new BsonRegularExpression(filter, "i")) |
                    Builders<MonitoringRK>.Filter.Regex(t => t.remarks, new BsonRegularExpression(filter, "i")) |
                    Builders<MonitoringRK>.Filter.Regex(t => t.plan_start, new BsonRegularExpression(filter, "i")) |
                    Builders<MonitoringRK>.Filter.Regex(t => t.plan_end, new BsonRegularExpression(filter, "i"));
                rkFilter = rkFilter & rkTextFilter;

                var bcTextFilter =
                    Builders<Barchart>.Filter.Regex(t => t.well, new BsonRegularExpression(filter, "i")) |
                    Builders<Barchart>.Filter.Regex(t => t.job, new BsonRegularExpression(filter, "i")) |
                    Builders<Barchart>.Filter.Regex(t => t.remarks, new BsonRegularExpression(filter, "i")) |
                    Builders<Barchart>.Filter.Regex(t => t.plan_start, new BsonRegularExpression(filter, "i")) |
                    Builders<Barchart>.Filter.Regex(t => t.plan_end, new BsonRegularExpression(filter, "i"));
                bcFilter = bcFilter & bcTextFilter;
            }

            // Column filter (hanya untuk kolom yang ada di barchart)
            if (!String.IsNullOrWhiteSpace(columnfilter))
            {
                try
                {
                    var cf = JObject.Parse(columnfilter);
                    if (cf["well"] != null && cf["well"].Type == JTokenType.Array)
                    {
                        var vals = cf["well"].ToObject<string[]>().Where(v => !string.IsNullOrEmpty(v)).ToArray();
                        if (vals.Length > 0)
                        {
                            var rkWellFilter = Builders<MonitoringRK>.Filter.Or(vals.Select(v => Builders<MonitoringRK>.Filter.Regex(t => t.well, new BsonRegularExpression("^" + v.TrimStart('^').TrimEnd('$') + "$", "i"))).ToArray());
                            var bcWellFilter = Builders<Barchart>.Filter.Or(vals.Select(v => Builders<Barchart>.Filter.Regex(t => t.well, new BsonRegularExpression("^" + v.TrimStart('^').TrimEnd('$') + "$", "i"))).ToArray());
                            rkFilter = rkFilter & rkWellFilter;
                            bcFilter = bcFilter & bcWellFilter;
                        }
                    }
                    if (cf["job"] != null && cf["job"].Type == JTokenType.Array)
                    {
                        var vals = cf["job"].ToObject<string[]>().Where(v => !string.IsNullOrEmpty(v)).ToArray();
                        if (vals.Length > 0)
                        {
                            var rkJobFilter = Builders<MonitoringRK>.Filter.Or(vals.Select(v => Builders<MonitoringRK>.Filter.Regex(t => t.job, new BsonRegularExpression("^" + v.TrimStart('^').TrimEnd('$') + "$", "i"))).ToArray());
                            var bcJobFilter = Builders<Barchart>.Filter.Or(vals.Select(v => Builders<Barchart>.Filter.Regex(t => t.job, new BsonRegularExpression("^" + v.TrimStart('^').TrimEnd('$') + "$", "i"))).ToArray());
                            rkFilter = rkFilter & rkJobFilter;
                            bcFilter = bcFilter & bcJobFilter;
                        }
                    }
                    if (cf["rig"] != null && cf["rig"].Type == JTokenType.Array)
                    {
                        var vals = cf["rig"].ToObject<string[]>().Where(v => !string.IsNullOrEmpty(v)).ToArray();
                        if (vals.Length > 0)
                        {
                            var rkRigFilter = Builders<MonitoringRK>.Filter.Or(vals.Select(v => Builders<MonitoringRK>.Filter.Regex(t => t.rig, new BsonRegularExpression("^" + v.TrimStart('^').TrimEnd('$') + "$", "i"))).ToArray());
                            var bcRigFilter = Builders<Barchart>.Filter.Or(vals.Select(v => Builders<Barchart>.Filter.Regex(t => t.rig, new BsonRegularExpression("^" + v.TrimStart('^').TrimEnd('$') + "$", "i"))).ToArray());
                            rkFilter = rkFilter & rkRigFilter;
                            bcFilter = bcFilter & bcRigFilter;
                        }
                    }
                    if (cf["remarks"] != null && cf["remarks"].Type == JTokenType.Array)
                    {
                        var vals = cf["remarks"].ToObject<string[]>().Where(v => !string.IsNullOrEmpty(v)).ToArray();
                        if (vals.Length > 0)
                        {
                            var rkRemarksFilter = Builders<MonitoringRK>.Filter.Or(vals.Select(v => Builders<MonitoringRK>.Filter.Regex(t => t.remarks, new BsonRegularExpression("^" + v.TrimStart('^').TrimEnd('$') + "$", "i"))).ToArray());
                            var bcRemarksFilter = Builders<Barchart>.Filter.Or(vals.Select(v => Builders<Barchart>.Filter.Regex(t => t.remarks, new BsonRegularExpression("^" + v.TrimStart('^').TrimEnd('$') + "$", "i"))).ToArray());
                            rkFilter = rkFilter & rkRemarksFilter;
                            bcFilter = bcFilter & bcRemarksFilter;
                        }
                    }
                }
                catch { }
            }

            // Jika mode adalah nama kolom, kembalikan distinct values untuk xFilter
            if (!string.IsNullOrWhiteSpace(mode))
            {
                dynamic distinctRes;
                switch (mode)
                {
                    case "well":
                    case "job":
                    case "rig":
                    case "remarks":
                        var rkStr = _monitoring_rk.Distinct<string>(mode, rkFilter).ToEnumerable().ToList();
                        var bcStr = barchartCollection.Distinct<string>(mode, bcFilter).ToEnumerable().ToList();
                        distinctRes = rkStr.Union(bcStr).OrderBy(t => t).ToList();
                        break;
                    case "plan_start":
                    case "plan_end":
                    case "pop":
                        var rkDt = _monitoring_rk.Distinct<DateTime?>(mode, rkFilter).ToEnumerable()
                            .Where(d => d.HasValue).Select(d => d.Value.ToString("yyyy-MM-dd")).ToList();
                        var bcDt = barchartCollection.Distinct<DateTime?>(mode, bcFilter).ToEnumerable()
                            .Where(d => d.HasValue).Select(d => d.Value.ToString("yyyy-MM-dd")).ToList();
                        distinctRes = rkDt.Union(bcDt).OrderByDescending(d => d).ToList();
                        break;
                    case "target_oil":
                    case "target_gas":
                    case "realisasi_oil":
                    case "realisasi_gas":
                        distinctRes = _monitoring_rk.Distinct<decimal?>(mode, rkFilter).ToEnumerable()
                            .Where(d => d.HasValue).Select(d => d.Value.ToString()).OrderByDescending(d => d).ToList();
                        break;
                    default:
                        distinctRes = _monitoring_rk.Distinct<string>(mode, rkFilter).ToEnumerable().OrderBy(t => t).ToList();
                        break;
                }
                return new JsonResult(new
                {
                    total_count = 0,
                    incomplete_result = false,
                    items = distinctRes,
                })
                { StatusCode = StatusCodes.Status200OK };
            }

            // Mode data: ambil data rigless + pagination
            var rkRiglessItems = _monitoring_rk.Find(rkFilter).ToList();
            var bcRiglessItems = barchartCollection.Find(bcFilter).ToList();

            // Gabung: ambil barchart rigless yang well-nya belum ada di monitoring_rk
            var rkWells = new HashSet<string>(rkRiglessItems
                .Where(r => !string.IsNullOrEmpty(r.well))
                .Select(r => r.well));

            var allItems = rkRiglessItems.Concat(
                bcRiglessItems
                    .Where(b => !string.IsNullOrEmpty(b.well) && !rkWells.Contains(b.well))
                    .Select(b => new MonitoringRK
                    {
                        well = b.well,
                        job = b.job,
                        rig = b.rig,
                        plan_start = b.plan_start,
                        plan_end = b.plan_end
                    })
            ).ToList();

            var total_count = allItems.Count;

            // Sorting
            IEnumerable<MonitoringRK> sortedList;
            switch (sort)
            {
                case "well": sortedList = (order == "asc") ? allItems.OrderBy(t => t.well) : allItems.OrderByDescending(t => t.well); break;
                case "job": sortedList = (order == "asc") ? allItems.OrderBy(t => t.job) : allItems.OrderByDescending(t => t.job); break;
                case "rig": sortedList = (order == "asc") ? allItems.OrderBy(t => t.rig) : allItems.OrderByDescending(t => t.rig); break;
                case "plan_start": sortedList = (order == "asc") ? allItems.OrderBy(t => t.plan_start) : allItems.OrderByDescending(t => t.plan_start); break;
                case "plan_end": sortedList = (order == "asc") ? allItems.OrderBy(t => t.plan_end) : allItems.OrderByDescending(t => t.plan_end); break;
                default: sortedList = allItems.OrderByDescending(t => t.plan_start); break;
            }

            // Pagination
            var pageItems = sortedList
                .Skip(page * pagesize)
                .Take(pagesize)
                .ToList();

            return new JsonResult(new
            {
                total_count = total_count,
                incomplete_result = false,
                items = pageItems,
            })
            {
                StatusCode = StatusCodes.Status200OK
            };
        }

        [Authorize("PeMonitoringRK Delete")]
        [HttpDelete]
        public ActionResult Delete([FromQuery] string[] _ids)
        {
            var result = _monitoring_rk.DeleteMany(t => _ids.Contains(t._id));
            return new JsonResult(new
            {
                deleted_count = result.DeletedCount
            })
            {
                StatusCode = StatusCodes.Status200OK
            };
        }

        [Authorize("PeMonitoringRK Add")]
        [HttpPost]
        public ActionResult Post([FromBody] MonitoringRK[] items)
        {
            if (items == null || items.Length == 0)
                return BadRequest(new { message = "No items provided" });

            foreach (var item in items)
            {
                item.created_date = DateTime.Now;
                _monitoring_rk.InsertOne(item);
            }

            return Ok(new { created_count = items.Length });
        }

        [Authorize("PeMonitoringRK Add")]
        [HttpPost("UploadFiles")]
        public async Task<IActionResult> Post(List<IFormFile> files)
        {
            long size = files.Sum(f => f.Length);
            string filePath = null;
            // var filePath = Path.Combine(Path.GetTempPath(), Path.GetRandomFileName() + extension);

            foreach (var formFile in files)
            {
                if (formFile.Length > 0)
                {
                    var extension = Path.GetExtension(formFile.FileName).ToLower();

                    if (extension != ".xlsx" && extension != ".xlsm")
                    {
                        return BadRequest("Only .xlsx and .xlsm files are allowed");
                    }

                    filePath = Path.Combine(Path.GetTempPath(), Path.GetRandomFileName() + extension);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await formFile.CopyToAsync(stream);
                    }
                }
            }
            var fi = new FileInfo(filePath);
            var workbook = new ExcelPackage(fi);
            // var ws = workbook.Workbook.Worksheets.First();
            // var ws = workbook.Workbook.Worksheets.FirstOrDefault(s => s.GetType() == typeof(ExcelWorksheet));
            // if (ws == null)
            // {
            //     return BadRequest("No valid worksheet found in the file");
            // }
            // Option 2: Get by sheet name (more reliable)
            var ws = workbook.Workbook.Worksheets["TABLE"];
            if (ws == null)
            {
                return BadRequest("Required worksheet 'TABLE' not found in the file");
            }
            int rowCount = ws.Dimension.End.Row;

            List<MonitoringRK> items = new List<MonitoringRK>();
            int error_count = 0;

            for (var r = 15; r <= rowCount; r++)
            {

                if (!string.IsNullOrWhiteSpace(ws.Cells[r, 3].Value?.ToString()))
                {
                    MonitoringRK _row = new MonitoringRK();
                    MonitoringRKError _row_error = new MonitoringRKError();
                    int last_error_count = error_count;

                    // Well (Column A) - Required
                    if (!String.IsNullOrWhiteSpace(ws.Cells[r, 3].Value?.ToString()))
                    {
                        _row.well = ws.Cells[r, 3].Value?.ToString().Trim();
                    }
                    else
                    {
                        _row_error.well = new ErrorItem { value = "(Blank)", message = "Blank well is not allowed" };
                        error_count++;
                    }

                    // Job (Column B)
                    if (!String.IsNullOrWhiteSpace(ws.Cells[r, 4].Value?.ToString()))
                    {
                        _row.job = ws.Cells[r, 4].Value?.ToString().Trim();
                    }

                    // Rig (Column C)
                    if (!String.IsNullOrWhiteSpace(ws.Cells[r, 5].Value?.ToString()))
                    {
                        _row.rig = ws.Cells[r, 5].Value?.ToString().Trim();
                    }

                    // Plan Start (Column D)
                    if (!String.IsNullOrWhiteSpace(ws.Cells[r, 6].Value?.ToString()))
                    {
                        try
                        {
                            DateTime parsedDate;
                            if (ws.Cells[r, 6].Value.GetType() == DateTime.Now.GetType())
                            {
                                parsedDate = (DateTime)ws.Cells[r, 6].Value;
                            }
                            else
                            {
                                parsedDate = DateTime.FromOADate(double.Parse(ws.Cells[r, 6].Value?.ToString().Trim()));
                            }
                            // Set jam ke 12:00 UTC agar tidak bergeser hari saat timezone conversion
                            _row.plan_start = new DateTime(parsedDate.Year, parsedDate.Month, parsedDate.Day, 12, 0, 0, DateTimeKind.Utc);
                        }
                        catch (Exception e)
                        {
                            _row_error.plan_start = new ErrorItem { value = ws.Cells[r, 6].Value?.ToString(), message = e.Message };
                            error_count++;
                        }
                    }

                    // Plan End (Column E)
                    if (!String.IsNullOrWhiteSpace(ws.Cells[r, 7].Value?.ToString()))
                    {
                        try
                        {
                            DateTime parsedDate;
                            if (ws.Cells[r, 7].Value.GetType() == DateTime.Now.GetType())
                            {
                                parsedDate = (DateTime)ws.Cells[r, 7].Value;
                            }
                            else
                            {
                                parsedDate = DateTime.FromOADate(double.Parse(ws.Cells[r, 7].Value?.ToString().Trim()));
                            }
                            // Set jam ke 12:00 UTC agar tidak bergeser hari saat timezone conversion
                            _row.plan_end = new DateTime(parsedDate.Year, parsedDate.Month, parsedDate.Day, 12, 0, 0, DateTimeKind.Utc);
                        }
                        catch (Exception e)
                        {
                            _row_error.plan_end = new ErrorItem { value = ws.Cells[r, 7].Value?.ToString(), message = e.Message };
                            error_count++;
                        }
                    }

                    // Remarks (Column F)
                    if (!String.IsNullOrWhiteSpace(ws.Cells[r, 8].Value?.ToString()))
                    {
                        _row.remarks = ws.Cells[r, 8].Value?.ToString().Trim();
                    }

                    // Check for existing data
                    if (_row_error.well == null && _row.plan_start != null && _row.plan_end != null)
                    {
                        if (_monitoring_rk.Find(t => t.well == _row.well && t.plan_start == _row.plan_start && t.plan_end == _row.plan_end).CountDocuments() > 0)
                        {
                            _row_error._row = new ErrorItem { value = "warning", message = "Existing row found, data will be replaced" };
                        }
                    }

                    if (error_count > last_error_count)
                    {
                        _row_error._row = new ErrorItem { value = "error", message = "Error found" };
                    }

                    _row._error = _row_error;
                    _row.created_date = DateTime.Now;
                    items.Add(_row);
                }
            }

            // Clean up temp file after processing
            if (filePath != null && System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }

            MonitoringRKTmp _tmp = new MonitoringRKTmp
            {
                error_count = error_count,
                upload_date = DateTime.Now,
                items = items.ToArray()
            };
            _monitoring_rk_tmp.InsertOne(_tmp);

            return Ok(new
            {
                _id = _tmp._id,
                error_count = error_count
            });

        }

        [Authorize("PeMonitoringRK Add")]
        [HttpGet("Tmp")]
        public ActionResult GetTmp(string _id, String sort = "well", String order = "asc", int page = 0, int pagesize = 50, String filter = "", String columnfilter = "", string mode = "")
        {
            MonitoringRKTmp _tmp = _monitoring_rk_tmp.Find(t => t._id == _id).FirstOrDefault();
            if (_tmp == null)
            {
                return NotFound(new { message = "Tmp data not found" });
            }

            List<MonitoringRK> _tmpitems = _tmp.items.ToList();

            if (mode == "error")
            {
                _tmpitems = _tmpitems.Where(t => t._error != null && t._error._row != null).ToList();
            }

            var total_count = _tmpitems.Count();
            var error_count = _tmp.items.Where(t => t._error != null && t._error._row != null && t._error._row.value == "error").Count();

            // Sorting
            switch (sort)
            {
                case "well": _tmpitems = (order == "asc") ? _tmpitems.OrderBy(t => t.well).ToList() : _tmpitems.OrderByDescending(t => t.well).ToList(); break;
                case "job": _tmpitems = (order == "asc") ? _tmpitems.OrderBy(t => t.job).ToList() : _tmpitems.OrderByDescending(t => t.job).ToList(); break;
                case "rig": _tmpitems = (order == "asc") ? _tmpitems.OrderBy(t => t.rig).ToList() : _tmpitems.OrderByDescending(t => t.rig).ToList(); break;
                case "plan_start": _tmpitems = (order == "asc") ? _tmpitems.OrderBy(t => t.plan_start).ToList() : _tmpitems.OrderByDescending(t => t.plan_start).ToList(); break;
                case "plan_end": _tmpitems = (order == "asc") ? _tmpitems.OrderBy(t => t.plan_end).ToList() : _tmpitems.OrderByDescending(t => t.plan_end).ToList(); break;
                case "remarks": _tmpitems = (order == "asc") ? _tmpitems.OrderBy(t => t.remarks).ToList() : _tmpitems.OrderByDescending(t => t.remarks).ToList(); break;
            }

            List<MonitoringRK> items = _tmpitems
                .Skip(page * pagesize)
                .Take(pagesize)
                .ToList();

            return new JsonResult(new
            {
                total_count = total_count,
                error_count = error_count,
                incomplete_result = false,
                items = items
            })
            {
                StatusCode = StatusCodes.Status200OK
            };
        }


        [Authorize("PeMonitoringRK Add")]
        [HttpGet("SaveData")]
        public ActionResult SaveData(string _id)
        {
            MonitoringRKTmp _tmp = _monitoring_rk_tmp.Find(t => t._id == _id).FirstOrDefault();
            if (_tmp == null)
            {
                return NotFound(new { message = "Tmp data not found" });
            }

            var tmpItems = _tmp.items.Where(t => t._error == null || t._error._row == null || t._error._row.value != "error").ToList();
            int modified_count = 0;
            int created_count = 0;

            foreach (var item in tmpItems)
            {
                var filter = Builders<MonitoringRK>.Filter.Eq(t => t.well, item.well) &
                             Builders<MonitoringRK>.Filter.Eq(t => t.plan_start, item.plan_start) &
                             Builders<MonitoringRK>.Filter.Eq(t => t.plan_end, item.plan_end);

                var existing = _monitoring_rk.Find(filter).FirstOrDefault();

                if (existing != null)
                {
                    var update = Builders<MonitoringRK>.Update
                        .Set(t => t.job, item.job)
                        .Set(t => t.rig, item.rig)
                        .Set(t => t.plan_end, item.plan_end)
                        .Set(t => t.remarks, item.remarks)
                        .Set(t => t.updated_date, DateTime.Now);

                    _monitoring_rk.UpdateOne(filter, update);
                    modified_count++;
                }
                else
                {
                    MonitoringRK newItem = new MonitoringRK
                    {
                        well = item.well,
                        job = item.job,
                        rig = item.rig,
                        plan_start = item.plan_start,
                        plan_end = item.plan_end,
                        remarks = item.remarks,
                        created_date = DateTime.Now
                    };
                    _monitoring_rk.InsertOne(newItem);
                    created_count++;
                }
            }

            // Clean up temp data
            _monitoring_rk_tmp.DeleteOne(t => t._id == _id);

            return new JsonResult(new
            {
                total_count = modified_count + created_count,
                modified_count = modified_count,
                created_count = created_count
            })
            {
                StatusCode = StatusCodes.Status200OK
            };
        }

        [Authorize("PeMonitoringRK Add")]
        [HttpPut("{id}")]
        public ActionResult Put(string id, [FromBody] MonitoringRK item)
        {
            var filter = Builders<MonitoringRK>.Filter.Eq(t => t._id, id);
            var existing = _monitoring_rk.Find(filter).FirstOrDefault();
            if (existing == null)
            {
                return NotFound(new { message = "Item not found" });
            }

            var update = Builders<MonitoringRK>.Update
                .Set(t => t.well, item.well)
                .Set(t => t.job, item.job)
                .Set(t => t.rig, item.rig)
                .Set(t => t.pop, item.pop)
                .Set(t => t.target_oil, item.target_oil)
                .Set(t => t.target_gas, item.target_gas)
                .Set(t => t.realisasi_oil, item.realisasi_oil)
                .Set(t => t.realisasi_gas, item.realisasi_gas)
                .Set(t => t.remarks, item.remarks)
                .Set(t => t.updated_date, DateTime.Now);

            _monitoring_rk.UpdateOne(filter, update);

            return Ok(new { message = "Item updated successfully" });
        }

        private ActionResult GetExcel(List<MonitoringRK> items)
        {
            var workbook = new ExcelPackage();

            var rigItems = items
                .Where(t => string.IsNullOrEmpty(t.rig) || !t.rig.ToLower().Contains("rigless"))
                .ToList();

            var riglessItems = items
                .Where(t => !string.IsNullOrEmpty(t.rig) && t.rig.ToLower().Contains("rigless"))
                .ToList();

            //pisahkan sheet
            var wsRig = workbook.Workbook.Worksheets.Add("Rig");
            WriteMonitoringRKSheet(wsRig, rigItems);

            var wsRigless = workbook.Workbook.Worksheets.Add("Rigless");
            WriteMonitoringRKSheet(wsRigless, riglessItems);

            var memoryStream = new MemoryStream(workbook.GetAsByteArray());
            memoryStream.Position = 0;
            return File(memoryStream, "application/vnd.ms-excel", "MonitoringRK.xlsx");
        }

        private void WriteMonitoringRKSheet(ExcelWorksheet ws, List<MonitoringRK> items)
        {

            // Header row 1 — main categories
            ws.Cells[1, 1].Value = "Well";
            ws.Cells[1, 1, 2, 1].Merge = true;
            ws.Cells[1, 2].Value = "Job";
            ws.Cells[1, 2, 2, 2].Merge = true;
            ws.Cells[1, 3].Value = "Rig";
            ws.Cells[1, 3, 2, 3].Merge = true;
            ws.Cells[1, 4].Value = "Pop";
            ws.Cells[1, 4, 2, 4].Merge = true;

            ws.Cells[1, 5].Value = "Target";
            ws.Cells[1, 5, 2, 6].Merge = true;
            ws.Cells[2, 5].Value = "Oil";
            ws.Cells[2, 6].Value = "Gas";

            ws.Cells[1, 7].Value = "Realisasi";
            ws.Cells[1, 7, 2, 8].Merge = true;
            ws.Cells[2, 7].Value = "Oil";
            ws.Cells[2, 8].Value = "Gas";

            ws.Cells[1, 9].Value = "Remarks";
            ws.Cells[1, 9, 2, 9].Merge = true;

            // Style headers
            ws.Cells[1, 1, 2, 9].Style.Font.Bold = true;
            ws.Cells[1, 1, 2, 9].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            ws.Cells[1, 1, 2, 9].Style.VerticalAlignment = ExcelVerticalAlignment.Top;

            // Data rows (mulai row 3)
            for (int i = 0; i < items.Count(); i++)
            {
                var t = items.ElementAt(i);
                ws.Cells[3 + i, 1].Value = t.well;
                ws.Cells[3 + i, 2].Value = t.job;
                ws.Cells[3 + i, 3].Value = t.rig;
                ws.Cells[3 + i, 4].Style.Numberformat.Format = "d-MMM-yy";
                ws.Cells[3 + i, 4].Value = t.pop.HasValue ? t.pop.Value.ToLocalTime().ToOADate() : (double?)null;
                ws.Cells[3 + i, 5].Value = t.target_oil;
                ws.Cells[3 + i, 6].Value = t.target_gas;
                ws.Cells[3 + i, 7].Value = t.realisasi_oil;
                ws.Cells[3 + i, 8].Value = t.realisasi_gas;
                ws.Cells[3 + i, 9].Value = t.remarks;
            }

            if (items.Count() > 0)
            {
                ws.Cells[3, 9, 3 + items.Count(), 9].Style.Numberformat.Format = "#,###.0";
            }
        }
    }
}
