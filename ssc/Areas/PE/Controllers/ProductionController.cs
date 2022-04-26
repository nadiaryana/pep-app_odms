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
using Oracle.ManagedDataAccess.Client;

namespace ssc.Areas.PE.Controllers
{
    [Route("api/pe/[controller]")]
    [ApiController]
    public class ProductionController : ControllerBase
    {
        private OracleConnection conn = SOTCommon.conn;
        private OracleCommand cmd;

        private readonly IMongoCollection<Daily> _daily;
        private readonly IMongoCollection<Production> _production;
        private ProjectionDefinition<Daily> _fields_daily;
        private ProjectionDefinition<Production> _fields_production;

        public ProductionController(IPEDatabaseSettings settings)
        {
            _daily = DailyCommon._daily;
            _production = DailyCommon._production;
            _fields_daily = DailyCommon._fields_daily;
            _fields_production = DailyCommon._fields_production;
        }

        [HttpGet]
        public ActionResult Get(String sort = "date", String order = "desc", int page = 0, int pagesize = 50, String filter = "", String columnfilter = "", string mode = "")
        {
            FilterDefinition<Production> xfilter = Builders<Production>.Filter.Ne("a", "b");
            FilterDefinition<Production> xcolfilter;

            if (!String.IsNullOrWhiteSpace(filter))
            {
                filter = filter.ToLower();
                xfilter =
                    Builders<Production>.Filter.Regex(t => t.date, new BsonRegularExpression(filter, "i")) |
                    Builders<Production>.Filter.Regex(t => t.operation, new BsonRegularExpression(filter, "i")) |
                    Builders<Production>.Filter.Regex(t => t.sot, new BsonRegularExpression(filter, "i")) |
                    Builders<Production>.Filter.Regex(t => t.figure, new BsonRegularExpression(filter, "i")) |
                    Builders<Production>.Filter.Regex(t => t.gas, new BsonRegularExpression(filter, "i"));
            }

            if (!String.IsNullOrWhiteSpace(columnfilter))
            {
                xcolfilter = Builders<Production>.Filter.Ne("a", "b");
                ProductionList colfilter = JsonConvert.DeserializeObject<ProductionList>(columnfilter);

                if(!PrepareData(colfilter))
                {
                    return BadRequest();
                }

                if (colfilter.date?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Production>.Filter.Or(colfilter.date.ToList().Select(c => (c is DateTime) ? Builders<Production>.Filter.Eq(t => t.date, new BsonDateTime((DateTime)c)) : "{$expr:{$regexMatch:{input:{$dateToString:{format:\"%d %m %Y\",date:\"$date\",timezone:\"" + TimeZoneInfo.Local.DisplayName.Substring(4, 6) + "\"}},regex:/" + DailyCommon.ReplaceMonth((string)c) + "/i}}}"));
                if (colfilter.operation?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Production>.Filter.Or(colfilter.operation.ToList().Where(c => !(c is JObject)).Select(c => Builders<Production>.Filter.Regex(t => t.operation, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.sot?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Production>.Filter.Or(colfilter.sot.ToList().Where(c => !(c is JObject)).Select(c => Builders<Production>.Filter.Eq(t => t.sot, Convert.ToDecimal(c))));
                if (colfilter.figure?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Production>.Filter.Or(colfilter.figure.ToList().Where(c => !(c is JObject)).Select(c => Builders<Production>.Filter.Eq(t => t.figure, Convert.ToDecimal(c))));
                if (colfilter.gas?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Production>.Filter.Or(colfilter.gas.ToList().Where(c => !(c is JObject)).Select(c => Builders<Production>.Filter.Eq(t => t.gas, Convert.ToDecimal(c))));

                foreach (string log in DailyCommon._logical)
                {
                    if (colfilter.date?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.date.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[\"$date\",ISODate(\"{1}\")]}}", ((JObject)c).GetValue("opr"), DateTime.Parse(((JObject)c).GetValue("val").ToString()).ToString("yyyy-MM-ddTHH:mm:ssZ"))).ToArray()), log);
                    if (colfilter.operation?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.operation.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$operation\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.sot?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.sot.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$sot\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.figure?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.figure.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$figure\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.gas?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.gas.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$gas\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                }

                xfilter = xfilter & xcolfilter;
            } else
            {
                return BadRequest();
            }

            var _items = _production.Find(xfilter, new FindOptions() { Collation = new Collation("en_US", numericOrdering: true) });
            var total_count = _items.CountDocuments();

            switch (sort)
            {
                case "date": _items = (order == "asc") ? _items.SortBy(t => t.date) : _items.SortByDescending(t => t.date); break;
                case "operation": _items = (order == "asc") ? _items.SortBy(t => t.operation) : _items.SortByDescending(t => t.operation); break;
                case "sot": _items = (order == "asc") ? _items.SortBy(t => t.sot) : _items.SortByDescending(t => t.sot); break;
                case "figure": _items = (order == "asc") ? _items.SortBy(t => t.figure) : _items.SortByDescending(t => t.figure); break;
                case "gas": _items = (order == "asc") ? _items.SortBy(t => t.gas) : _items.SortByDescending(t => t.gas); break;
            }

            switch (mode)
            {
                case "":
                case null:
                    List<Production> items = _items
                    .Skip(page * pagesize)
                    .Limit(pagesize)
                    .Project<Production>(_fields_production).ToList();

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
                    //return GetExcel(_items.Project<Production>(_fields_production).ToList());

                default:
                    dynamic res;
                    switch (mode)
                    {
                        case "date":
                            res = _production.Distinct<DateTime?>(mode, xfilter).ToEnumerable().OrderByDescending(t => t).ToList();
                            break;
                        default:
                            res = _production.Distinct<decimal?>(mode, xfilter).ToEnumerable().OrderBy(t => t).ToList();
                            break;
                    }

                    return new JsonResult(new
                    {
                        //total_count = res.Count(),
                        items = res,
                    });
            }
        }

        private bool PrepareData(ProductionList colfilter)
        {
            List<DateTime> eq = colfilter.date.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == "and" && ((JObject)c).GetValue("opr").ToString() == "eq").Select(c => DateTime.Parse(((JObject)c).GetValue("val").ToString())).ToList();
            List<DateTime> gt = colfilter.date.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == "and" && ((JObject)c).GetValue("opr").ToString() == "gt").Select(c => DateTime.Parse(((JObject)c).GetValue("val").ToString())).ToList();
            List<DateTime> gte = colfilter.date.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == "and" && ((JObject)c).GetValue("opr").ToString() == "gte").Select(c => DateTime.Parse(((JObject)c).GetValue("val").ToString())).ToList();
            List<DateTime> lt = colfilter.date.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == "and" && ((JObject)c).GetValue("opr").ToString() == "lt").Select(c => DateTime.Parse(((JObject)c).GetValue("val").ToString())).ToList();
            List<DateTime> lte = colfilter.date.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == "and" && ((JObject)c).GetValue("opr").ToString() == "lte").Select(c => DateTime.Parse(((JObject)c).GetValue("val").ToString())).ToList();

            if (eq.Count() > 0 || ((gt.Count() > 0 || gte.Count() > 0) && (lt.Count() > 0 || lte.Count() > 0)))
            {
                DateTime start_date, end_date;
                if (eq.Count() > 0)
                {
                    start_date = eq.ElementAt(0);
                    end_date = eq.ElementAt(0);
                } else
                {
                    start_date = gte.Count() > 0 ? gte.ElementAt(0) : gt.ElementAt(0).AddDays(1);
                    end_date = lte.Count() > 0 ? lte.ElementAt(0) : lt.ElementAt(0).AddDays(-1);
                }

                FilterDefinition<Production> pfilter = Builders<Production>.Filter.And(
                    Builders<Production>.Filter.Gte(t => t.date, new BsonDateTime(start_date.ToLocalTime())) & 
                    Builders<Production>.Filter.Lte(t => t.date, new BsonDateTime(end_date.ToLocalTime())));

                List<Production> _items = _production.Find(pfilter).Project<Production>(_fields_production).ToList();
                if (_items.Count() <= (end_date - start_date).TotalDays ||
                    _items.Count(c => c.figure != null) <= (end_date - start_date).TotalDays ||
                    _items.Count(c => c.sot != null) <= (end_date - start_date).TotalDays)
                {
                    List<Production> items = new List<Production> { };
                    for(var d=0; d<=(end_date-start_date).TotalDays; d++)
                    {
                        items.Add(new Production()
                        {
                            date = start_date.AddDays(d),
                        });
                    }
 
                    //figure
                    FilterDefinition<Daily> dfilter = Builders<Daily>.Filter.And(
                    Builders<Daily>.Filter.Gte(t => t.date, new BsonDateTime(start_date.ToLocalTime())) &
                    Builders<Daily>.Filter.Lte(t => t.date, new BsonDateTime(end_date.ToLocalTime())));

                    var zz = _daily.Find(dfilter);
                    var xx = zz.Project<Daily>(_fields_daily).ToList().GroupBy(g => new {
                        date = g.date
                    }).Select(s => new {
                        date = s.Key.date,
                        figure = s.Sum(f => f.last_prod_net)
                    }).ToList();
                    xx.ForEach(x => items.FirstOrDefault(r => r.date == x.date).figure = x.figure);

                    //SOT
                    cmd = conn.CreateCommand();
                    cmd.BindByName = true;
                    cmd.CommandText = String.Format("select PERIODDATE, sum(PERIODVOLUMEVALUE) as PERIODVOLUMEVALUE from PRODVOLUME where PERIODDATE >= '{0}' and PERIODDATE<= '{1}' and FACILITYNAME = '{2}' group by PERIODDATE", DateTime.SpecifyKind(start_date, DateTimeKind.Utc).ToLocalTime().ToString("dd-MMM-yy"), DateTime.SpecifyKind(end_date, DateTimeKind.Utc).ToLocalTime().ToString("dd-MMM-yy"), "SANGASANGA");
                    OracleDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        var dt = DateTime.SpecifyKind(Convert.ToDateTime(reader["PERIODDATE"]), DateTimeKind.Local).ToUniversalTime();
                        items.FirstOrDefault(r => r.date == dt).sot = Convert.ToDecimal(reader["PERIODVOLUMEVALUE"]);
                    }
                    reader.Dispose();

                //GAS
                cmd = conn.CreateCommand();
                cmd.BindByName = true;
                cmd.CommandText = String.Format("select PERIODDATE, sum(PERIODVOLUMEVALUE) as PERIODVOLUMEVALUE from V_PRODVOLUME_GAS where PERIODDATE >= '{0}' and PERIODDATE<= '{1}' and FACILITYNAME = '{2}' and FLOWKIND = 'PRODUCTION' group by PERIODDATE", DateTime.SpecifyKind(start_date, DateTimeKind.Utc).ToLocalTime().ToString("dd-MMM-yy"), DateTime.SpecifyKind(end_date, DateTimeKind.Utc).ToLocalTime().ToString("dd-MMM-yy"), "SANGASANGA");
                reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    var dt = DateTime.SpecifyKind(Convert.ToDateTime(reader["PERIODDATE"]), DateTimeKind.Local).ToUniversalTime();
                    items.FirstOrDefault(r => r.date == dt).gas = Convert.ToDecimal(reader["PERIODVOLUMEVALUE"]);
                }
                reader.Dispose();

                //Write
                long modified_count = 0;
                    long created_count = items.Count();

                    foreach (Production item in items)
                    {
                        var update = Builders<Production>.Update.Set(t => t.date, item.date.Value.ToLocalTime())
                            .Set(t => t.figure, item.figure)
                            .Set(t => t.sot, item.sot)
                            .Set(t => t.gas, item.gas)
                            .Set(t=> t.operation, item.operation);
                        UpdateResult res = _production.UpdateOne(
                            Builders<Production>.Filter.Eq(t => t.date, item.date.Value.ToLocalTime()),
                            update, new UpdateOptions() { IsUpsert = true });

                        modified_count += res.ModifiedCount;
                        created_count -= res.ModifiedCount;
                    }

                }

                return true;
            }
            else
            {
                return false;
            }
            
        }

        [HttpGet("ProdVolume")]
        public ActionResult GetProdVolume(DateTime date, string FacilityName)
        {
            decimal res = 0;
            try
            {
                cmd = conn.CreateCommand();
                cmd.BindByName = true;
                string str = String.Format("select sum(PERIODVOLUMEVALUE) from PRODVOLUME where PERIODDATE='{0}' and FACILITYNAME='{1}'", date.ToString("dd-MMM-yy"), FacilityName);
                cmd.CommandText = str;
                OracleDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    res = reader.GetDecimal(0);
                }
                reader.Dispose();
                return Ok(new
                {
                    PeriodVolumeValue = res
                }); ;
            }
            catch (Exception e)
            {
                return BadRequest();
            }
        }
    }
}