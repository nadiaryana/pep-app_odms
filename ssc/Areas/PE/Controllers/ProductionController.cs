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
using OfficeOpenXml.FormulaParsing.Excel.Functions.Text;

namespace ssc.Areas.PE.Controllers
{
  [Route("api/pe/[controller]")]
  [ApiController]
  public class ProductionController : ControllerBase
  {

    private readonly IMongoCollection<Daily> _daily;
    private readonly IMongoCollection<Production> _production;
    private readonly IMongoCollection<ProductionTmp> _production_tmp;
    private ProjectionDefinition<Daily> _fields_daily;
    private ProjectionDefinition<Production> _fields_production;

    public ProductionController(IPEDatabaseSettings settings)
    {

      var mongoClient = new MongoClient("mongodb://localhost:27017");
      var database = mongoClient.GetDatabase("pe");
      _production_tmp = database.GetCollection<ProductionTmp>("ProductionTmp");
      _daily = DailyCommon._daily;
      _production = DailyCommon._production;
      //_production_tmp = DailyCommon._production_tmp;
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
            Builders<Production>.Filter.Regex(t => t.gas, new BsonRegularExpression(filter, "i")) |
            Builders<Production>.Filter.Regex(t => t.gas_sales, new BsonRegularExpression(filter, "i")) |
            Builders<Production>.Filter.Regex(t => t.sgt_opr, new BsonRegularExpression(filter, "i")) |
            Builders<Production>.Filter.Regex(t => t.sbr_opr, new BsonRegularExpression(filter, "i")) |
            Builders<Production>.Filter.Regex(t => t.bd_opr, new BsonRegularExpression(filter, "i")) |
            Builders<Production>.Filter.Regex(t => t.sgt_sot, new BsonRegularExpression(filter, "i")) |
            Builders<Production>.Filter.Regex(t => t.sbr_sot, new BsonRegularExpression(filter, "i")) |
            Builders<Production>.Filter.Regex(t => t.bd_sot, new BsonRegularExpression(filter, "i")) |
            Builders<Production>.Filter.Regex(t => t.sgt_fig, new BsonRegularExpression(filter, "i")) |
            Builders<Production>.Filter.Regex(t => t.sbr_fig, new BsonRegularExpression(filter, "i")) |
            Builders<Production>.Filter.Regex(t => t.bd_fig, new BsonRegularExpression(filter, "i")) |
            Builders<Production>.Filter.Regex(t => t.rkap, new BsonRegularExpression(filter, "i")) |
            Builders<Production>.Filter.Regex(t => t.wpnb, new BsonRegularExpression(filter, "i"));
      }

      if (!String.IsNullOrWhiteSpace(columnfilter))
      {
        xcolfilter = Builders<Production>.Filter.Ne("a", "b");
        ProductionList colfilter = JsonConvert.DeserializeObject<ProductionList>(columnfilter);

        if (colfilter.date?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Production>.Filter.Or(colfilter.date.ToList().Select(c => (c is DateTime) ? Builders<Production>.Filter.Eq(t => t.date, new BsonDateTime((DateTime)c)) : "{$expr:{$regexMatch:{input:{$dateToString:{format:\"%d %m %Y\",date:\"$date\",timezone:\"" + TimeZoneInfo.Local.DisplayName.Substring(4, 6) + "\"}},regex:/" + DailyCommon.ReplaceMonth((string)c) + "/i}}}"));
        if (colfilter.operation?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Production>.Filter.Or(colfilter.operation.ToList().Where(c => !(c is JObject)).Select(c => Builders<Production>.Filter.Regex(t => t.operation, new BsonRegularExpression((string)c, "i"))));
        if (colfilter.sot?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Production>.Filter.Or(colfilter.sot.ToList().Where(c => !(c is JObject)).Select(c => Builders<Production>.Filter.Eq(t => t.sot, Convert.ToDecimal(c))));
        if (colfilter.figure?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Production>.Filter.Or(colfilter.figure.ToList().Where(c => !(c is JObject)).Select(c => Builders<Production>.Filter.Eq(t => t.figure, Convert.ToDecimal(c))));
        if (colfilter.gas?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Production>.Filter.Or(colfilter.gas.ToList().Where(c => !(c is JObject)).Select(c => Builders<Production>.Filter.Eq(t => t.gas, Convert.ToDecimal(c))));
        if (colfilter.gas_sales?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Production>.Filter.Or(colfilter.gas_sales.ToList().Where(c => !(c is JObject)).Select(c => Builders<Production>.Filter.Eq(t => t.gas_sales, Convert.ToDecimal(c))));
        if (colfilter.sgt_opr?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Production>.Filter.Or(colfilter.sgt_opr.ToList().Where(c => !(c is JObject)).Select(c => Builders<Production>.Filter.Eq(t => t.sgt_opr, Convert.ToDecimal(c))));
        if (colfilter.sbr_opr?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Production>.Filter.Or(colfilter.sbr_opr.ToList().Where(c => !(c is JObject)).Select(c => Builders<Production>.Filter.Eq(t => t.sbr_opr, Convert.ToDecimal(c))));
        if (colfilter.bd_opr?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Production>.Filter.Or(colfilter.bd_opr.ToList().Where(c => !(c is JObject)).Select(c => Builders<Production>.Filter.Eq(t => t.bd_opr, Convert.ToDecimal(c))));
        if (colfilter.sgt_sot?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Production>.Filter.Or(colfilter.sgt_sot.ToList().Where(c => !(c is JObject)).Select(c => Builders<Production>.Filter.Eq(t => t.sgt_sot, Convert.ToDecimal(c))));
        if (colfilter.sbr_sot?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Production>.Filter.Or(colfilter.sbr_sot.ToList().Where(c => !(c is JObject)).Select(c => Builders<Production>.Filter.Eq(t => t.sbr_sot, Convert.ToDecimal(c))));
        if (colfilter.bd_sot?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Production>.Filter.Or(colfilter.bd_sot.ToList().Where(c => !(c is JObject)).Select(c => Builders<Production>.Filter.Eq(t => t.bd_sot, Convert.ToDecimal(c))));
        if (colfilter.sgt_fig?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Production>.Filter.Or(colfilter.sgt_fig.ToList().Where(c => !(c is JObject)).Select(c => Builders<Production>.Filter.Eq(t => t.sgt_fig, Convert.ToDecimal(c))));
        if (colfilter.sbr_fig?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Production>.Filter.Or(colfilter.sbr_fig.ToList().Where(c => !(c is JObject)).Select(c => Builders<Production>.Filter.Eq(t => t.sbr_fig, Convert.ToDecimal(c))));
        if (colfilter.bd_fig?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Production>.Filter.Or(colfilter.bd_fig.ToList().Where(c => !(c is JObject)).Select(c => Builders<Production>.Filter.Eq(t => t.bd_fig, Convert.ToDecimal(c))));
        if (colfilter.rkap?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Production>.Filter.Or(colfilter.rkap.ToList().Where(c => !(c is JObject)).Select(c => Builders<Production>.Filter.Eq(t => t.rkap, Convert.ToDecimal(c))));
        if (colfilter.wpnb?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Production>.Filter.Or(colfilter.wpnb.ToList().Where(c => !(c is JObject)).Select(c => Builders<Production>.Filter.Eq(t => t.wpnb, Convert.ToDecimal(c))));

        foreach (string log in DailyCommon._logical)
        {
          if (colfilter.date?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.date.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[\"$date\",ISODate(\"{1}\")]}}", ((JObject)c).GetValue("opr"), DateTime.Parse(((JObject)c).GetValue("val").ToString()).ToString("yyyy-MM-ddTHH:mm:ssZ"))).ToArray()), log);
          if (colfilter.operation?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.operation.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$operation\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
          if (colfilter.sot?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.sot.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$sot\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
          if (colfilter.figure?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.figure.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$figure\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
          if (colfilter.gas?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.gas.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$gas\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
          if (colfilter.gas_sales?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.gas_sales.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$gas_sales\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
          if (colfilter.sgt_opr?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.sgt_opr.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$sgt_opr\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
          if (colfilter.sbr_opr?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.sbr_opr.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$sbr_opr\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
          if (colfilter.bd_opr?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.bd_opr.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$bd_opr\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
          if (colfilter.sgt_sot?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.sgt_sot.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$sgt_sot\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
          if (colfilter.sbr_sot?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.sbr_sot.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$sbr_sot\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
          if (colfilter.bd_sot?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.bd_sot.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$bd_sot\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
          if (colfilter.sgt_fig?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.sgt_fig.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$sgt_fig\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
          if (colfilter.sbr_fig?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.sbr_fig.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$sbr_fig\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
          if (colfilter.bd_fig?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.bd_fig.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$bd_fig\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
          if (colfilter.rkap?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.rkap.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$rkap\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
          if (colfilter.wpnb?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.wpnb.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$wpnb\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
        }

        xfilter = xfilter & xcolfilter;
      }
      else
      {
        xfilter = new BsonDocument();
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
        case "gas_sales": _items = (order == "asc") ? _items.SortBy(t => t.gas_sales) : _items.SortByDescending(t => t.gas_sales); break;
        case "sgt_opr": _items = (order == "asc") ? _items.SortBy(t => t.sgt_opr) : _items.SortByDescending(t => t.sgt_opr); break;
        case "sbr_opr": _items = (order == "asc") ? _items.SortBy(t => t.sbr_opr) : _items.SortByDescending(t => t.sbr_opr); break;
        case "bd_opr": _items = (order == "asc") ? _items.SortBy(t => t.bd_opr) : _items.SortByDescending(t => t.bd_opr); break;
        case "sgt_sot": _items = (order == "asc") ? _items.SortBy(t => t.sgt_sot) : _items.SortByDescending(t => t.sgt_sot); break;
        case "sbr_sot": _items = (order == "asc") ? _items.SortBy(t => t.sbr_sot) : _items.SortByDescending(t => t.sbr_sot); break;
        case "bd_sot": _items = (order == "asc") ? _items.SortBy(t => t.bd_sot) : _items.SortByDescending(t => t.bd_sot); break;
        case "sgt_fig": _items = (order == "asc") ? _items.SortBy(t => t.sgt_fig) : _items.SortByDescending(t => t.sgt_fig); break;
        case "sbr_fig": _items = (order == "asc") ? _items.SortBy(t => t.sbr_fig) : _items.SortByDescending(t => t.sbr_fig); break;
        case "bd_fig": _items = (order == "asc") ? _items.SortBy(t => t.bd_fig) : _items.SortByDescending(t => t.bd_fig); break;
        case "rkap": _items = (order == "asc") ? _items.SortBy(t => t.rkap) : _items.SortByDescending(t => t.rkap); break;
        case "wpnb": _items = (order == "asc") ? _items.SortBy(t => t.wpnb) : _items.SortByDescending(t => t.wpnb); break;
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
          return GetExcel(_items.Project<Production>(_fields_production).ToList());

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

    public ActionResult GetExcel(List<Production> items)
    {
      var workbook = new ExcelPackage();
      var ws = workbook.Workbook.Worksheets.Add("Production");
      ws.Cells[1, 1].Value = "Date";
      ws.Cells[1, 1, 2, 1].Merge = true;

      ws.Cells[1, 2].Value = "SOT";
      ws.Cells[2, 2].Value = "bopd";

      ws.Cells[1, 3].Value = "Operation";
      ws.Cells[2, 3].Value = "bopd";

      ws.Cells[1, 4].Value = "Figure";
      ws.Cells[2, 4].Value = "bopd";

      ws.Cells[1, 5].Value = "Gas";
      ws.Cells[2, 5].Value = "MMSCFD";

      ws.Cells[1, 6].Value = "Gas Sales";
      ws.Cells[2, 6].Value = "MMSCFD";

      ws.Cells[1, 7].Value = "SGT SOT";
      ws.Cells[2, 7].Value = "bopd";

      ws.Cells[1, 8].Value = "SBR SOT";
      ws.Cells[2, 8].Value = "bopd";

      ws.Cells[1, 9].Value = "BD SOT";
      ws.Cells[2, 9].Value = "bopd";

      ws.Cells[1, 10].Value = "SGT Operation";
      ws.Cells[2, 10].Value = "bopd";

      ws.Cells[1, 11].Value = "SBR Operation";
      ws.Cells[2, 11].Value = "bopd";

      ws.Cells[1, 12].Value = "BD Operation";
      ws.Cells[2, 12].Value = "bopd";

      ws.Cells[1, 13].Value = "SGT Figure";
      ws.Cells[2, 13].Value = "bopd";

      ws.Cells[1, 14].Value = "SBR Figure";
      ws.Cells[2, 14].Value = "bopd";

      ws.Cells[1, 15].Value = "BD Figure";
      ws.Cells[2, 15].Value = "bopd";

      ws.Cells[1, 16].Value = "RKAP";
      ws.Cells[2, 16].Value = "";

      ws.Cells[1, 17].Value = "WP&B";
      ws.Cells[2, 17].Value = "";


      ws.Cells[1, 1, 1, 17].Style.Font.Bold = true;
      ws.Cells[1, 1, 2, 17].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
      ws.Cells[1, 1, 2, 17].Style.VerticalAlignment = ExcelVerticalAlignment.Top;

      for (int c = 1; c <= 27; c++)
      {
        //ws.Column(c).AutoFit();
      }

      for (int i = 0; i < items.Count(); i++)
      {
        var t = items.ElementAt(i);
        ws.Cells[3 + i, 1].Style.Numberformat.Format = "d-MMM-yy";
        ws.Cells[3 + i, 1].Value = t.date.HasValue ? t.date.Value.ToLocalTime().ToOADate() : (double?)null;
        ws.Cells[3 + i, 2].Value = t.sot;
        ws.Cells[3 + i, 3].Value = t.operation;
        ws.Cells[3 + i, 4].Value = t.figure;
        ws.Cells[3 + i, 5].Value = t.gas;
        ws.Cells[3 + i, 6].Value = t.gas_sales;
        ws.Cells[3 + i, 7].Value = t.sgt_sot;
        ws.Cells[3 + i, 8].Value = t.sbr_sot;
        ws.Cells[3 + i, 9].Value = t.bd_sot;
        ws.Cells[3 + i, 10].Value = t.sgt_opr;
        ws.Cells[3 + i, 11].Value = t.sbr_opr;
        ws.Cells[3 + i, 12].Value = t.bd_opr;
        ws.Cells[3 + i, 13].Value = t.sgt_fig;
        ws.Cells[3 + i, 14].Value = t.sbr_fig;
        ws.Cells[3 + i, 15].Value = t.bd_fig;
        ws.Cells[3 + i, 16].Value = t.rkap;
        ws.Cells[3 + i, 17].Value = t.wpnb;

      }

      //ws.Cells[3, 6, 3 + items.Count(), 18].Style.Numberformat.Format = "#,###";
      ws.Cells[3, 17, 3 + items.Count(), 17].Style.Numberformat.Format = "#,###";
      ws.Cells[3, 17, 3 + items.Count(), 17].Style.Numberformat.Format = "#,###.0";

      MemoryStream memoryStream = new MemoryStream(workbook.GetAsByteArray());
      memoryStream.Position = 0;
      return File(memoryStream, "application/vnd.ms-excel", "Production.xlsx");
    }


    [HttpPost]
    public ActionResult Post(ListProduction productions)
    {

      foreach (Production item in productions.productions)
      {
        var update = Builders<Production>.Update
            .Set(t => t.sot, item.sot)
            .Set(t => t.operation, item.operation)
            .Set(t => t.figure, item.figure)
            .Set(t => t.gas, item.gas)
            .Set(t => t.gas_sales, item.gas_sales)
            .Set(t => t.sgt_opr, item.sgt_opr)
            .Set(t => t.sbr_opr, item.sbr_opr)
            .Set(t => t.bd_opr, item.bd_opr)
            .Set(t => t.sgt_sot, item.sgt_sot)
            .Set(t => t.sbr_sot, item.sbr_sot)
            .Set(t => t.bd_sot, item.bd_sot)
            .Set(t => t.sgt_fig, item.sgt_fig)
            .Set(t => t.sbr_fig, item.sbr_fig)
            .Set(t => t.bd_fig, item.bd_fig)
            .Set(t => t.rkap, item.rkap)
            .Set(t => t.wpnb, item.wpnb);
        UpdateResult res = _production.UpdateOne(
            Builders<Production>.Filter.Eq(t => t.date, item.date.Value.ToUniversalTime()),
            update, new UpdateOptions() { IsUpsert = true });

      }

      return new JsonResult(new
      {
        incomplete_result = false,
        items = productions,
      })
      {
        StatusCode = StatusCodes.Status200OK
      };
    }

    [HttpGet("{id}", Name = "GetProduction")]
    public ActionResult Get(string id)
    {
      var xfilter = Builders<Production>.Filter.Eq("_id", id);
      var _items = _production.Find(xfilter, new FindOptions() { Collation = new Collation("en_US", numericOrdering: true) });

      List<Production> item = _items
             .Project<Production>(_fields_production).ToList();

      return new JsonResult(new
      {
        incomplete_result = false,
        item = item
      })
      {
        StatusCode = StatusCodes.Status200OK
      };
    }

    [Authorize("PeProduction Add")]
    [HttpPost("UploadFilesProduction")]
    public async Task<IActionResult> Post(List<IFormFile> files)
    {
      long size = files.Sum(f => f.Length);

      // full path to file in temp location
      var filePath = Path.GetTempFileName();

      foreach (var formFile in files)
      {
        if (formFile.Length > 0)
        {
          using (var stream = new FileStream(filePath, FileMode.Create))
          {
            await formFile.CopyToAsync(stream);
          }
        }
      }

      var fi = new FileInfo(filePath);
      var workbook = new ExcelPackage(fi);
      var ws = workbook.Workbook.Worksheets.First();
      int rowCount = ws.Dimension.End.Row;

      List<Production> items = new List<Production>();
      int error_count = 0;

      for (var r = 3; r <= rowCount; r++)
      {
        if (!string.IsNullOrWhiteSpace(ws.Cells[r, 1].Value?.ToString()))
        {
          Production _row = new Production();
          ProductionError _row_error = new ProductionError();
          int last_error_count = error_count;

          // === DATE PARSING ===
          if (!String.IsNullOrWhiteSpace(ws.Cells[r, 1].Value?.ToString()))
          {
            try
            {
              if (ws.Cells[r, 1].Value.GetType() == DateTime.Now.GetType())
              {
                _row.date = (DateTime?)ws.Cells[r, 1].Value;
              }
              else
              {
                _row.date = DateTime.FromOADate(double.Parse(ws.Cells[r, 1].Value?.ToString().Trim()));
              }
            }
            catch (Exception e)
            {
              _row_error.date = new ErrorItem { value = ws.Cells[r, 1].Value?.ToString(), message = e.Message };
              error_count++;
            }
          }
          else
          {
            _row_error.date = new ErrorItem { value = "(Blank)", message = "Blank date is not allowed" };
            error_count++;
          }

          // === NUMERIC MAPPINGS ===
          var mappings = new[]
          {
                new { key = "sot", col = 2 },
                new { key = "operation", col = 3 },
                new { key = "figure", col = 4 },
                new { key = "gas", col = 5 },
                new { key = "gas_sales", col = 6 },
                new { key = "sgt_opr", col = 7 },
                new { key = "sbr_opr", col = 8 },
                new { key = "bd_opr", col = 9 },
                new { key = "sgt_sot", col = 10 },
                new { key = "sbr_sot", col = 11 },
                new { key = "bd_sot", col = 12 },
                new { key = "sgt_fig", col = 13 },
                new { key = "sbr_fig", col = 14 },
                new { key = "bd_fig", col = 15 },
                new { key = "rkap", col = 16 },
                new { key = "wpnb", col = 17 },
            };

          foreach (var mapping in mappings)
          {
            var rawValue = ws.Cells[r, mapping.col].Value;
            var strValue = rawValue?.ToString().Trim();

            if (!string.IsNullOrEmpty(strValue))
            {
              if (decimal.TryParse(strValue, out decimal num))
              {
                // 🔹 Tambahkan pembulatan sesuai nama kolom
                switch (mapping.key)
                {
                  case "operation":
                  case "sot":
                  case "figure":
                    num = Math.Round(num, 0); // tanpa koma
                    break;
                  case "gas":
                  case "gas_sales":
                    num = Math.Round(num, 2); // 2 angka di belakang koma
                    break;
                }
                var prop = typeof(Production).GetProperty(mapping.key);
                if (prop != null)
                  prop.SetValue(_row, num);
              }
              else
              {
                var prop = typeof(Production).GetProperty(mapping.key);
                if (prop != null)
                  prop.SetValue(_row, null);

                var errorProp = typeof(ProductionError).GetProperty(mapping.key);
                if (errorProp != null)
                  errorProp.SetValue(_row_error, new ErrorItem { value = strValue, message = "Invalid number" });

                error_count++;
              }
            }
            else
            {
              var prop = typeof(Production).GetProperty(mapping.key);
              if (prop != null)
                prop.SetValue(_row, null);
            }
          }

          // === CEK DUPLIKAT (DATA SUDAH ADA) ===
          if (_row_error.date == null)
          {
            var filter = Builders<Production>.Filter.Eq(t => t.date, _row.date);
            var existing = _production.Find(filter).CountDocuments();
            if (existing > 0)
            {
              _row_error._row = new ErrorItem
              {
                value = "warning",
                message = "Existing row found, data will be replaced"
              };
            }
          }

          // === CEK ERROR PADA BARIS INI ===
          if (error_count > last_error_count)
          {
            _row_error._row = new ErrorItem
            {
              value = "error",
              message = "Error found"
            };
          }

          // === SIMPAN ERROR & DATA KE LIST ===
          _row._error = _row_error;
          items.Add(_row);
        }
      }

      ProductionTmp _tmp = new ProductionTmp
      {
        error_count = error_count,
        items = items.ToArray()
      };
      _production_tmp.InsertOne(_tmp);

      return Ok(new
      {
        tmp_id = _tmp._id.ToString(),
        // total_rows = items.Count,
        error_count = error_count,
        // items = items
      });
    }

    [Authorize("PeProduction Add")]
    [HttpGet("Tmp")]
    public ActionResult GetTmp(string _id, string sort = "date", string order = "desc", int page = 0, int limit = 50, string mode = "")
    {
      if (string.IsNullOrEmpty(_id) || _id == "undefined")
      {
        return BadRequest("Invalid or missing _id parameter");
      }

      // 🔹 Ubah string _id jadi ObjectId
      ObjectId objectId;
      try
      {
        objectId = ObjectId.Parse(_id);
      }
      catch (FormatException)
      {
        return BadRequest("Invalid ObjectId format");
      }

      // 🔹 Panggil data pakai Equals()
      var _tmp = _production_tmp.Find(t => t._id.Equals(objectId)).FirstOrDefault();

      if (_tmp == null)
      {
        return NotFound("Temporary data not found");
      }

      var _tmpitems = _tmp.items.ToList();

      if (mode == "error")
      {
        _tmpitems = _tmpitems.Where(r => r._error?._row?.value == "error").ToList();
      }
      else if (mode == "warning")
      {
        _tmpitems = _tmpitems.Where(r => r._error?._row?.value == "warning").ToList();
      }

      return Ok(new
      {
        total_rows = _tmpitems.Count,
        items = _tmpitems,
        error_count = _tmp.error_count,
      });
    }


    [Authorize("PeProduction Add")]
    [HttpGet("SaveDataProduction")]
    public ActionResult SaveDataProduction([FromQuery] string tmp_id)
    {
      if (string.IsNullOrEmpty(tmp_id))
        return BadRequest(new { message = "tmp_id is missing" });

      // 🔹 Convert string ke ObjectId
      ObjectId objectId;
      try
      {
        objectId = ObjectId.Parse(tmp_id);
      }
      catch (FormatException)
      {
        return BadRequest(new { message = "Invalid tmp_id format" });
      }

      // 🔹 Ambil data temporary berdasarkan tmp_id
      var tmp = _production_tmp.Find(t => t._id.Equals(objectId)).FirstOrDefault();
      if (tmp == null)
        return BadRequest(new { message = "No data to save." });

      var items = tmp.items?.ToList();
      if (items == null || items.Count == 0)
        return BadRequest(new { message = "No data found in temporary record." });

      long modified_count = 0;
      long created_count = 0;

      foreach (var item in items)
      {
        if (item.date == null)
          continue;
        // 🔹 Terapkan pembulatan sebelum update
        var sot = item.sot.HasValue ? Math.Round(item.sot.Value, 0) : (decimal?)null;
        var operation = item.operation.HasValue ? Math.Round(item.operation.Value, 0) : (decimal?)null;
        var figure = item.figure.HasValue ? Math.Round(item.figure.Value, 0) : (decimal?)null;
        var gas = item.gas.HasValue ? Math.Round(item.gas.Value, 2) : (decimal?)null;
        var gas_sales = item.gas_sales.HasValue ? Math.Round(item.gas_sales.Value, 2) : (decimal?)null;

        var filter = Builders<Production>.Filter.Eq(t => t.date, item.date.Value.ToUniversalTime());
        var update = Builders<Production>.Update
            .Set(t => t.sot, item.sot)
            .Set(t => t.operation, item.operation)
            .Set(t => t.figure, item.figure)
            .Set(t => t.gas, item.gas)
            .Set(t => t.gas_sales, item.gas_sales)
            .Set(t => t.sgt_opr, item.sgt_opr)
            .Set(t => t.sbr_opr, item.sbr_opr)
            .Set(t => t.bd_opr, item.bd_opr)
            .Set(t => t.sgt_sot, item.sgt_sot)
            .Set(t => t.sbr_sot, item.sbr_sot)
            .Set(t => t.bd_sot, item.bd_sot)
            .Set(t => t.sgt_fig, item.sgt_fig)
            .Set(t => t.sbr_fig, item.sbr_fig)
            .Set(t => t.bd_fig, item.bd_fig)
            .Set(t => t.rkap, item.rkap)
            .Set(t => t.wpnb, item.wpnb)
            .Set(t => t.figure, item.figure)
            .Set(t => t.updated_by, User.Identity.Name)
            .Set(t => t.updated_date, DateTime.Now)
            .SetOnInsert(t => t.created_by, User.Identity.Name)
            .SetOnInsert(t => t.created_date, DateTime.Now);

        var res = _production.UpdateOne(filter, update, new UpdateOptions() { IsUpsert = true });

        if (res.MatchedCount > 0)
          modified_count += res.ModifiedCount;
        else
          created_count++;
      }

      return Ok(new
      {
        message = "Data saved successfully.",
        modified_count = modified_count,
        created_count = created_count,
        total_count = items.Count
      });
    }

    //   [HttpGet("SaveDataProduction")]
    //   public ActionResult SaveDataProduction([FromQuery] List<Production> items)
    //   {
    //     if (items == null || items.Count == 0)
    //     {
    //       return BadRequest(new { message = "No data to save." });
    //     }

    //     long modified_count = 0;
    //     long created_count = 0;

    //     foreach (var item in items)
    //     {
    //       if (item.date == null)
    //         continue;

    //       var filter = Builders<Production>.Filter.Eq(t => t.date, item.date.Value.ToUniversalTime());
    //       var update = Builders<Production>.Update
    //         .Set(t => t.sot, item.sot)
    //         .Set(t => t.operation, item.operation)
    //         .Set(t => t.figure, item.figure)
    //         .Set(t => t.gas, item.gas)
    //         .Set(t => t.gas_sales, item.gas_sales)
    //         .Set(t => t.sgt_opr, item.sgt_opr)
    //         .Set(t => t.sbr_opr, item.sbr_opr)
    //         .Set(t => t.bd_opr, item.bd_opr)
    //         .Set(t => t.sgt_sot, item.sgt_sot)
    //         .Set(t => t.sbr_sot, item.sbr_sot)
    //         .Set(t => t.bd_sot, item.bd_sot)
    //         .Set(t => t.rkap, item.rkap)
    //         .Set(t => t.wpnb, item.wpnb)
    //         .Set(t => t.figure, item.figure)
    //         .Set(t => t.updated_by, User.Identity.Name)
    //         .Set(t => t.updated_date, DateTime.Now)
    //         .SetOnInsert(t => t.created_by, User.Identity.Name)
    //         .SetOnInsert(t => t.created_date, DateTime.Now);

    //       var res = _production.UpdateOne(filter, update, new UpdateOptions() { IsUpsert = true });

    //       if (res.MatchedCount > 0)
    //         modified_count += res.ModifiedCount;
    //       else
    //         created_count++;
    //     }

    //     return Ok(new
    //     {
    //       modified_count = modified_count,
    //       created_count = created_count,
    //       total_count = items.Count
    //     });
    //   }
    // }
  }
}
