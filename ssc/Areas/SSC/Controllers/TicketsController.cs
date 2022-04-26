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
using ssc.Areas.SSC.Models;
using ssc.Areas.SSC.Services;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Authorization;

namespace ssc.Areas.SSC.Controllers
{
    [Route("api/ssc/[controller]")]
    [ApiController]
    public class TicketsController : ControllerBase
    {
        private readonly IMongoCollection<Ticket> _tickets;
        private ProjectionDefinition<Ticket> _fields;

        public TicketsController(ISSCDatabaseSettings settings)
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

        [Authorize("IctTickets Read")]
        [HttpGet]
        public JsonResult Get(String sort = "submitDate", String order = "desc", int page = 0, int pagesize = 50, String filter = "", String columnfilter = "", string mode = "")
        {

            //var _items = _tickets.Find(t => true);
            FilterDefinition<Ticket> xfilter = Builders<Ticket>.Filter.Ne("a", "b");
            FilterDefinition<Ticket> xcolfilter;

            if (!String.IsNullOrWhiteSpace(filter))
            {
                filter = filter.ToLower();
                xfilter = 
                    Builders<Ticket>.Filter.Regex(t => t.id, new BsonRegularExpression(filter, "i")) |
                    Builders<Ticket>.Filter.Regex(t => t.type, new BsonRegularExpression(filter, "i")) |
                    Builders<Ticket>.Filter.Regex(t => t.displayId, new BsonRegularExpression(filter, "i")) |
                    Builders<Ticket>.Filter.Regex(t => t.summary, new BsonRegularExpression(filter, "i")) |
                    Builders<Ticket>.Filter.Regex(t => t.customer.fullName, new BsonRegularExpression(filter, "i")) |
                    Builders<Ticket>.Filter.Regex(t => t.customer.company.name, new BsonRegularExpression(filter, "i")) |
                    Builders<Ticket>.Filter.Regex(t => t.customer.site.name, new BsonRegularExpression(filter, "i")) |
                    Builders<Ticket>.Filter.Regex(t => t.customer.department, new BsonRegularExpression(filter, "i")) |
                    Builders<Ticket>.Filter.Regex(t => t.customer.customFields.pa.PERS_AREA_TEXT, new BsonRegularExpression(filter, "i")) |
                    Builders<Ticket>.Filter.Regex(t => t.customer.customFields.psa.PERS_SUBAREA_TEXT, new BsonRegularExpression(filter, "i")) |
                    Builders<Ticket>.Filter.Regex(t => t.assignee.fullName, new BsonRegularExpression(filter, "i")) |
                    Builders<Ticket>.Filter.Regex(t => t.assignee.loginId, new BsonRegularExpression(filter, "i")) |
                    Builders<Ticket>.Filter.Regex(t => t.assignee.customFields.pa.PERS_AREA_TEXT, new BsonRegularExpression(filter, "i")) |
                    Builders<Ticket>.Filter.Regex(t => t.assignee.customFields.psa.PERS_SUBAREA_TEXT, new BsonRegularExpression(filter, "i")) |
                    Builders<Ticket>.Filter.Regex(t => t.assignee.customFields.group.name, new BsonRegularExpression(filter, "i")) |
                    Builders<Ticket>.Filter.Regex(t => t.priority, new BsonRegularExpression(filter, "i")) |
                    Builders<Ticket>.Filter.Regex(t => t.status.value, new BsonRegularExpression(filter, "i")) |
                    Builders<Ticket>.Filter.Regex(t => t.status.reason, new BsonRegularExpression(filter, "i")) |
                    Builders<Ticket>.Filter.Regex(t => t.supportGroup.name, new BsonRegularExpression(filter, "i")) |
                    Builders<Ticket>.Filter.Regex(t => t.submitDate, new BsonRegularExpression(filter, "i")) |
                    Builders<Ticket>.Filter.Regex(t => t.completedDate, new BsonRegularExpression(filter, "i")) |
                    Builders<Ticket>.Filter.Regex(t => t.slaStatus, new BsonRegularExpression(filter, "i")) |
                    Builders<Ticket>.Filter.Regex(t => t.modifiedDate, new BsonRegularExpression(filter, "i"));
            }
            
            if (!String.IsNullOrWhiteSpace(columnfilter))
            {
                xcolfilter = Builders<Ticket>.Filter.Ne("a", "b");
                TicketList colfilter = JsonConvert.DeserializeObject<TicketList>(columnfilter);
                /*
                if (colfilter._id?.Length > 0) xcolfilter = xcolfilter & Builders<Ticket>.Filter.Or(colfilter._id.ToList().Select(c => Builders<Ticket>.Filter.Regex(t => t._id, new BsonRegularExpression(c, "i"))));
                if (colfilter.id?.Length > 0) xcolfilter = xcolfilter & Builders<Ticket>.Filter.Or(colfilter.id.ToList().Select(c => Builders<Ticket>.Filter.Regex(t => t.id, new BsonRegularExpression(c, "i"))));
                if (colfilter.type?.Length > 0) xcolfilter = xcolfilter & Builders<Ticket>.Filter.Or(colfilter.type.ToList().Select(c => Builders<Ticket>.Filter.Regex(t => t.type, new BsonRegularExpression(c, "i"))));
                if (colfilter.displayId?.Length > 0) xcolfilter = xcolfilter & Builders<Ticket>.Filter.Or(colfilter.displayId.ToList().Select(c => Builders<Ticket>.Filter.Regex(t => t.displayId, new BsonRegularExpression(c, "i"))));
                if (colfilter.summary?.Length > 0) xcolfilter = xcolfilter & Builders<Ticket>.Filter.Or(colfilter.summary.ToList().Select(c => Builders<Ticket>.Filter.Regex(t => t.summary, new BsonRegularExpression(c, "i"))));
                if (colfilter.customer_fullName?.Length > 0) xcolfilter = xcolfilter & Builders<Ticket>.Filter.Or(colfilter.customer_fullName.ToList().Select(c => Builders<Ticket>.Filter.Regex(t => t.customer.fullName, new BsonRegularExpression(c, "i"))));
                if (colfilter.customer_company?.Length > 0) xcolfilter = xcolfilter & Builders<Ticket>.Filter.Or(colfilter.customer_company.ToList().Select(c => Builders<Ticket>.Filter.Regex(t => t.customer.company, new BsonRegularExpression(c, "i"))));
                if (colfilter.customer_site?.Length > 0) xcolfilter = xcolfilter & Builders<Ticket>.Filter.Or(colfilter.customer_site.ToList().Select(c => Builders<Ticket>.Filter.Regex(t => t.customer.site, new BsonRegularExpression(c, "i"))));
                if (colfilter.customer_department?.Length > 0) xcolfilter = xcolfilter & Builders<Ticket>.Filter.Or(colfilter.customer_department.ToList().Select(c => Builders<Ticket>.Filter.Regex(t => t.customer.department, new BsonRegularExpression(c, "i"))));
                if (colfilter.customer_pa?.Length > 0) xcolfilter = xcolfilter & Builders<Ticket>.Filter.Or(colfilter.customer_pa.ToList().Select(c => Builders<Ticket>.Filter.Regex(t => t.customer.customFields.pa.PERS_AREA_TEXT, new BsonRegularExpression(c, "i"))));
                if (colfilter.customer_psa?.Length > 0) xcolfilter = xcolfilter & Builders<Ticket>.Filter.Or(colfilter.customer_psa.ToList().Select(c => Builders<Ticket>.Filter.Regex(t => t.customer.customFields.psa.PERS_SUBAREA_TEXT, new BsonRegularExpression(c, "i"))));
                if (colfilter.assignee_fullName?.Length > 0) xcolfilter = xcolfilter & Builders<Ticket>.Filter.Or(colfilter.assignee_fullName.ToList().Select(c => Builders<Ticket>.Filter.Regex(t => t.assignee.fullName, new BsonRegularExpression(c, "i"))));
                if (colfilter.assignee_loginId?.Length > 0) xcolfilter = xcolfilter & Builders<Ticket>.Filter.Or(colfilter.assignee_loginId.ToList().Select(c => Builders<Ticket>.Filter.Regex(t => t.assignee.loginId, new BsonRegularExpression(c, "i"))));
                if (colfilter.assignee_pa?.Length > 0) xcolfilter = xcolfilter & Builders<Ticket>.Filter.Or(colfilter.assignee_pa.ToList().Select(c => Builders<Ticket>.Filter.Regex(t => t.assignee.customFields.pa.PERS_AREA_TEXT, new BsonRegularExpression(c, "i"))));
                if (colfilter.assignee_psa?.Length > 0) xcolfilter = xcolfilter & Builders<Ticket>.Filter.Or(colfilter.assignee_psa.ToList().Select(c => Builders<Ticket>.Filter.Regex(t => t.assignee.customFields.psa.PERS_SUBAREA_TEXT, new BsonRegularExpression(c, "i"))));
                if (colfilter.assignee_group?.Length > 0) xcolfilter = xcolfilter & Builders<Ticket>.Filter.Or(colfilter.assignee_group.ToList().Select(c => Builders<Ticket>.Filter.Regex(t => t.assignee.customFields.group.name, new BsonRegularExpression(c, "i"))));
                if (colfilter.priority?.Length > 0) xcolfilter = xcolfilter & Builders<Ticket>.Filter.Or(colfilter.priority.ToList().Select(c => Builders<Ticket>.Filter.Regex(t => t.priority, new BsonRegularExpression(c, "i"))));
                if (colfilter.status_value?.Length > 0) xcolfilter = xcolfilter & Builders<Ticket>.Filter.Or(colfilter.status_value.ToList().Select(c => Builders<Ticket>.Filter.Regex(t => t.status.value, new BsonRegularExpression(c, "i"))));
                if (colfilter.status_reason?.Length > 0) xcolfilter = xcolfilter & Builders<Ticket>.Filter.Or(colfilter.status_reason.ToList().Select(c => Builders<Ticket>.Filter.Regex(t => t.status.reason, new BsonRegularExpression(c, "i"))));
                if (colfilter.supportGroup_name?.Length > 0) xcolfilter = xcolfilter & Builders<Ticket>.Filter.Or(colfilter.supportGroup_name.ToList().Select(c => Builders<Ticket>.Filter.Regex(t => t.supportGroup.name, new BsonRegularExpression(c, "i"))));
                if (colfilter.submitDate?.Length > 0) xcolfilter = xcolfilter & Builders<Ticket>.Filter.Or(colfilter.submitDate.ToList().Select(c => Builders<Ticket>.Filter.Eq(t => t.submitDate, c)));
                if (colfilter.completedDate?.Length > 0) xcolfilter = xcolfilter & Builders<Ticket>.Filter.Or(colfilter.completedDate.ToList().Select(c => Builders<Ticket>.Filter.Eq(t => t.completedDate, c)));
                if (colfilter.slaStatus?.Length > 0) xcolfilter = xcolfilter & Builders<Ticket>.Filter.Or(colfilter.slaStatus.ToList().Select(c => Builders<Ticket>.Filter.Regex(t => t.slaStatus, new BsonRegularExpression(c, "i"))));
                if (colfilter.modifiedDate?.Length > 0) xcolfilter = xcolfilter & Builders<Ticket>.Filter.Or(colfilter.modifiedDate.ToList().Select(c => Builders<Ticket>.Filter.Eq(t => t.modifiedDate, c)));

                if (colfilter.start_submitDate > 0 && colfilter.end_submitDate > 0) {
                    xcolfilter = xcolfilter
                        & (Builders<Ticket>.Filter.Gte(t => t.submitDate, colfilter.start_submitDate)) & (Builders<Ticket>.Filter.Lt(t => t.submitDate, colfilter.end_submitDate))
                        & (Builders<Ticket>.Filter.In(t => t.status.value, Common.closed));
                }
                if (colfilter.group != null) xcolfilter = xcolfilter & Builders<Ticket>.Filter.Or(Builders<Ticket>.Filter.Regex(t => t.assignee.customFields.group.name, new BsonRegularExpression(colfilter.group, "i")));
                if (colfilter.status != null) xcolfilter = xcolfilter & Builders<Ticket>.Filter.Or(Builders<Ticket>.Filter.Regex(t => t.slaStatus, new BsonRegularExpression(Common.status[colfilter.status], "i")));
                */
                if (colfilter.id?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Ticket>.Filter.Or(colfilter.id.ToList().Where(c => !(c is JObject)).Select(c => Builders<Ticket>.Filter.Regex(t => t.id, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.type?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Ticket>.Filter.Or(colfilter.type.ToList().Where(c => !(c is JObject)).Select(c => Builders<Ticket>.Filter.Regex(t => t.type, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.displayId?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Ticket>.Filter.Or(colfilter.displayId.ToList().Where(c => !(c is JObject)).Select(c => Builders<Ticket>.Filter.Regex(t => t.displayId, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.summary?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Ticket>.Filter.Or(colfilter.summary.ToList().Where(c => !(c is JObject)).Select(c => Builders<Ticket>.Filter.Regex(t => t.summary, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.customer_fullName?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Ticket>.Filter.Or(colfilter.customer_fullName.ToList().Where(c => !(c is JObject)).Select(c => Builders<Ticket>.Filter.Regex(t => t.customer.fullName, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.customer_company?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Ticket>.Filter.Or(colfilter.customer_company.ToList().Where(c => !(c is JObject)).Select(c => Builders<Ticket>.Filter.Regex(t => t.customer.company, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.customer_site?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Ticket>.Filter.Or(colfilter.customer_site.ToList().Where(c => !(c is JObject)).Select(c => Builders<Ticket>.Filter.Regex(t => t.customer.site, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.customer_department?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Ticket>.Filter.Or(colfilter.customer_department.ToList().Where(c => !(c is JObject)).Select(c => Builders<Ticket>.Filter.Regex(t => t.customer.department, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.customer_pa?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Ticket>.Filter.Or(colfilter.customer_pa.ToList().Where(c => !(c is JObject)).Select(c => Builders<Ticket>.Filter.Regex(t => t.customer.customFields.pa.PERS_AREA_TEXT, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.customer_psa?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Ticket>.Filter.Or(colfilter.customer_psa.ToList().Where(c => !(c is JObject)).Select(c => Builders<Ticket>.Filter.Regex(t => t.customer.customFields.psa.PERS_SUBAREA_TEXT, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.assignee_fullName?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Ticket>.Filter.Or(colfilter.assignee_fullName.ToList().Where(c => !(c is JObject)).Select(c => Builders<Ticket>.Filter.Regex(t => t.assignee.fullName, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.assignee_pa?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Ticket>.Filter.Or(colfilter.assignee_pa.ToList().Where(c => !(c is JObject)).Select(c => Builders<Ticket>.Filter.Regex(t => t.assignee.customFields.pa.PERS_AREA_TEXT, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.assignee_psa?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Ticket>.Filter.Or(colfilter.assignee_psa.ToList().Where(c => !(c is JObject)).Select(c => Builders<Ticket>.Filter.Regex(t => t.assignee.customFields.psa.PERS_SUBAREA_TEXT, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.assignee_loginId?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Ticket>.Filter.Or(colfilter.assignee_loginId.ToList().Where(c => !(c is JObject)).Select(c => Builders<Ticket>.Filter.Regex(t => t.assignee.loginId, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.assignee_group?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Ticket>.Filter.Or(colfilter.assignee_group.ToList().Where(c => !(c is JObject)).Select(c => Builders<Ticket>.Filter.Regex(t => t.assignee.customFields.group.name, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.priority?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Ticket>.Filter.Or(colfilter.priority.ToList().Where(c => !(c is JObject)).Select(c => Builders<Ticket>.Filter.Regex(t => t.priority, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.status_value?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Ticket>.Filter.Or(colfilter.status_value.ToList().Where(c => !(c is JObject)).Select(c => Builders<Ticket>.Filter.Regex(t => t.status.value, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.status_reason?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Ticket>.Filter.Or(colfilter.status_reason.ToList().Where(c => !(c is JObject)).Select(c => Builders<Ticket>.Filter.Regex(t => t.status.reason, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.supportGroup_name?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Ticket>.Filter.Or(colfilter.supportGroup_name.ToList().Where(c => !(c is JObject)).Select(c => Builders<Ticket>.Filter.Regex(t => t.supportGroup.name, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.submitDate?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Ticket>.Filter.Or(colfilter.submitDate.ToList().Select(c => (c is Int64) ? Builders<Ticket>.Filter.Eq(t => t.submitDate, c) : "{$expr:{$regexMatch:{input:{$dateToString:{format:\"%d %m %Y\",date:{$toDate:\"$submitDate\"},timezone:\"" + TimeZoneInfo.Local.DisplayName.Substring(4, 6) + "\"}},regex:/" + Common.ReplaceMonth((string)c) + "/i}}}"));
                if (colfilter.completedDate?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Ticket>.Filter.Or(colfilter.completedDate.ToList().Where(c => !(c is JObject)).Select(c => Builders<Ticket>.Filter.Regex(t => t.completedDate, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.slaStatus?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Ticket>.Filter.Or(colfilter.slaStatus.ToList().Where(c => !(c is JObject)).Select(c => Builders<Ticket>.Filter.Regex(t => t.slaStatus, new BsonRegularExpression(Common.status[(string)c], "i"))));
                if (colfilter.modifiedDate?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Ticket>.Filter.Or(colfilter.modifiedDate.ToList().Select(c => (c is Int64) ? Builders<Ticket>.Filter.Eq(t => t.modifiedDate, c) : "{$expr:{$regexMatch:{input:{$dateToString:{format:\"%d %m %Y\",date:{$toDate:\"$modifiedDate\"},timezone:\"" + TimeZoneInfo.Local.DisplayName.Substring(4, 6) + "\"}},regex:/" + Common.ReplaceMonth((string)c) + "/i}}}"));

                foreach (string log in Common._logical)
                {
                    if (colfilter.id?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.id.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$id\",regex:\"{0}\",options:\"i\"}}}}", Common.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.type?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.type.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$type\",regex:\"{0}\",options:\"i\"}}}}", Common.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.displayId?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.displayId.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$displayId\",regex:\"{0}\",options:\"i\"}}}}", Common.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.summary?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.summary.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$summary\",regex:\"{0}\",options:\"i\"}}}}", Common.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.customer_fullName?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.customer_fullName.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$customer.fullName\",regex:\"{0}\",options:\"i\"}}}}", Common.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.customer_company?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.customer_company.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$customer.company\",regex:\"{0}\",options:\"i\"}}}}", Common.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.customer_site?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.customer_site.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$customer.site\",regex:\"{0}\",options:\"i\"}}}}", Common.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.customer_department?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.customer_department.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$customer.department\",regex:\"{0}\",options:\"i\"}}}}", Common.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.customer_pa?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.customer_pa.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$customer.customFields.pa.PERS_AREA_TEXT\",regex:\"{0}\",options:\"i\"}}}}", Common.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.customer_psa?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.customer_psa.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$customer.customFields.psa.PERS_SUBAREA_TEXT\",regex:\"{0}\",options:\"i\"}}}}", Common.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.assignee_fullName?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.assignee_fullName.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$assignee.fullName\",regex:\"{0}\",options:\"i\"}}}}", Common.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.assignee_loginId?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.assignee_loginId.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$assignee.loginId\",regex:\"{0}\",options:\"i\"}}}}", Common.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.assignee_group?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.assignee_group.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$assignee.customFields.group.name\",regex:\"{0}\",options:\"i\"}}}}", Common.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.assignee_pa?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.assignee_pa.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$assignee.customFields.pa.PERS_AREA_TEXT\",regex:\"{0}\",options:\"i\"}}}}", Common.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.assignee_psa?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.assignee_psa.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$assignee.customFields.psa.PERS_SUBAREA_TEXT\",regex:\"{0}\",options:\"i\"}}}}", Common.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.priority?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.priority.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$priority\",regex:\"{0}\",options:\"i\"}}}}", Common.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.status_value?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.status_value.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$status.value\",regex:\"{0}\",options:\"i\"}}}}", Common.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.status_reason?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.status_reason.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$status.reason\",regex:\"{0}\",options:\"i\"}}}}", Common.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.supportGroup_name?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.supportGroup_name.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$supportGroup.name\",regex:\"{0}\",options:\"i\"}}}}", Common.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.submitDate?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.submitDate.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDate:\"$submitDate\"}},ISODate(\"{1}\")]}}", ((JObject)c).GetValue("opr"), DateTime.Parse(((JObject)c).GetValue("val").ToString()).ToString("yyyy-MM-ddTHH:mm:ssZ"))).ToArray()), log);
                    if (colfilter.completedDate?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.completedDate.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$completedDate\",regex:\"{0}\",options:\"i\"}}}}", Common.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.slaStatus?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.slaStatus.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$slaStatus\",regex:\"{0}\",options:\"i\"}}}}", Common.TextPattern(((JObject)c).GetValue("opr").ToString(), Common.status[((JObject)c).GetValue("val").ToString()]))).ToArray()), log);
                    if (colfilter.modifiedDate?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.modifiedDate.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDate:\"$modifiedDate\"}},ISODate(\"{1}\")]}}", ((JObject)c).GetValue("opr"), DateTime.Parse(((JObject)c).GetValue("val").ToString()).ToString("yyyy-MM-ddTHH:mm:ssZ"))).ToArray()), log);
                }

                xfilter = xfilter & xcolfilter;
            }

            var _items = _tickets.Find(xfilter, new FindOptions() { Collation = new Collation("en_US", numericOrdering: true) });
            var total_count = _items.CountDocuments();

            switch (sort)
            {
                case "type": _items = (order == "asc") ? _items.SortBy(t => t.type) : _items.SortByDescending(t => t.type);break;
                case "displayId": _items = (order == "asc") ? _items.SortBy(t => t.displayId) : _items.SortByDescending(t => t.displayId); break;
                case "summary": _items = (order == "asc") ? _items.SortBy(t => t.summary) : _items.SortByDescending(t => t.summary); break;
                case "customer_fullName": _items = (order == "asc") ? _items.SortBy(t => t.customer.fullName) : _items.SortByDescending(t => t.customer.fullName); break;
                case "customer_company": _items = (order == "asc") ? _items.SortBy(t => t.customer.company.name) : _items.SortByDescending(t => t.customer.company.name); break;
                case "customer_site": _items = (order == "asc") ? _items.SortBy(t => t.customer.site.name) : _items.SortByDescending(t => t.customer.site.name); break;
                case "customer_department": _items = (order == "asc") ? _items.SortBy(t => t.customer.department) : _items.SortByDescending(t => t.customer.department); break;
                case "customer_pa": _items = (order == "asc") ? _items.SortBy(t => t.customer.customFields.pa.PERS_AREA_TEXT) : _items.SortByDescending(t => t.customer.customFields.pa.PERS_AREA_TEXT); break;
                case "customer_psa": _items = (order == "asc") ? _items.SortBy(t => t.customer.customFields.psa.PERS_SUBAREA_TEXT) : _items.SortByDescending(t => t.customer.customFields.psa.PERS_SUBAREA_TEXT); break;
                case "assignee_fullName": _items = (order == "asc") ? _items.SortBy(t => t.assignee.fullName) : _items.SortByDescending(t => t.assignee.fullName); break;
                case "assignee_loginId": _items = (order == "asc") ? _items.SortBy(t => t.assignee.loginId) : _items.SortByDescending(t => t.assignee.loginId); break;
                case "assignee_pa": _items = (order == "asc") ? _items.SortBy(t => t.assignee.customFields.pa.PERS_AREA_TEXT) : _items.SortByDescending(t => t.assignee.customFields.pa.PERS_AREA_TEXT); break;
                case "assignee_psa": _items = (order == "asc") ? _items.SortBy(t => t.assignee.customFields.psa.PERS_SUBAREA_TEXT) : _items.SortByDescending(t => t.assignee.customFields.psa.PERS_SUBAREA_TEXT); break;
                case "assignee_group": _items = (order == "asc") ? _items.SortBy(t => t.assignee.customFields.group.name) : _items.SortByDescending(t => t.assignee.customFields.group.name); break;
                case "priority": _items = (order == "asc") ? _items.SortBy(t => t.priority) : _items.SortByDescending(t => t.priority); break;
                case "status_value": _items = (order == "asc") ? _items.SortBy(t => t.status.value) : _items.SortByDescending(t => t.status.value); break;
                case "status_reason": _items = (order == "asc") ? _items.SortBy(t => t.status.reason) : _items.SortByDescending(t => t.status.reason); break;
                case "supportGroup_name": _items = (order == "asc") ? _items.SortBy(t => t.supportGroup.name) : _items.SortByDescending(t => t.supportGroup.name); break;
                case "submitDate": _items = (order == "asc") ? _items.SortBy(t => t.submitDate) : _items.SortByDescending(t => t.submitDate); break;
                case "completedDate": _items = (order == "asc") ? _items.SortBy(t => t.completedDate) : _items.SortByDescending(t => t.completedDate); break;
                case "slaStatus": _items = (order == "asc") ? _items.SortBy(t => t.slaStatus) : _items.SortByDescending(t => t.slaStatus); break;
                case "modifiedDate": _items = (order == "asc") ? _items.SortBy(t => t.modifiedDate) : _items.SortByDescending(t => t.modifiedDate); break;
                default : _items = (order == "asc") ? _items.SortBy(t => t.id) : _items.SortByDescending(t => t.id); break;
            }

            switch (mode)
            {
                case "":
                case null:
                    List<Ticket> items = _items
                    .Skip(page * pagesize)
                    .Limit(pagesize)
                    .Project<Ticket>(_fields).ToList();

                    return new JsonResult(new
                    {
                        total_count = total_count,
                        incomplete_result = false,
                        items = items,
                    })
                    {
                        StatusCode = StatusCodes.Status200OK
                    };

                case "excel":
                    //return GetExcel(_items.Project<Ticket>(_fields).ToList());

                default:
                    dynamic res;
                    switch (mode)
                    {
                        case "submitDate":
                        case "completedDate":
                        case "modifiedDate":
                        case "start_submitDate":
                        case "end_submitDate":
                            res = _tickets.Distinct<Int64>(mode, xfilter).ToEnumerable().OrderByDescending(t => t).ToList();
                            break;
                        case "customer_fullName":
                        case "customer_department":
                        case "assignee_fullName":
                        case "assignee_loginId":
                        case "status_value":
                        case "status_reason":
                        case "supportGroup_name":
                            res = _tickets.Distinct<string>(mode.Replace("_","."), xfilter).ToEnumerable().OrderBy(t => t).ToList();
                            break;
                        case "customer_company":
                        case "customer_site":
                            res = _tickets.Distinct<string>(mode.Replace("_", ".") + ".name", xfilter).ToEnumerable().OrderBy(t => t).ToList();
                            break;
                        case "customer_pa":
                        case "assignee_pa":
                            res = _tickets.Distinct<string>(mode.Replace("_pa", ".customFields.pa.PERS_AREA_TEXT"), xfilter).ToEnumerable().OrderBy(t => t).ToList();
                            break;
                        case "customer_psa":
                        case "assignee_psa":
                            res = _tickets.Distinct<string>(mode.Replace("_psa", ".customFields.psa.PERS_SUBAREA_TEXT"), xfilter).ToEnumerable().OrderBy(t => t).ToList();
                            break;
                        case "assignee_group":
                            res = _tickets.Distinct<string>(mode.Replace("_group", ".customFields.group.name"), xfilter).ToEnumerable().OrderBy(t => t).ToList();
                            break;
                        default:
                            res = _tickets.Distinct<string>(mode, xfilter).ToEnumerable().OrderBy(t => t).ToList();
                            break;
                    }

                    return new JsonResult(new
                    {
                        //total_count = res.Count(),
                        items = res,
                    });
            }
            /*
            List<TicketList> items = _items
                .Skip(page*pagesize)
                .Limit(pagesize)
                .Project<Ticket>(_fields).ToList()
                .Select(t => new TicketList
            {
                id = t.id,
                type = t.type,
                displayId = t.displayId,
                summary = t.summary,
                customer_fullName = t.customer?.fullName,
                customer_company = t.customer?.company?.name,
                customer_site = t.customer?.site?.name,
                customer_department = t.customer?.department,
                customer_pa = t.customer?.customFields?.pa?.PERS_AREA_TEXT,
                customer_psa = t.customer?.customFields?.psa?.PERS_SUBAREA_TEXT,
                assignee_fullName = t.assignee?.fullName,
                assignee_loginId = t.assignee?.loginId,
                assignee_pa = t.assignee?.customFields?.pa?.PERS_AREA_TEXT,
                assignee_psa = t.assignee?.customFields?.psa?.PERS_SUBAREA_TEXT,
                assignee_group = t.assignee?.customFields?.group?.name,
                priority = t.priority,
                status_value = t.status?.value,
                status_reason = t.status?.reason,
                supportGroup_name = t.supportGroup?.name,
                submitDate = t.submitDate,
                completedDate = t.completedDate,
                slaStatus = t.slaStatus,
                modifiedDate = t.modifiedDate,
                }).ToList();

            return new JsonResult(new
            {
                total_count = total_count,
                incomplete_result = false,
                items = items,
            })
            {
                StatusCode = StatusCodes.Status200OK
            };*/
        }

        [HttpPost]
        public ActionResult Post(dynamic items)
        {
            return Ok(new {
                result = true
            });
        }
    }


}