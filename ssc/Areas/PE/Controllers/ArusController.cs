using Microsoft.AspNetCore.Mvc;
using ssc.Areas.PE.Models;
using ssc.Services;
using System;
using System.Threading.Tasks;

namespace ssc.Areas.PE.Controllers
{
    [Area("PE")]
    [ApiController]
    [Route("api/arus")]
    public class ArusController : ControllerBase
    {
        private readonly ArusService _arusService;

        public ArusController(ArusService arusService)
        {
            _arusService = arusService;
        }

        // POST /api/arus/data  ← ESP32 kirim ke sini
        [HttpPost("data")]
        public async Task<IActionResult> PostData([FromBody] ArusReading data)
        {
            if (string.IsNullOrEmpty(data.WellId))
                return BadRequest(new { message = "well_id tidak boleh kosong." });

            data.CreatedAt = DateTime.UtcNow;
            await _arusService.InsertAsync(data);
            return Ok(new { status = "ok", well_id = data.WellId });
        }

        // GET /api/arus/data/{wellId}?limit=100  ← Angular chart
        [HttpGet("data/{wellId}")]
        public async Task<IActionResult> GetData(string wellId, [FromQuery] int limit = 100)
        {
            var data = await _arusService.GetByWellAsync(wellId, limit);
            return Ok(data);
        }

        // GET /api/arus/data/{wellId}/range?from=&to=
        [HttpGet("data/{wellId}/range")]
        public async Task<IActionResult> GetDataRange(
            string wellId, [FromQuery] DateTime from, [FromQuery] DateTime to)
        {
            var data = await _arusService.GetByWellAndRangeAsync(wellId, from, to);
            return Ok(data);
        }

        // GET /api/arus/laststatus/{wellId}  ← ESP32 saat boot
        [HttpGet("laststatus/{wellId}")]
        public async Task<IActionResult> GetLastStatus(string wellId)
        {
            var last = await _arusService.GetLastReadingAsync(wellId);
            if (last == null)
                return Ok(new { last_status = 0, current = 0.0, recorded_at = "" });

            return Ok(new
            {
                last_status = last.Status,
                current = last.Current,
                recorded_at = last.RecordedAt
            });
        }

        // GET /api/arus/wells  ← Angular dropdown
        [HttpGet("wells")]
        public async Task<IActionResult> GetAllWells()
        {
            var wells = await _arusService.GetAllWellIdsAsync();
            return Ok(wells);
        }
    }
}