using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System.Net.Http;
using MongoDB.Bson;
using Newtonsoft.Json.Linq;
using ssc.Areas.PE.Models;

namespace ssc.Areas.PE.Controllers
{
    [Route("api/pe/[controller]")]
    [ApiController]
    public class SumurController : ControllerBase
    {
        private IMongoDatabase database;
        private readonly IMongoCollection<Sumur> _sumur;
        private readonly IMongoCollection<SumurTmp> _sumur_tmp;
        private readonly ProjectionDefinition<Sumur> _fields;
        private readonly HttpClient _httpClient;

        public SumurController(IPEDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            database = client.GetDatabase("pe");

            _sumur = database.GetCollection<Sumur>("sumur");
            _sumur_tmp = database.GetCollection<SumurTmp>("sumur_tmp");

            // projection field1 yang mau diambil
            _fields = Builders<Sumur>.Projection
                .Include(t => t.WellName)
                .Include(t => t.Current)
                .Include(t => t.Timestamp);
        }

        // GET: api/pe/well/latest?limit=100
        [HttpGet("latest")]
        public async Task<IActionResult> GetLatest([FromQuery] int limit = 100)
        {
            var data = await _sumur.Find(Builders<Sumur>.Filter.Empty)
                                    .SortByDescending(x => x.Timestamp)
                                    .Limit(limit)
                                    .ToListAsync();

            return Ok(data);
        }

        // POST: api/pe/well/save
        [HttpPost("save")]
        public async Task<IActionResult> SaveData([FromBody] Sumur request)
        {
            if (request == null) return BadRequest("Invalid data");

            await _sumur.InsertOneAsync(request);
            return Ok(new { message = "Data inserted", data = request });
        }

        // 🔹 GET api/pe/well/fetch
        [HttpGet("fetch")]
        public async Task<IActionResult> FetchFromThingSpeak(
            [FromQuery] string channelId,
            [FromQuery] string apiKey,
            [FromQuery] string wellName)
        {
            if (string.IsNullOrEmpty(channelId) || string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(wellName))
            {
                return BadRequest(new { message = "channelId, apiKey, dan wellName wajib diisi" });
            }

            try
            {
                using (var httpClient = new HttpClient())
                {
                    var url = $"https://api.thingspeak.com/channels/{channelId}/fields/1.json?api_key={apiKey}&results=100";
                    var response = await httpClient.GetStringAsync(url);
                    var json = JObject.Parse(response);
                    var feeds = json["feeds"];

                    if (feeds == null || !feeds.Any())
                        return BadRequest(new { message = "Tidak ada data dari ThingSpeak" });

                    var list = new List<Sumur>();

                    foreach (var f in feeds)
                    {
                        list.Add(new Sumur
                        {
                            WellName = wellName,
                            Current = double.TryParse((string)f["field1"], out double val) ? val : 0,
                            Timestamp = DateTime.TryParse((string)f["created_at"], out DateTime ts) ? ts : DateTime.UtcNow
                        });
                    }

                    // simpan ke TMP collection
                    var tmp = new SumurTmp
                    {
                        items = list.ToArray(),
                        error_count = 0
                    };

                    await _sumur_tmp.InsertOneAsync(tmp);

                    return Ok(new
                    {
                        message = $"Data fetched untuk {wellName}",
                        tmp_id = tmp._id,
                        count = list.Count,
                        feeds = feeds,
                    });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

    }
}
