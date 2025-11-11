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
using Microsoft.AspNetCore.Mvc;
// using ssc.Data;
using System.Linq;
using System.Threading.Tasks;
using System.Net.Http;

namespace ssc.Areas.PE.Controllers
{
    [Route("api/pe/[controller]")]
    [ApiController]
    public class IprController : ControllerBase
    {
        private IMongoDatabase database;
        private readonly IMongoCollection<Ipr> _ipr;
        private readonly IMongoCollection<Daily> _daily;
        // private readonly IMongoCollection<SumurTmp> _sumur_tmp;
        private readonly ProjectionDefinition<Ipr> _fields;
        private readonly HttpClient _httpClient;

        public IprController(IPEDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            database = client.GetDatabase("pe");

            _ipr = database.GetCollection<Ipr>("ipr");
            _daily = database.GetCollection<Daily>("daily");
        }

        // test API
        [HttpGet("ping")]
        public IActionResult Ping()
        {
            return Ok("IPR Controller OK");
        }

        // GET: ap/pe/ipr
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Ipr>>> GetAll()
        {
            var list = await _ipr.Find(_ => true).ToListAsync();
            return Ok(list);
        }

        // ✅ GET by id
        [HttpGet("{id:length(24)}", Name = "GetIprById")]
        public async Task<ActionResult<Ipr>> GetById(string id)
        {
            var item = await _ipr.Find(i => i._id == id).FirstOrDefaultAsync();
            if (item == null)
                return NotFound();

            return Ok(item);
        }

        // ✅ POST create new
        [HttpPost]
        public async Task<ActionResult<Ipr>> Create(Ipr ipr)
        {
            await _ipr.InsertOneAsync(ipr);
            return CreatedAtRoute("GetIprById", new { id = ipr._id.ToString() }, ipr);
        }

        // ✅ PUT update existing
        [HttpPut("{id:length(24)}")]
        public async Task<IActionResult> Update(string id, Ipr iprIn)
        {
            var result = await _ipr.ReplaceOneAsync(i => i._id == id, iprIn);
            if (result.MatchedCount == 0)
                return NotFound();

            return NoContent();
        }

        // ✅ DELETE
        [HttpDelete("{id:length(24)}")]
        public async Task<IActionResult> Delete(string id)
        {
            var result = await _ipr.DeleteOneAsync(i => i._id == id);
            if (result.DeletedCount == 0)
                return NotFound();

            return NoContent();
        }
    }

}

