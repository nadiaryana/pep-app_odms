using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using ssc.Areas.PE.Models;

namespace ssc.Areas.PE.Controllers
{
    [Route("api/pe/[controller]")]
    [ApiController]
    public class RodPumpDataController : ControllerBase
    {
        private readonly IMongoCollection<RodPumpData> _rod_pump;

        public RodPumpDataController(IPEDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase("pe");

            _rod_pump = database.GetCollection<RodPumpData>("rod_pump_data");
        }

        [Authorize("PePumpingUnit Read")]
        [HttpGet]
        public ActionResult Get(String sort = "rod_nomor", String order = "asc", int page = 0, int pagesize = 50)
        {
            if (page < 0) page = 0;
            if (pagesize <= 0) pagesize = 50;

            FilterDefinition<RodPumpData> xfilter = Builders<RodPumpData>.Filter.Empty;

            var total_count = _rod_pump.CountDocuments(xfilter);
            List<RodPumpData> items = _rod_pump.Find(xfilter)
                .Sort(GetSort(sort, order))
                .Skip(page * pagesize)
                .Limit(pagesize)
                .ToList();

            return new JsonResult(new
            {
                total_count = total_count,
                items = items,
            })
            {
                StatusCode = StatusCodes.Status200OK
            };
        }

        private SortDefinition<RodPumpData> GetSort(String sort, String order)
        {
            bool asc = String.IsNullOrWhiteSpace(order) || order == "asc";

            switch (sort)
            {
                case "plunger_diameter": return asc ? Builders<RodPumpData>.Sort.Ascending(t => t.plunger_diameter) : Builders<RodPumpData>.Sort.Descending(t => t.plunger_diameter);
                case "rod_weight": return asc ? Builders<RodPumpData>.Sort.Ascending(t => t.rod_weight) : Builders<RodPumpData>.Sort.Descending(t => t.rod_weight);
                case "elastic_constat": return asc ? Builders<RodPumpData>.Sort.Ascending(t => t.elastic_constat) : Builders<RodPumpData>.Sort.Descending(t => t.elastic_constat);
                case "freq_factor": return asc ? Builders<RodPumpData>.Sort.Ascending(t => t.freq_factor) : Builders<RodPumpData>.Sort.Descending(t => t.freq_factor);
                case "rod_string1": return asc ? Builders<RodPumpData>.Sort.Ascending(t => t.rod_string1) : Builders<RodPumpData>.Sort.Descending(t => t.rod_string1);
                case "rod_string2": return asc ? Builders<RodPumpData>.Sort.Ascending(t => t.rod_string2) : Builders<RodPumpData>.Sort.Descending(t => t.rod_string2);
                case "rod_string3": return asc ? Builders<RodPumpData>.Sort.Ascending(t => t.rod_string3) : Builders<RodPumpData>.Sort.Descending(t => t.rod_string3);
                case "rod_string4": return asc ? Builders<RodPumpData>.Sort.Ascending(t => t.rod_string4) : Builders<RodPumpData>.Sort.Descending(t => t.rod_string4);
                case "rod_string5": return asc ? Builders<RodPumpData>.Sort.Ascending(t => t.rod_string5) : Builders<RodPumpData>.Sort.Descending(t => t.rod_string5);
                case "rod_string6": return asc ? Builders<RodPumpData>.Sort.Ascending(t => t.rod_string6) : Builders<RodPumpData>.Sort.Descending(t => t.rod_string6);
                case "rod_string7": return asc ? Builders<RodPumpData>.Sort.Ascending(t => t.rod_string7) : Builders<RodPumpData>.Sort.Descending(t => t.rod_string7);
                case "rod_nomor":
                default:
                    return asc ? Builders<RodPumpData>.Sort.Ascending(t => t.rod_nomor) : Builders<RodPumpData>.Sort.Descending(t => t.rod_nomor);
            }
        }
    }
}
