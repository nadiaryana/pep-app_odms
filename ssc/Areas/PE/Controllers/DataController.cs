using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using MongoDB.Bson;
using Newtonsoft.Json;
using ssc.Areas.PE.Models;

namespace ssc.Areas.PE.Controllers
{
    [Route("api/pe/[controller]")]
    [ApiController]
    public class DataController : ControllerBase
    {
        private readonly IMongoCollection<Daily> _daily;
        private readonly IMongoCollection<Sonolog> _sonolog;
        private readonly IMongoCollection<Sensor> _sensor;
        private ProjectionDefinition<Daily> _fields_daily;
        private ProjectionDefinition<Sonolog> _fields_sonolog;
        private ProjectionDefinition<Sensor> _fields_sensor;
        Dictionary<string, string[]> status;

        public DataController(IPEDatabaseSettings settings)
        {
            _daily = DailyCommon._daily;
            _sonolog = DailyCommon._sonolog;
            _sensor = DailyCommon._sensor;

            _fields_daily = DailyCommon._fields_daily;
            _fields_sonolog = DailyCommon._fields_sonolog;
            _fields_sensor = DailyCommon._fields_sensor;
        }

       // [Authorize("PeDashboard Read")]
        [HttpGet]
        public ActionResult Get(string type, DateTime? date, DateTime? end_date, string[] well)
        {
            if (date == null) date = DateTime.Now;

            switch (type)
            {
                case "well_status":
                    return Data_WellStatus(date);

                case "structure_production":
                    return Data_StructureProduction(date);

                case "well_production":
                    return Data_WellProduction(date);

                case "well_rank":
                    return Data_WellRank(date);

                case "well_performance_daily":
                case "well_performance_weekly":
                case "well_performance_monthly":
                    return Data_WelPerformance(type, date, end_date, well);

                default:
                    return Ok(new { });
            }
        }

        // WELL STATUS

        private ActionResult Data_WellStatus(DateTime? date)
        {
            var res = _daily.Find(
                r => r.date == date && r.art_lift_type.Length > 0
            ).Project<Daily>(_fields_daily).ToList().GroupBy(r => new {
                //name = status.FirstOrDefault(s => s.Value.Contains(r.art_lift_type?.Substring(0, 1).ToUpper())).Key
                status = Filter_WellStatus(r.art_lift_type, r.last_prod_gross, r.gas)
            }).Where(w => !String.IsNullOrEmpty(w.Key.status)).Select(s => new
            {
                status = s.Key.status,
                count = s.Count()
            });

            var weekly_well = _daily.Find(d=> d.date <= date && d.date >= date.Value.AddDays(-6)
                ).Project<Daily>(_fields_daily).ToList().Where(s=> s.last_prod_gross > 0 || s.gas > 0).GroupBy(r=> r.date
                ).OrderBy(d=>d.Key).Select(s => new
                    {
                        dates = TimeZoneInfo.ConvertTimeFromUtc(s.Key.Value, TimeZoneInfo.Local),
                        count =  s.Count()
                    });

            int active_wells_count = res.Where(r => !String.IsNullOrEmpty(r.status)).Sum(s => s.count);
            int inactive_wells_count = (int)_daily.Find(r => r.date == date).CountDocuments() - active_wells_count;

            return Ok(new {
                active_wells_count = active_wells_count,
                data_active_well = weekly_well,
                data = res.Append(new
                {
                    status = "Non Aktif",
                    count = inactive_wells_count,
                })
            });
        }

        private string Filter_WellStatus(string art_lift_type, decimal? gross, decimal? gas)
        {
            string prefix = art_lift_type?.Substring(0, 1).ToUpper();
            if (gas == null) gas = 0;
            if (gross == null) gross = 0;

            if((prefix == "C" || prefix == "T" || prefix =="L") && gross > 0)
            {
                return "SRP";
            } else if (prefix == "E" && gross > 0)
            {
                return "ESP";
            } else if (prefix == "H" && gross > 0)
            {
                return "HPU";
            } else if (prefix == "N" && gas > 0 && (gross == 0 || gas/gross > (decimal)0.0182))
            {
                return "Gas";
            } else if(prefix == "N" && gross > 0 && gas/gross <= (decimal)0.0182)
            {
                return "Natural Flow";
            }
            return "";
        }

        // STRUCTURE PRODUCTION

        private ActionResult Data_StructureProduction(DateTime? date)
        {
            var res = _daily.Find(
                r => r.date == date
            ).Project<Daily>(_fields_daily).ToList().GroupBy(r => new {
                structure = r.structure?.name,
            }).Select(s => new
            {
                structure = s.Key.structure,
                oil_count = s.Where(r => r.last_prod_gross > 0 && (r.gas == null || r.gas <= (decimal)0.1)).Count(),
                gas_count = s.Where(r => r.gas > (decimal)0.1 && Filter_WellStatus(r.art_lift_type, r.last_prod_gross, r.gas) == "Gas").Count(),
            });
            return Ok(new { data = res });
        }

        //OIL GRAPH
        private ActionResult Data_WelPerformance(string type, DateTime? start, DateTime? end, string[] well)
        {
            switch (type)
            {
                case "well_performance_daily":

                    // sensor
                    /*var sensor_date_start = _sensor.Find(
                        r => well.Contains(r.well) && r.date <= start
                    ).Project<Sensor>(_fields_sensor).ToList().GroupBy(r => new
                    {
                        well = r.well,
                    }).Select(s => new
                    {
                        well = s.Key.well,
                        date = s.Max(t => t.date)
                    }).Min(u => u.date) ?? start;

                    var sensor = _sensor.Find(
                        r => well.Contains(r.well) &&
                        r.date >= sensor_date_start && r.date <= end
                    ).Project<Sensor>(_fields_sensor).ToList().GroupBy(r => new
                    {
                        date = r.date,
                        well = r.well,
                    }).Select(s => new
                    {
                        date = TimeZoneInfo.ConvertTimeFromUtc(s.Key.date.Value, TimeZoneInfo.Local),
                        well = s.Key.well,
                        pi = s.Average(i => i.pi),
                    });

                    // sonolog
                    var sonolog_date_start = _sonolog.Find(
                        r => well.Contains(r.well) && r.date <= start
                    ).Project<Sonolog>(_fields_sonolog).ToList().GroupBy(r => new
                    {
                        well = r.well,
                    }).Select(s => new
                    {
                        well = s.Key.well,
                        date = s.Max(t => t.date)
                    }).Min(u => u.date) ?? start;

                    var sonolog = _sonolog.Find(
                        r => well.Contains(r.well) &&
                        r.date >= sonolog_date_start && r.date <= end
                    ).Project<Sonolog>(_fields_sonolog).ToList().GroupBy(r => new
                    {
                        date = r.date,
                        well = r.well,
                    }).Select(s => new
                    {
                        date = TimeZoneInfo.ConvertTimeFromUtc(s.Key.date.Value, TimeZoneInfo.Local),
                        well = s.Key.well,
                        cdfl = s.Average(i => i.cdfl),
                        sfl = s.Average(i => i.sfl),
                    });

                    // daily
                    var daily = _daily.Find(
                        r => well.Contains(r.well) &&
                        r.date >= start && r.date <= end
                    ).Project<Daily>(_fields_daily).ToList().OrderBy(t => t.date).Select(s => new
                    {
                        date = TimeZoneInfo.ConvertTimeFromUtc(s.date.Value, TimeZoneInfo.Local),
                        well = s.well,
                        type = s.art_lift_type,
                        gross = s.last_prod_gross,
                        net = s.last_prod_net,
                        wc = s.last_prod_wc,
                        pump_intake = s.pump_intake,
                        mid = s.mid,
                        thp = s.thp,
                    });

                    // result
                    var res = new List<dynamic>();
                    daily.ToList().ForEach(s =>
                    {
                        DateTime sensor_date = sensor.Where(t => t.well == s.well && t.date <= s.date)?.Select(u => u.date).DefaultIfEmpty().Max() ?? s.date;
                        DateTime sonolog_date = sonolog.Where(t => t.well == s.well && t.date <= s.date)?.Select(u => u.date).DefaultIfEmpty().Max() ?? s.date;
                        decimal? pi = sensor.FirstOrDefault(t => t.well == s.well && t.date == sensor_date)?.pi;
                        decimal? cdfl = sonolog.FirstOrDefault(t => t.well == s.well && t.date == sonolog_date)?.cdfl;
                        decimal? sfl = sonolog.FirstOrDefault(t => t.well == s.well && t.date == sonolog_date)?.sfl;
                        decimal? sgmix = s.wc / 100 * (decimal)1.01 + (1 - s.wc / 100) * (decimal)0.878;

                        decimal? dfl;
                        if (s.type.ToLower().StartsWith("e"))
                        {
                            dfl = (s.pump_intake - (pi / (decimal)0.433 / sgmix / (decimal)3.281));
                        }
                        else
                        {
                            dfl = cdfl;
                        }
                        if (dfl == null)
                        {

                        }

                        decimal? pwf = (s.mid - dfl) * (decimal)3.281 * sgmix * (decimal)0.433;
                        decimal? ps = (s.mid - sfl) * (decimal)3.281 * sgmix * (decimal)0.433;

                        decimal? sm = s.pump_intake - dfl;
                        decimal? qmax = s.gross / (1 - (decimal)0.2 * pwf / ps - (decimal)0.8 * (pwf * pwf) / (ps * ps));

                        res.Add(new
                        {
                            date = s.date.ToString("yyyy-MM-dd"),
                            well = s.well,
                            gross = s.gross,
                            net = s.net,
                            qmax = qmax,
                            wc = s.wc,
                            thp = s.thp,
                            sm = sm,
                            dfl = dfl,
                            cdfl = cdfl,
                            sfl = sfl,
                            sgmix = sgmix,
                            ps = ps,
                            pwf = pwf
                        });
                    });

                    return Ok(new { data = res });
                    */
                    var daily = _daily.Find(
                        r => well.Contains(r.well) &&
                        r.date >= start && r.date <= end
                    ).Project<Daily>(_fields_daily).ToList().OrderBy(t => t.date).Select(s => new
                    {
                        date = TimeZoneInfo.ConvertTimeFromUtc(s.date.Value, TimeZoneInfo.Local),
                        well = s.well,
                        gross = s.last_prod_gross,
                        net = s.last_prod_net,
                        wc = s.last_prod_wc,
                        thp = s.thp,
                        sm = s.sm,
                        dfl = s.sonolog_dfl,
                        //cdfl = s.sono,
                        sfl = s.sonolog_sfl,
                        sgmix = s.sgmix,
                        ps = s.ps,
                        pwf = s.pwf,
                        qmax = s.qmax,
                    });
                    return Ok(new { data = daily });

                case "well_performance_weekly":
                case "well_performance_monthly":

                default:
                    return Ok(new { });
            }
        }

        private ActionResult Data_WellProduction(DateTime? date)
        {
            var res = _daily.Find(
                r => r.date == date && r.last_prod_gross > 0 && (r.gas == null || r.gas < (decimal)0.1)
            ).Project<Daily>(_fields_daily).ToList();

            return Ok(new
            {
                data = new dynamic[] 
                {
                    new { prod = "> 200", count = res.Count(r => r.last_prod_net > 200) },
                    new { prod = "150 - 200", count = res.Count(r => r.last_prod_net > 150 && r.last_prod_net <= 200) },
                    new { prod = "100 - 150", count = res.Count(r => r.last_prod_net > 100 && r.last_prod_net <= 150) },
                    new { prod = "50 - 100", count = res.Count(r => r.last_prod_net > 50 && r.last_prod_net <= 100) },
                    new { prod = "20 - 50", count = res.Count(r => r.last_prod_net > 20 && r.last_prod_net <= 50) },
                    new { prod = "10 - 20", count = res.Count(r => r.last_prod_net > 10 && r.last_prod_net <= 20) },
                    new { prod = "< 10", count = res.Count(r => r.last_prod_net <= 10) },
                }
            });
        }

        private ActionResult Data_WellRank(DateTime? date)
        {
            var res = _daily.Find(
                r => r.date == date && r.last_prod_gross > 0 && (r.gas == null || r.gas < (decimal)0.5)
            ).Project<Daily>(_fields_daily).ToList().OrderByDescending(r => r.last_prod_net).Take(20).Select(s => new {
                well = s.well,
                net = s.last_prod_net
            });

            return Ok(new
            {
                data = res
            });
        }
    }
}