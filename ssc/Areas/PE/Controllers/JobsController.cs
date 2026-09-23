using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using ssc.Models;
using ssc.Services;

namespace ssc.Controllers
{
    [Route("api/jobs")]
    [ApiController]
    public class JobsController : ControllerBase
    {
        private readonly IJobTracker _jobTracker;

        public JobsController(IJobTracker jobTracker)
        {
            _jobTracker = jobTracker;
        }

        // GET api/jobs/mine?hours=24
        [Authorize("PeDaily Add", "PeDaily Read", "PeSumur Add")]
        [HttpGet("mine")]
        public ActionResult GetMine(int hours = 24)
        {
            try
            {
                hours = Math.Max(1, Math.Min(hours, 72));
                var jobs = _jobTracker.GetByUser(User.Identity.Name, DateTime.UtcNow.AddHours(-hours));

                var items = jobs.Select(j => new
                {
                    j._id,
                    j.module,
                    j.ref_id,
                    j.file_name,
                    j.status,
                    j.message,
                    j.progress_current,
                    j.progress_total,
                    j.queued_at,
                    j.started_at,
                    j.finished_at,
                    queue_position = _jobTracker.GetQueuePosition(j)
                }).ToList();

                return Ok(new
                {
                    items,
                    active_count = items.Count(i => i.status == JobStatus.Queued || i.status == JobStatus.Running),
                    failed_count = items.Count(i => i.status == JobStatus.Failed || i.status == JobStatus.Interrupted
                                                 || i.status == JobStatus.Warning)
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // POST api/jobs/{id}/dismiss  → sembunyikan satu item dari panel
        [Authorize("PeDaily Add", "PeDaily Read", "PeSumur Add")]
        [HttpPost("{id}/dismiss")]
        public ActionResult Dismiss(string id)
        {
            _jobTracker.Dismiss(id, User.Identity.Name);
            return Ok();
        }

        // POST api/jobs/dismiss-finished → "Bersihkan" semua yang sudah selesai
        [Authorize("PeDaily Add", "PeDaily Read", "PeSumur Add")]
        [HttpPost("dismiss-finished")]
        public ActionResult DismissFinished()
        {
            _jobTracker.DismissFinished(User.Identity.Name);
            return Ok();
        }
    }
}