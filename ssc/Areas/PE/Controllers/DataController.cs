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
        private readonly IMongoCollection<Production> _production;
        private ProjectionDefinition<Daily> _fields_daily;
        private ProjectionDefinition<Sonolog> _fields_sonolog;
        private ProjectionDefinition<Sensor> _fields_sensor;
        private ProjectionDefinition<Production> _fields_production;
        Dictionary<string, string[]> status;

        public DataController(IPEDatabaseSettings settings)
        {
            _daily = DailyCommon._daily;
            _sonolog = DailyCommon._sonolog;
            _sensor = DailyCommon._sensor;
            _production = DailyCommon._production;

            _fields_daily = DailyCommon._fields_daily;
            _fields_sonolog = DailyCommon._fields_sonolog;
            _fields_sensor = DailyCommon._fields_sensor;
            _fields_production = DailyCommon._fields_production;
        }

        [Authorize("PeDashboard Read")]
        [HttpGet]
        public ActionResult Get(string type, DateTime? date, DateTime? end_date, string[] well, string zone)
        {
            if (date == null) date = DateTime.Now;

            switch (type)
            {
                case "well_status":
                    return Data_WellStatus(date, end_date);

                case "structure_production":
                    return Data_StructureProduction(date);

                case "well_production":
                // return Data_WellProduction(date);

                case "well_rank":
                    return Data_WellRank(date);

                case "well_performance_daily":
                    return Data_WelPerformance(type, date, end_date, well);

                case "well_area_performance":
                    return Data_WelPerformance(type, date, end_date, well);

                case "well_performance_sonolog":
                    return Data_WelPerformance_Sonolog(type, date, end_date, well);

                case "well_performance_weekly":

                case "zone_performance":
                    return Data_ZonePerformance(type, date, end_date, zone, well);

                case "well_performance_monthly":
                    return Data_WelPerformance(type, date, end_date, well);

                default:
                    return Ok(new { });
            }
        }

        // WELL STATUS

        private ActionResult Data_WellStatus(DateTime? date, DateTime? end_date)
        {
            var res = _daily.Find(
                r => r.date == end_date && r.ls_method.Length > 0
            ).Project<Daily>(_fields_daily).ToList().GroupBy(r => new
            {
                //name = status.FirstOrDefault(s => s.Value.Contains(r.art_lift_type?.Substring(0, 1).ToUpper())).Key
                status = Filter_WellStatus(r.ls_method, r.tes_prod_gross, r.gas)
            }).Where(w => !String.IsNullOrEmpty(w.Key.status)).Select(s => new
            {
                status = s.Key.status,
                count = s.Count()
            });

            var weekly_well = _daily.Find(d => d.date <= date && d.date >= date.Value.AddDays(-6)
               ).Project<Daily>(_fields_daily).ToList().Where(s => s.tes_prod_gross > 0 || s.gas > 0 || s.prod_hours > 0).GroupBy(r => r.date
               ).OrderBy(d => d.Key).Select(s => new
               {
                   dates = TimeZoneInfo.ConvertTimeFromUtc(s.Key.Value, TimeZoneInfo.Local),
                   count = s.Count()
               });

            // var weekly_well = _daily.Find(d => d.date <= end_date && d.date >= date && d.art_lift_type.Length > 0;

            // var weekly_well = _daily.Find(d => d.date <= end_date && d.date >= date
            //var weekly_well = _daily.Find(d => d.art_lift_type.Length > 0
            // ).Project<Daily>(_fields_daily).ToList().Where(s => s.last_prod_gross > 0 || s.gas > 0).GroupBy(r => r.date
            //).Project<Daily>(_fields_daily).ToList().Where(s => s.last_prod_gross > 0).GroupBy(r => r.date
            //).Project<Daily>(_fields_daily).ToList().Where(s => s.last_prod_hours > 0).GroupBy(r => r.date
            //  ).OrderBy(d => d.Key).Select(s => new
            {
                //  dates = TimeZoneInfo.ConvertTimeFromUtc(s.Key.Value, TimeZoneInfo.Local),
                //count = s.Count()
                //  count = s.Count()
                //  });

                int active_wells_count = res.Where(r => !String.IsNullOrEmpty(r.status)).Sum(s => s.count);
                int inactive_wells_count = (int)_daily.Find(r => r.date == date).CountDocuments() - active_wells_count;

                return Ok(new
                {
                    active_wells_count = active_wells_count,
                    data_active_well = weekly_well,
                    data = res.Append(new
                    {
                        status = "Non Aktif",
                        count = inactive_wells_count,
                    })
                });
            }
        }

        private string Filter_WellStatus(string ls_method, decimal? tes_prod_gross, decimal? gas)
        {
            string prefix = ls_method?.Substring(0, 1).ToUpper();
            if (gas == null) gas = 0;
            if (tes_prod_gross == null) tes_prod_gross = 0;

            if ((prefix == "S") && tes_prod_gross > 0)
            {
                return "SRP";
            }
            else if (prefix == "E" && (tes_prod_gross > 0 || tes_prod_gross > 0))
            {
                return "ESP";
            }
            else if (prefix == "G" && (tes_prod_gross > 0 || tes_prod_gross > 0))
            {
                return "GL";
            }
            else if (prefix == "W" && (tes_prod_gross > 0 || tes_prod_gross > 0))
            {
                return "WI";
            }
            else if (prefix == "H" && (tes_prod_gross > 0 || tes_prod_gross > 0))
            {
                return "HPU";
            }
            else if (prefix == "N" && gas > 0 && (tes_prod_gross == 0 || gas / tes_prod_gross > (decimal)0.005))
            {
                return "Gas";
            }
            else if (prefix == "N" && tes_prod_gross > 0 && gas / tes_prod_gross <= (decimal)0.005)
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
            ).Project<Daily>(_fields_daily).ToList().GroupBy(r => new
            {
                structure = r.structure?.name,
            }).Select(s => new
            {
                structure = s.Key.structure,
                // oil_count = s.Where(r => r.last_prod_gross > 0 && (r.gas == null || r.gas <= (decimal)0.1)).Count(),
                // gas_count = s.Where(r => r.gas > (decimal)0.01 && Filter_WellStatus(r.art_lift_type, r.last_prod_gross, r.gas) == "Gas").Count(),
                // well_name = s.Where(r => r.gas > (decimal)0.01 && Filter_WellStatus(r.art_lift_type, r.last_prod_gross, r.gas) == "Gas"),
            });
            return Ok(new { data = res });
        }

        //OIL GRAPH
        private ActionResult Data_WelPerformance(string type, DateTime? start, DateTime? end, string[] well)
        {
            switch (type)
            {
                case "well_performance_daily":

                    var daily = _daily.Find(
                        r => well.Contains(r.well) &&
                        r.date >= start && r.date <= end
                    ).Project<Daily>(_fields_daily).ToList().OrderBy(t => t.date).Select(s => new
                    {
                        date = TimeZoneInfo.ConvertTimeFromUtc(s.date.Value, TimeZoneInfo.Local),
                        well = s.well,
                        gross = s.fig_curr_gross,
                        net = s.fig_curr_net,
                        wc = s.wc,
                        // thp = s.thp,
                        sm = s.sm,
                        // dfl = s.sonolog_dfl,
                        //cdfl = s.sono,
                        // sfl = s.sonolog_sfl,
                        // sgmix = s.sgmix,
                        // ps = s.ps,
                        // pwf = s.pwf,
                        // qmax = s.qmax,
                        // bean_size = s.art_lift_bean_size,
                        // gas_rates = s.gas,
                        sl = s.ds_sl,
                        spm = s.ds_spm,
                        // freq = s.art_lift_freq,
                        wor = s.wor,
                        noted = s.noted

                    });

                    return Ok(new { data = daily });

                case "well_area_performance":

                    var daily_area = _daily.Find(
                          r => r.date >= start && r.date <= end
                      ).Project<Daily>(_fields_daily).ToList().OrderBy(t => t.date).Select(s => new
                      {
                          date = TimeZoneInfo.ConvertTimeFromUtc(s.date.Value, TimeZoneInfo.Local),
                          well = s.well,
                          gross = s.fig_curr_gross,
                          net = s.fig_curr_net,
                          location = s.location,
                      });

                    return Ok(new { data = daily_area });

                case "well_performance_weekly":

                case "well_performance_monthly":

                default:
                    return Ok(new { });
            }
        }

        private ActionResult Data_WelPerformance_Sonolog(string type, DateTime? start, DateTime? end, string[] well)
        {
            switch (type)
            {
                case "well_performance_sonolog":

                    var sonolog = _sonolog.Find(
                        r => well.Contains(r.well) &&
                        r.date >= start && r.date <= end
                    ).Project<Sonolog>(_fields_sonolog).ToList().OrderBy(t => t.date).Select(s => new
                    {
                        date = TimeZoneInfo.ConvertTimeFromUtc(s.date.Value, TimeZoneInfo.Local),
                        well = s.well,
                        pump_intake = s.pump_intake,
                        dfl = s.dfl,
                        // cdfl = s.cdfl,
                        sfl = s.sfl,
                        // tglc = s.tglc,
                        // egfl = s.egfl,
                        // al = s.al

                    });

                    return Ok(new { data = sonolog });

                default:
                    return Ok(new { });
            }
        }


        private ActionResult Data_ZonePerformance(string type, DateTime? start, DateTime? end, string zone, string[] well)
        {
            switch (type)
            {
                case "zone_performance":
                    var daily = _daily.Find(
                          r => zone.Equals(r.zone) && well.Contains(r.well) &&
                          r.date >= start && r.date <= end
                      ).Project<Daily>(_fields_daily).ToList().OrderBy(t => t.date).Select(s => new
                      {
                          date = TimeZoneInfo.ConvertTimeFromUtc(s.date.Value, TimeZoneInfo.Local),
                          well = s.well,
                          //   thp = s.thp,
                          sm = s.sm,
                          //   dfl = s.sonolog_dfl,
                          //   sfl = s.sonolog_sfl,
                          //   sgmix = s.sgmix,
                          //   ps = s.ps,
                          //   pwf = s.pwf,
                          //   qmax = s.qmax,
                          zone = s.zone


                      });
                    return Ok(new { data = daily });

                default:
                    return Ok(new { });
            }
        }

        // private ActionResult Data_WellProduction(DateTime? date)
        // {
        //     var res = _daily.Find(
        //     // r => r.date == date && r.last_prod_gross > 0 && (r.gas == null || r.gas < (decimal)0.1)
        //     ).Project<Daily>(_fields_daily).ToList();

        //     return Ok(new
        //     {
        //         data = new dynamic[]
        //         {
        // new { prod = "> 200", count = res.Count(r => r.last_prod_net > 200) },
        // new { prod = "150 - 200", count = res.Count(r => r.last_prod_net > 150 && r.last_prod_net <= 200) },
        // new { prod = "100 - 150", count = res.Count(r => r.last_prod_net > 100 && r.last_prod_net <= 150) },
        // new { prod = "50 - 100", count = res.Count(r => r.last_prod_net > 50 && r.last_prod_net <= 100) },
        // new { prod = "20 - 50", count = res.Count(r => r.last_prod_net > 20 && r.last_prod_net <= 50) },
        // new { prod = "10 - 20", count = res.Count(r => r.last_prod_net > 10 && r.last_prod_net <= 20) },
        // new { prod = "< 10", count = res.Count(r => r.last_prod_net <= 10) },
        // }
        // });
        // }


        private ActionResult Data_WellRank(DateTime? date)
        {
            var res = _daily.Find(
                r => r.date == date && r.fig_curr_gross > 0 && (r.gas == null || r.gas < (decimal)0.5)
                ).Project<Daily>(_fields_daily).ToList().OrderByDescending(r => r.fig_curr_net).Take(20).Select(s => new
                {
                    well = s.well,
                    net = s.fig_curr_net,
                });

            return Ok(new
            {
                data = res
            });
        }
        // }
        // }
    }
}
