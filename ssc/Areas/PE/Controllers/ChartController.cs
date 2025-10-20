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
            // _collection = database.GetCollection<Daily>(settings.DailyCollectionName);

            _rows = database.GetCollection<Daily>(settings.DailyCollectionName);
            _fields = Builders<Daily>.Projection
                .Include(t => t.date)
                .Include(t => t.well)
                .Include(t => t.zone)
                .Include(t => t.interval)
                // .Include(t => t.test_date)
                // .Include(t => t.test_duration)
                .Include(t => t.potensi_prod_gross)
                .Include(t => t.potensi_prod_net)
                .Include(t => t.tes_prod_gross)
                .Include(t => t.tes_prod_net)
                .Include(t => t.fig_last_gross)
                .Include(t => t.fig_last_net)
                .Include(t => t.fig_curr_gross)
                .Include(t => t.fig_curr_net)
                .Include(t => t.thp_last_fig)
                .Include(t => t.thp_potensi)
            // .Include(t => t.art_lift_type)
                .Include(t => t.wc)
                .Include(t => t.prod_hours)
                .Include(t => t.wor)
                .Include(t => t.gas)
                .Include(t => t.gor)
                .Include(t => t.glr)
                .Include(t => t.ls_method)
                .Include(t => t.ls_brandtype)
                .Include(t => t.ls_prime_mover)
                .Include(t => t.ls_hp)
                .Include(t => t.ds_size)
                .Include(t => t.ds_spm)
                .Include(t => t.ds_bean)
                .Include(t => t.ds_whp)
                .Include(t => t.ds_fl)
                .Include(t => t.ds_casing)
                .Include(t => t.ds_separator)
                .Include(t => t.ds_pump_displace)
                .Include(t => t.ds_efficiency)
                .Include(t => t.ds_sl)
                .Include(t => t.ds_kd)
                .Include(t => t.sm)
                .Include(t => t.ds_tgl_pengujian)
                .Include(t => t.noted);

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
            switch (data)
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
                r => r.date == DateTime.Parse("2019-09-25") && r.ls_method.Length > 0
            ).Project<Daily>(_fields).ToList().GroupBy(r => new
            {
                //name = r.art_lift_type?.Substring(0, 1).ToUpper()
                name = status.FirstOrDefault(s => s.Value.Contains(r.ls_method?.Substring(0, 1).ToUpper())).Key
            }).Select(s => new
            {
                status = s.Key.name,
                total = s.Count()
            });
            return Ok(new { data = res });
        }

        //  
        // [HttpGet("dynamic")]
        // public async Task<IActionResult> GetDynamicChart([FromQuery] string x, [FromQuery] string y)
        // {
        //     if (string.IsNullOrEmpty(x) || string.IsNullOrEmpty(y))
        //         return BadRequest("x dan y parameter harus diisi");

        //     // Ambil data dari MongoDB hanya field yang dipilih
        //     var projection = Builders<Daily>.Projection
        //         .Include(x) // field X
        //         .Include(y); // field Y

        //     var data = await _rows.Find(_ => true)
        //                           .Project<Dictionary<string, object>>(projection)
        //                           .ToListAsync();

        //     // Convert data jadi array untuk chart
        //     var categories = new List<string>(); // untuk X (date atau lainnya)
        //     var values = new List<double>();     // untuk Y

        //     foreach (var doc in data)
        //     {
        //         if (doc.ContainsKey(x) && doc.ContainsKey(y))
        //         {
        //             string xVal = doc[x]?.ToString() ?? "";
        //             double yVal;

        //             // parsing nilai Y
        //             if (double.TryParse(doc[y]?.ToString(), out yVal))
        //             {
        //                 categories.Add(xVal);
        //                 values.Add(yVal);
        //             }
        //         }
        //     }

        //     // Bentuk Highcharts options
        //     var options = new
        //     {
        //         chart = new { type = "line" },
        //         title = new { text = $"Chart {y} vs {x}" },
        //         xAxis = new { categories = categories },
        //         yAxis = new { title = new { text = y } },
        //         series = new dynamic[]
        //         {
        //     new {
        //         name = y, 
        //         data = values
        //     }
        //         }
        //     };
        //     return Ok(new { options });
        // }
        [HttpGet("dynamic")]
        public async Task<IActionResult> GetDynamicChart([FromQuery] string x, [FromQuery] string y1, [FromQuery] string y2)
        {
            if (string.IsNullOrEmpty(x) || string.IsNullOrEmpty(y1) || string.IsNullOrEmpty(y2))
                return BadRequest("x, y1, dan y2 parameter harus diisi");

            // Ambil data dari MongoDB hanya field yang dipilih
            var projection = Builders<Daily>.Projection
                .Include(x) // field X
                .Include(y1) // field Y1
                .Include(y2); // field Y2

            var data = await _rows.Find(_ => true)
                                .Project<Dictionary<string, object>>(projection)
                                .ToListAsync();

            var series1 = new List<object[]>();
            var series2 = new List<object[]>();

            // Convert data jadi array untuk chart
            // var categories = new List<string>(); // untuk X (date atau lainnya)
            // var values = new List<double>();     // untuk Y

            foreach (var doc in data)
            {
                if (doc.TryGetValue(x, out var val) && DateTime.TryParse(val?.ToString(), out DateTime dateVal))
                // if (DateTime.TryParse(doc[x]?.ToString(), out DateTime dateVal))
                {
                    var utcDate = DateTime.SpecifyKind(dateVal, DateTimeKind.Utc);
                    long unixTime = new DateTimeOffset(utcDate).ToUnixTimeMilliseconds();

                    if (doc.ContainsKey(y1) && double.TryParse(doc[y1]?.ToString(), out double y1Val))
                    {
                        series1.Add(new object[] { unixTime, y1Val });
                    }

                    if (doc.ContainsKey(y2) && double.TryParse(doc[y2]?.ToString(), out double y2Val))
                    {
                        series2.Add(new object[] { unixTime, y2Val });
                    }
                }
            }

            // Bentuk Highcharts options
            var options = new
            {
                chart = new { type = "line" },
                title = new { text = $"{y1} & {y2} vs {x}" },
                xAxis = new { type = "datetime" },
                yAxis = new object[]
                {
                    new {
                        title = new { text = y1 },
                        opposite = false // kiri
                    },
                    new {
                        title = new { text = y2 },
                        opposite = true // kanan
                    }
                },
                series = new object[]
                {
                    new {
                        type = "line",
                        name = y1,
                        data = series1,
                        yAxis = 0
                    },
                    new {
                        type = "line",
                        name = y2,
                        data = series2,
                        yAxis = 1
                    }
                }
            };
            return Ok(new { options });
        }
    }
}

