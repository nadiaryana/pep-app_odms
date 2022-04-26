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
using ssc.Areas.SSC.Models;
using ssc.Areas.SSC.Services;
using System.Text.RegularExpressions;

namespace ssc.Areas.SSC.Controllers
{
    [Route("api/ssc/[controller]")]
    [ApiController]
    public class SLAController : ControllerBase
    {
        private readonly IMongoCollection<Ticket> _tickets;
        private ProjectionDefinition<Ticket> _fields;

        public SLAController(ISSCDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);

            _tickets = database.GetCollection<Ticket>(settings.TicketCollectionName);
            _fields = Builders<Ticket>.Projection
                .Include(t => t._id)
                .Include(t => t.id)
                .Include(t => t.type)
                .Include(t => t.displayId)
                .Include(t => t.summary)
                .Include(t => t.customer.fullName).Include(t => t.customer.lastName).Include(t => t.customer.department)
                .Include(t => t.customer.company.name).Include(t => t.customer.site.name)
                .Include(t => t.customer.customFields.pa.PERS_AREA_TEXT).Include(t => t.customer.customFields.psa.PERS_SUBAREA_TEXT)
                .Include(t => t.assignee.fullName).Include(t => t.assignee.loginId)
                .Include(t => t.assignee.customFields.pa.PERS_AREA_TEXT).Include(t => t.assignee.customFields.psa.PERS_SUBAREA_TEXT)
                .Include(t => t.assignee.customFields.group.name).Include(t => t.assignee.customFields.group.index)
                .Include(t => t.priority)
                .Include(t => t.status.value).Include(t => t.status.reason)
                .Include(t => t.supportGroup.name)
                .Include(t => t.submitDate)
                .Include(t => t.completedDate)
                .Include(t => t.slaStatus)
                .Include(t => t.modifiedDate);
        }

        [Authorize("IctSla Read")]
        [HttpGet]
        public JsonResult Get(String sort = "id", String order = "asc", int page = 0, int pagesize = 10, String filter = "", String columnfilter = "")
        {

            //DateTime date = DateTime.Now;
            long minTime = 0;
            long maxTime = 0;

            if (!String.IsNullOrWhiteSpace(columnfilter))
            {
                SLAFilter colfilter = JsonConvert.DeserializeObject<SLAFilter>(columnfilter);
                minTime = colfilter.start_submitDate;
                if(colfilter.duration == "month")
                {
                    maxTime = DateTimeOffset.FromUnixTimeMilliseconds(minTime).AddMonths(1).ToUnixTimeMilliseconds();
                }
            }
            
            //long minTime = ((DateTimeOffset)new DateTime(date.Year, date.Month, 1)).ToUnixTimeMilliseconds();
            //long maxTime = ((DateTimeOffset)new DateTime(date.Year, date.Month, 1).AddMonths(1)).ToUnixTimeMilliseconds();
            List<SLA> res = _tickets.Find(
                t => t.submitDate < maxTime && t.submitDate >= minTime && Common.closed.Contains(t.status.value)
            ).Project<Ticket>(_fields).ToList()
                .GroupBy(t => new { name = t.assignee?.customFields?.group?.name, index = t.assignee?.customFields?.group?.index })
                .Select(s => new SLA
                {
                    group = s.Key.name,
                    no = s.Key.index,
                    met = s.Where(m => m.slaStatus == Common.status["met"]).Count(),
                    missed = s.Where(m => m.slaStatus == Common.status["missed"]).Count(),
                    total = s.Count(),
                    sla = Convert.ToDecimal(s.Where(m => m.slaStatus == Common.status["met"]).Count())/ Convert.ToDecimal(s.Count()),
                })
                .OrderBy(t => t.no).ToList();

            //var res = _tickets.Find(t => true).Project<Ticket>(_fields).ToList()
            //    .GroupBy(t => new { t.assignee?.customFields?.group?.name, t.slaStatus, month = DateTimeOffset.FromUnixTimeMilliseconds(t.submitDate).UtcDateTime.ToString("yyyy-MM-01") })
            //    .Select(s => new
            //    {
            //        group = s.Key.name,
            //        slaStatus = s.Key.slaStatus,
            //        month = s.Key.month,
            //        count = s.Count()
            //    });

            return new JsonResult(new
            {
                //total_count = total_count,
                //incomplete_result = false,
                items = res,
            })
            {
                StatusCode = StatusCodes.Status200OK
            };
        }
    }
}