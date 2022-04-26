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
    public class ChartController : ControllerBase
    {
        private IMongoDatabase database;
        private readonly IMongoCollection<Daily> _rows;
        private ProjectionDefinition<Daily> _fields;
        Dictionary<string, string[]> status;

        public ChartController(IPEDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            database = client.GetDatabase(settings.DatabaseName);

            _rows = database.GetCollection<Daily>(settings.DailyCollectionName);
            _fields = Builders<Daily>.Projection
                .Include(t => t.date)
                .Include(t => t.well)
                .Include(t => t.zone)
                .Include(t => t.interval)
                .Include(t => t.test_date)
                .Include(t => t.test_duration)
                .Include(t => t.last_prod_hours)
                .Include(t => t.last_prod_gross)
                .Include(t => t.last_prod_net)
                .Include(t => t.last_prod_wc)
                .Include(t => t.art_lift_size)
                .Include(t => t.art_lift_type)
                .Include(t => t.art_lift_sl)
                .Include(t => t.art_lift_spm)
                .Include(t => t.art_lift_freq)
                .Include(t => t.art_lift_load)
                .Include(t => t.art_lift_bean_size)
                .Include(t => t.art_lift_efficiency)
                .Include(t => t.chp)
                .Include(t => t.pfl)
                .Include(t => t.psep)
                .Include(t => t.pump_intake)
                .Include(t => t.top)
                .Include(t => t.mid)
                .Include(t => t.bottom);

            status = new Dictionary<string, string[]>() {
                { "B", new string[] { "C", "T", "L" } },
                { "D", new string[] { "E" } },
                { "C", new string[] { "H" } },
                { "A", new string[] { "N" } },
            };
        }

        /*
        [HttpGet]
        public ActionResult Get()
        {
            dynamic options = new
            {
                chart = new
                {
                    type = "bar"
                },
                title = new
                {
                    text = "Stacked Bar Chart"
                },
                xAxis = new
                {
                    categories = new string[] { "Apple", "Pear", "Grape", "Banana" }
                },
                yAxis = new
                {
                    min = 0,
                    title = new
                    {
                        text = "Total fruits consumption"
                    }
                },
                legend = new
                {
                    reversed = true
                },
                plotOptions = new
                {
                    series = new
                    {
                        stacking = "normal"
                    }
                },
                series = new dynamic[] {
                    new
                    {
                        name = "John",
                        data = new int[] { 5,3,4,7,2 }
                    },
                    new
                    {
                        name = "Jane",
                        data = new int[] { 2,2,3,2,1 }
                    },
                    new
                    {
                        name = "Joe",
                        data = new int[] { 3,4,4,2,5 }
                    }
                }
            };
            return Ok(new {
                options = options
            });
        }
        */

        [HttpGet]
        public ActionResult Get(string data)
        {
            switch(data)
            {
                case "well_status":
                    return Data_WellStatus();
                default:
                    return Ok(new { });
            }
        }

        private ActionResult Data_WellStatus()
        {
            var res = _rows.Find(
                r => r.date == DateTime.Parse("2019-09-25") && r.art_lift_type.Length > 0
            ).Project<Daily>(_fields).ToList().GroupBy(r => new {
                //name = r.art_lift_type?.Substring(0, 1).ToUpper()
                name = status.FirstOrDefault(s => s.Value.Contains(r.art_lift_type?.Substring(0, 1).ToUpper())).Key
            }).Select(s => new
            {
                status = s.Key.name,
                total = s.Count()
            });
            return Ok(new { data = res });
        }

        private ActionResult Chart_WellStatus ()
        {
            var res = _rows.Find(
                r => r.date == DateTime.Parse("2019-09-25") && r.art_lift_type.Length > 0
            ).Project<Daily>(_fields).ToList().GroupBy(r => new {
                //name = r.art_lift_type?.Substring(0, 1).ToUpper()
                name = status.FirstOrDefault(s => s.Value.Contains(r.art_lift_type?.Substring(0, 1).ToUpper())).Key
            }).Select(s => new
            {
                name = s.Key.name,
                y = s.Count()
            });

            return Ok(new
            {
                options = new
                {
                    chart = new
                    {
                        plotBackgroundColor = (string)null,
                        plotBorderWidth = (string)null,
                        plotShadow = false,
                        type = "pie"
                    },
                    title = new
                    {
                        text = "Well Status"
                    },
                    tooltip = new
                    {
                        pointFormat = "<b>{point.percentage:.1f}%</b>"
                    },
                    plotOptions = new
                    {
                        pie = new
                        {
                            allowPointSelect = true,
                            cursor = "pointer",
                            dataLabels = new
                            {
                                enabled = true,
                                format = "<b>{point.name}</b>: {point.y}"
                            }
                        }
                    },
                    series = new dynamic[] {
                        new
                        {
                            type = "pie",
                            name = "Status",
                            colorByPoint = true,
                            data = res
                        }
                    }
                }
            });
        }
    }
}