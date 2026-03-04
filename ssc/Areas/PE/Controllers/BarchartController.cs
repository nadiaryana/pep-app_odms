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

namespace ssc.Areas.PE.Controllers
{
    [Route("api/pe/[controller]")]
    [ApiController]
    public class BarchartController : ControllerBase
    {
        private readonly IMongoCollection<Barchart> _barchart;
        private readonly IMongoCollection<BarchartTmp> _barchart_tmp;

        public BarchartController(IPEDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);
            _barchart = database.GetCollection<Barchart>("barchart");
            _barchart_tmp = database.GetCollection<BarchartTmp>("barchart_tmp");
        }

        [Authorize("PeBarchart Read")]
        [HttpGet]
        public ActionResult Get(String sort = "plan_start", String order = "desc", int page = 0, int pagesize = 50, String filter = "", String columnfilter = "", string mode = "", DateTime? start_date = null, DateTime? end_date = null)
        {
            FilterDefinition<Barchart> xfilter = Builders<Barchart>.Filter.Ne("a", "b");
            FilterDefinition<Barchart> xcolfilter;
            if (!String.IsNullOrWhiteSpace(filter))
            {
                filter = filter.ToLower();
                xfilter =
                    Builders<Barchart>.Filter.Regex(t => t.well, new BsonRegularExpression(filter, "i")) |
                    Builders<Barchart>.Filter.Regex(t => t.job, new BsonRegularExpression(filter, "i")) |
                    Builders<Barchart>.Filter.Regex(t => t.rig, new BsonRegularExpression(filter, "i")) |
                    Builders<Barchart>.Filter.Regex(t => t.remarks, new BsonRegularExpression(filter, "i")) |
                    Builders<Barchart>.Filter.Regex(t => t.plan_start, new BsonRegularExpression(filter, "i")) |
                    Builders<Barchart>.Filter.Regex(t => t.plan_end, new BsonRegularExpression(filter, "i"));
            }

            if (!String.IsNullOrWhiteSpace(columnfilter))
            {
                xcolfilter = Builders<Barchart>.Filter.Ne("a", "b");
                BarchartList colfilter = JsonConvert.DeserializeObject<BarchartList>(columnfilter);

                if (colfilter.well?.ToList().Count(c => !(c is JObject)) > 0)
                    xcolfilter = xcolfilter & Builders<Barchart>.Filter.Or(colfilter.well.ToList().Where(c => !(c is JObject)).Select(c => Builders<Barchart>.Filter.Regex(t => t.well, new BsonRegularExpression((string)c, "i"))));

                if (colfilter.job?.ToList().Count(c => !(c is JObject)) > 0)
                    xcolfilter = xcolfilter & Builders<Barchart>.Filter.Or(colfilter.job.ToList().Where(c => !(c is JObject)).Select(c => Builders<Barchart>.Filter.Regex(t => t.job, new BsonRegularExpression((string)c, "i"))));

                if (colfilter.rig?.ToList().Count(c => !(c is JObject)) > 0)
                    xcolfilter = xcolfilter & Builders<Barchart>.Filter.Or(colfilter.rig.ToList().Where(c => !(c is JObject)).Select(c => Builders<Barchart>.Filter.Regex(t => t.rig, new BsonRegularExpression((string)c, "i"))));

                if (colfilter.plan_start?.ToList().Count(c => !(c is JObject)) > 0)
                    xcolfilter = xcolfilter & Builders<Barchart>.Filter.Or(colfilter.plan_start.ToList().Select(c => (c is DateTime) ? Builders<Barchart>.Filter.Eq(t => t.plan_start, new BsonDateTime((DateTime)c)) : "{$expr:{$regexMatch:{input:{$dateToString:{format:\"%d %m %Y\",date:\"$plan_start\",timezone:\"" + TimeZoneInfo.Local.DisplayName.Substring(4, 6) + "\"}},regex:/" + (string)c + "/i}}}"));

                if (colfilter.plan_end?.ToList().Count(c => !(c is JObject)) > 0)
                    xcolfilter = xcolfilter & Builders<Barchart>.Filter.Or(colfilter.plan_end.ToList().Select(c => (c is DateTime) ? Builders<Barchart>.Filter.Eq(t => t.plan_end, new BsonDateTime((DateTime)c)) : "{$expr:{$regexMatch:{input:{$dateToString:{format:\"%d %m %Y\",date:\"$plan_end\",timezone:\"" + TimeZoneInfo.Local.DisplayName.Substring(4, 6) + "\"}},regex:/" + (string)c + "/i}}}"));

                if (colfilter.remarks?.ToList().Count(c => !(c is JObject)) > 0)
                    xcolfilter = xcolfilter & Builders<Barchart>.Filter.Or(colfilter.remarks.ToList().Where(c => !(c is JObject)).Select(c => Builders<Barchart>.Filter.Regex(t => t.remarks, new BsonRegularExpression((string)c, "i"))));

                xfilter = xfilter & xcolfilter;
            }

            var _items = _barchart.Find(xfilter, new FindOptions() { Collation = new Collation("en_US", numericOrdering: true) });

            var total_count = _items.CountDocuments();

            switch (sort)
            {
                case "well": _items = (order == "asc") ? _items.SortBy(t => t.well) : _items.SortByDescending(t => t.well); break;
                case "job": _items = (order == "asc") ? _items.SortBy(t => t.job) : _items.SortByDescending(t => t.job); break;
                case "rig": _items = (order == "asc") ? _items.SortBy(t => t.rig) : _items.SortByDescending(t => t.rig); break;
                case "plan_start": _items = (order == "asc") ? _items.SortBy(t => t.plan_start) : _items.SortByDescending(t => t.plan_start); break;
                case "plan_end": _items = (order == "asc") ? _items.SortBy(t => t.plan_end) : _items.SortByDescending(t => t.plan_end); break;
                case "remarks": _items = (order == "asc") ? _items.SortBy(t => t.remarks) : _items.SortByDescending(t => t.remarks); break;
            }

            switch (mode)
            {
                case "":
                case null:
                    List<Barchart> items = _items
                        .Skip(page * pagesize)
                        .Limit(pagesize)
                        .ToList();

                    return new JsonResult(new
                    {
                        total_count = total_count,
                        incomplete_result = false,
                        items = items,
                    })
                    {
                        StatusCode = StatusCodes.Status200OK
                    };

                // Mode chart: untuk Gantt Chart dengan filter date range
                // Mengikuti pattern DataController (well_performance_sonolog)
                case "chart":
                    // list template rig untuk pengurutan
                    var templateOrderRig = new List<string> { "H-25", "L-350", "MH-262", "Rigless" };
                    var chartData = _barchart.Find(
                        r =>
                            // jika masih dialam range
                            (r.plan_start >= start_date &&
                            r.plan_end <= end_date) ||
                            // atau jika plan_start lebih kecil dari start_date dan plan_end lebih besar dari start_date
                            (r.plan_start <= start_date &&
                            r.plan_end >= start_date) ||
                            // atau jika plan_end lebih besar dari end_date dan plan_start lebih kecil dari end_date
                            (r.plan_end >= end_date &&
                            r.plan_start <= end_date)
                    ).ToList().OrderBy(t => t.plan_start).Select(s => new
                    {
                        well = s.well,
                        job = s.job,
                        rig = s.rig,
                        remarks = s.remarks,
                        plan_start = s.plan_start,
                        plan_end = s.plan_end
                    });
                    // Urutkan berdasarkan template rig
                    chartData = chartData.OrderBy(d =>
                    {
                        int index = templateOrderRig.IndexOf(d.rig);
                        return index >= 0 ? index : int.MaxValue;
                    });
                    return Ok(new { data = chartData });

                case "excel":
                    return GetExcel(_items.ToList());

                default:
                    dynamic res;
                    switch (mode)
                    {
                        case "well":
                        case "job":
                        case "rig":
                        case "remarks":
                            res = _barchart.Distinct<string>(mode, xfilter).ToEnumerable().OrderBy(t => t).ToList();
                            break;
                        case "plan_start":
                        case "plan_end":
                            res = _barchart.Distinct<DateTime?>(mode, xfilter).ToEnumerable().OrderByDescending(t => t).ToList();
                            break;
                        default:
                            res = _barchart.Distinct<string>(mode, xfilter).ToEnumerable().OrderBy(t => t).ToList();
                            break;
                    }
                    return new JsonResult(new
                    {
                        total_count = total_count,
                        incomplete_result = false,
                        items = res,
                    })
                    {
                        StatusCode = StatusCodes.Status200OK
                    };
            }
        }

        [Authorize("PeBarchart Delete")]
        [HttpDelete]
        public ActionResult Delete([FromQuery] string[] _ids)
        {
            var result = _barchart.DeleteMany(t => _ids.Contains(t._id));
            return new JsonResult(new
            {
                deleted_count = result.DeletedCount
            })
            {
                StatusCode = StatusCodes.Status200OK
            };
        }

        [Authorize("PeBarchart Add")]
        [HttpPost("UploadFiles")]
        public async Task<IActionResult> Post(List<IFormFile> files)
        {
            long size = files.Sum(f => f.Length);
            var filePath = Path.GetTempFileName();

            foreach (var formFile in files)
            {
                if (formFile.Length > 0)
                {
                    var extension = Path.GetExtension(formFile.FileName).ToLower();

                    if (extension != ".xlsx" && extension != ".xlsm")
                    {
                        return BadRequest("Only .xlsx and .xlsm files are allowed");
                    }

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

            List<Barchart> items = new List<Barchart>();
            int error_count = 0;

            for (var r = 15; r <= rowCount; r++)
            {
                if (!string.IsNullOrWhiteSpace(ws.Cells[r, 3].Value?.ToString()))
                {
                    Barchart _row = new Barchart();
                    BarchartError _row_error = new BarchartError();
                    int last_error_count = error_count;

                    // Well (Column A) - Required
                    if (!String.IsNullOrWhiteSpace(ws.Cells[r, 3].Value?.ToString()))
                    {
                        _row.well = ws.Cells[r, 3].Value?.ToString().Trim();
                    }
                    else
                    {
                        _row_error.well = new ErrorItem { value = "(Blank)", message = "Blank well is not allowed" };
                        error_count++;
                    }

                    // Job (Column B)
                    if (!String.IsNullOrWhiteSpace(ws.Cells[r, 4].Value?.ToString()))
                    {
                        _row.job = ws.Cells[r, 4].Value?.ToString().Trim();
                    }

                    // Rig (Column C)
                    if (!String.IsNullOrWhiteSpace(ws.Cells[r, 5].Value?.ToString()))
                    {
                        _row.rig = ws.Cells[r, 5].Value?.ToString().Trim();
                    }

                    // Plan Start (Column D)
                    if (!String.IsNullOrWhiteSpace(ws.Cells[r, 6].Value?.ToString()))
                    {
                        try
                        {
                            DateTime parsedDate;
                            if (ws.Cells[r, 6].Value.GetType() == DateTime.Now.GetType())
                            {
                                parsedDate = (DateTime)ws.Cells[r, 6].Value;
                            }
                            else
                            {
                                parsedDate = DateTime.FromOADate(double.Parse(ws.Cells[r, 6].Value?.ToString().Trim()));
                            }
                            // Set jam ke 12:00 UTC agar tidak bergeser hari saat timezone conversion
                            _row.plan_start = new DateTime(parsedDate.Year, parsedDate.Month, parsedDate.Day, 12, 0, 0, DateTimeKind.Utc);
                        }
                        catch (Exception e)
                        {
                            _row_error.plan_start = new ErrorItem { value = ws.Cells[r, 6].Value?.ToString(), message = e.Message };
                            error_count++;
                        }
                    }

                    // Plan End (Column E)
                    if (!String.IsNullOrWhiteSpace(ws.Cells[r, 7].Value?.ToString()))
                    {
                        try
                        {
                            DateTime parsedDate;
                            if (ws.Cells[r, 7].Value.GetType() == DateTime.Now.GetType())
                            {
                                parsedDate = (DateTime)ws.Cells[r, 7].Value;
                            }
                            else
                            {
                                parsedDate = DateTime.FromOADate(double.Parse(ws.Cells[r, 7].Value?.ToString().Trim()));
                            }
                            // Set jam ke 12:00 UTC agar tidak bergeser hari saat timezone conversion
                            _row.plan_end = new DateTime(parsedDate.Year, parsedDate.Month, parsedDate.Day, 12, 0, 0, DateTimeKind.Utc);
                        }
                        catch (Exception e)
                        {
                            _row_error.plan_end = new ErrorItem { value = ws.Cells[r, 7].Value?.ToString(), message = e.Message };
                            error_count++;
                        }
                    }

                    // Remarks (Column F)
                    if (!String.IsNullOrWhiteSpace(ws.Cells[r, 8].Value?.ToString()))
                    {
                        _row.remarks = ws.Cells[r, 8].Value?.ToString().Trim();
                    }

                    // Check for existing data
                    if (_row_error.well == null && _row.plan_start != null && _row.plan_end != null)
                    {
                        if (_barchart.Find(t => t.well == _row.well && t.plan_start == _row.plan_start && t.plan_end == _row.plan_end).CountDocuments() > 0)
                        {
                            _row_error._row = new ErrorItem { value = "warning", message = "Existing row found, data will be replaced" };
                        }
                    }

                    if (error_count > last_error_count)
                    {
                        _row_error._row = new ErrorItem { value = "error", message = "Error found" };
                    }

                    _row._error = _row_error;
                    _row.created_date = DateTime.Now;
                    items.Add(_row);
                }
            }

            BarchartTmp _tmp = new BarchartTmp
            {
                error_count = error_count,
                upload_date = DateTime.Now,
                items = items.ToArray()
            };
            _barchart_tmp.InsertOne(_tmp);

            return Ok(new
            {
                _id = _tmp._id,
                error_count = error_count
            });
        }

        [Authorize("PeBarchart Add")]
        [HttpGet("Tmp")]
        public ActionResult GetTmp(string _id, String sort = "well", String order = "asc", int page = 0, int pagesize = 50, String filter = "", String columnfilter = "", string mode = "")
        {
            BarchartTmp _tmp = _barchart_tmp.Find(t => t._id == _id).FirstOrDefault();
            if (_tmp == null)
            {
                return NotFound(new { message = "Tmp data not found" });
            }

            List<Barchart> _tmpitems = _tmp.items.ToList();

            if (mode == "error")
            {
                _tmpitems = _tmpitems.Where(t => t._error != null && t._error._row != null).ToList();
            }

            var total_count = _tmpitems.Count();
            var error_count = _tmp.items.Where(t => t._error != null && t._error._row != null && t._error._row.value == "error").Count();

            // Sorting
            switch (sort)
            {
                case "well": _tmpitems = (order == "asc") ? _tmpitems.OrderBy(t => t.well).ToList() : _tmpitems.OrderByDescending(t => t.well).ToList(); break;
                case "job": _tmpitems = (order == "asc") ? _tmpitems.OrderBy(t => t.job).ToList() : _tmpitems.OrderByDescending(t => t.job).ToList(); break;
                case "rig": _tmpitems = (order == "asc") ? _tmpitems.OrderBy(t => t.rig).ToList() : _tmpitems.OrderByDescending(t => t.rig).ToList(); break;
                case "plan_start": _tmpitems = (order == "asc") ? _tmpitems.OrderBy(t => t.plan_start).ToList() : _tmpitems.OrderByDescending(t => t.plan_start).ToList(); break;
                case "plan_end": _tmpitems = (order == "asc") ? _tmpitems.OrderBy(t => t.plan_end).ToList() : _tmpitems.OrderByDescending(t => t.plan_end).ToList(); break;
                case "remarks": _tmpitems = (order == "asc") ? _tmpitems.OrderBy(t => t.remarks).ToList() : _tmpitems.OrderByDescending(t => t.remarks).ToList(); break;
            }

            List<Barchart> items = _tmpitems
                .Skip(page * pagesize)
                .Take(pagesize)
                .ToList();

            return new JsonResult(new
            {
                total_count = total_count,
                error_count = error_count,
                incomplete_result = false,
                items = items
            })
            {
                StatusCode = StatusCodes.Status200OK
            };
        }


        [Authorize("PeBarchart Add")]
        [HttpGet("SaveData")]
        public ActionResult SaveData(string _id)
        {
            BarchartTmp _tmp = _barchart_tmp.Find(t => t._id == _id).FirstOrDefault();
            if (_tmp == null)
            {
                return NotFound(new { message = "Tmp data not found" });
            }

            var tmpItems = _tmp.items.Where(t => t._error == null || t._error._row == null || t._error._row.value != "error").ToList();
            int modified_count = 0;
            int created_count = 0;

            foreach (var item in tmpItems)
            {
                var filter = Builders<Barchart>.Filter.Eq(t => t.well, item.well) &
                             Builders<Barchart>.Filter.Eq(t => t.plan_start, item.plan_start) &
                             Builders<Barchart>.Filter.Eq(t => t.plan_end, item.plan_end);

                var existing = _barchart.Find(filter).FirstOrDefault();

                if (existing != null)
                {
                    var update = Builders<Barchart>.Update
                        .Set(t => t.job, item.job)
                        .Set(t => t.rig, item.rig)
                        .Set(t => t.plan_end, item.plan_end)
                        .Set(t => t.remarks, item.remarks)
                        .Set(t => t.updated_date, DateTime.Now);

                    _barchart.UpdateOne(filter, update);
                    modified_count++;
                }
                else
                {
                    Barchart newItem = new Barchart
                    {
                        well = item.well,
                        job = item.job,
                        rig = item.rig,
                        plan_start = item.plan_start,
                        plan_end = item.plan_end,
                        remarks = item.remarks,
                        created_date = DateTime.Now
                    };
                    _barchart.InsertOne(newItem);
                    created_count++;
                }
            }

            // Clean up temp data
            _barchart_tmp.DeleteOne(t => t._id == _id);

            return new JsonResult(new
            {
                total_count = modified_count + created_count,
                modified_count = modified_count,
                created_count = created_count
            })
            {
                StatusCode = StatusCodes.Status200OK
            };
        }

        private ActionResult GetExcel(List<Barchart> items)
        {
            using (var package = new ExcelPackage())
            {
                var worksheet = package.Workbook.Worksheets.Add("Barchart");

                // Header
                worksheet.Cells[1, 2].Value = "Well";
                worksheet.Cells[1, 3].Value = "Job";
                worksheet.Cells[1, 4].Value = "Rig";
                worksheet.Cells[1, 5].Value = "Plan Start";
                worksheet.Cells[1, 6].Value = "Plan End";
                worksheet.Cells[1, 7].Value = "Remarks";

                // Style header
                using (var range = worksheet.Cells[1, 1, 1, 5])
                {
                    range.Style.Font.Bold = true;
                    range.Style.Fill.PatternType = ExcelFillStyle.Solid;
                    range.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.LightGray);
                }

                // Data
                int row = 2;
                foreach (var item in items)
                {
                    worksheet.Cells[row, 2].Value = item.well;
                    worksheet.Cells[row, 3].Value = item.job;
                    worksheet.Cells[row, 4].Value = item.rig;
                    worksheet.Cells[row, 5].Value = item.plan_start;
                    worksheet.Cells[row, 6].Value = item.plan_end;

                    worksheet.Cells[row, 5].Style.Numberformat.Format = "dd-MMM-yyyy";
                    worksheet.Cells[row, 6].Style.Numberformat.Format = "dd-MMM-yyyy";

                    worksheet.Cells[row, 7].Value = item.remarks;

                    row++;
                }

                worksheet.Cells.AutoFitColumns();

                var stream = new MemoryStream();
                package.SaveAs(stream);
                stream.Position = 0;

                return File(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Barchart.xlsx");
            }
        }
    }
}
