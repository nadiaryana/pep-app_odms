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
using ssc.Models;
using System.Globalization;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System.IO;

namespace ssc.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LocationController : ControllerBase
    {
        private IMongoDatabase database;
        private readonly IMongoCollection<Location> _location;
        private readonly IMongoCollection<LocationTmp> _location_tmp;
        private ProjectionDefinition<Location> _fields_location;
        private int tmp_start_id = 1000000000;

        public LocationController(ICommonDatabaseSettings settings)
        {
            database = Common.database;

            _location = Common._location;
            _location_tmp = Common._location_tmp;
            _fields_location = Common._fields_location;
        }

      //  [Authorize("Location Read")]
        [HttpGet]
        public ActionResult Get(String sort = "date", String order = "desc", int page = 0, int pagesize = 50, String filter = "", String columnfilter = "", string mode = "")
        {

            //var _items = _tickets.Find(t => true);
            FilterDefinition<Location> xfilter = Builders<Location>.Filter.Ne("a", "b");
            FilterDefinition<Location> xcolfilter;
            FilterDefinition<Location> xpandfilter = Builders<Location>.Filter.Ne("a", "b");

            if (!String.IsNullOrWhiteSpace(filter))
            {
                filter = filter.ToLower();
                xfilter =
                    Builders<Location>.Filter.Regex(t => t.id, new BsonRegularExpression(filter, "i")) |
                    Builders<Location>.Filter.Regex(t => t.name, new BsonRegularExpression(filter, "i")) |
                    Builders<Location>.Filter.Regex(t => t.parent_id, new BsonRegularExpression(filter, "i")) |
                    Builders<Location>.Filter.Regex(t => t.type, new BsonRegularExpression(filter, "i"));
            }

            if (!String.IsNullOrWhiteSpace(columnfilter))
            {
                xcolfilter = Builders<Location>.Filter.Ne("a", "b");

                LocationList colfilter = JsonConvert.DeserializeObject<LocationList>(columnfilter);

                if (colfilter.id?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Location>.Filter.Or(colfilter.id.ToList().Where(c => !(c is JObject)).Select(c => Builders<Location>.Filter.Eq(t => t.id, Convert.ToInt32(c))));
                if (colfilter.name?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Location>.Filter.Or(colfilter.name.ToList().Where(c => !(c is JObject)).Select(c => Builders<Location>.Filter.Regex(t => t.name, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.parent_id?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Location>.Filter.Or(colfilter.parent_id.ToList().Where(c => !(c is JObject)).Select(c => Builders<Location>.Filter.Eq(t => t.parent_id, Convert.ToInt32(c))));
                if (colfilter.type?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Location>.Filter.Or(colfilter.type.ToList().Where(c => !(c is JObject)).Select(c => Builders<Location>.Filter.Regex(t => t.type, new BsonRegularExpression((string)c, "i"))));

                foreach (string log in Common._logical)
                {
                    if (colfilter.id?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.id.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$id\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.name?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.name.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$name\",regex:\"{0}\",options:\"i\"}}}}", Common.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.parent_id?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.parent_id.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$parent_id\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.type?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.type.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$type\",regex:\"{0}\",options:\"i\"}}}}", Common.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                }

                if (colfilter.expand?.ToList().Count(c => !(c is JObject)) > 0)
                {
                    List<int?> parent_ids = colfilter.expand.Select(c => int.TryParse(Convert.ToString(c), out var f) ? f : default(int?)).ToList();
                    parent_ids.Add(default(int?)); // always include root
                    xpandfilter = xpandfilter & Builders<Location>.Filter.Or(parent_ids.Select(c => Builders<Location>.Filter.Eq(t => t.parent_id, c)));
                }

                xfilter = xfilter & xcolfilter;
            } else
            {
                xpandfilter = xpandfilter & Builders<Location>.Filter.Eq(t => t.parent_id, null);// always include root
            }
            xfilter = xfilter & xpandfilter;

            var _items = _location.Find(xfilter, new FindOptions() { Collation = new Collation("en_US", numericOrdering: true) });
            var total_count = _items.CountDocuments();

            switch (sort)
            {
                case "id": _items = (order == "asc") ? _items.SortBy(t => t.id) : _items.SortByDescending(t => t.id); break;
                case "name": _items = (order == "asc") ? _items.SortBy(t => t.name) : _items.SortByDescending(t => t.name); break;
                case "parent_id": _items = (order == "asc") ? _items.SortBy(t => t.parent_id) : _items.SortByDescending(t => t.parent_id); break;
                case "type": _items = (order == "asc") ? _items.SortBy(t => t.type) : _items.SortByDescending(t => t.type); break;
            }

            switch (mode)
            {
                case "":
                case null:
                    List<Location> items = _items
                    //.Skip(page * pagesize)
                    //.Limit(pagesize)
                    .Project<Location>(_fields_location).ToList();

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
                    return GetExcel(_items
                    //.Limit(10000)
                    .Project<Location>(_fields_location).ToList());

                default:
                    dynamic res;
                    switch (mode)
                    {
                        default:
                            res = _location.Distinct<string>(mode, xfilter).ToEnumerable().OrderBy(t => t).ToList();
                            break;
                    }

                    return new JsonResult(new
                    {
                        //total_count = res.Count(),
                        items = res,
                    });
            }

        }

        public ActionResult GetExcel(List<Location> items)
        {
            int type_col = 3;
            type_col = 3 + items.Select(i => i.path.Length).Max();

            var workbook = new ExcelPackage();
            var ws = workbook.Workbook.Worksheets.Add("Location");
            ws.Cells[1, 1].Value = "ID";
            ws.Cells[1, 2].Value = "Name";
            ws.Cells[1, 2, 1, type_col - 1].Merge = true;
            //ws.Cells[1, 3].Value = "Parent";
            ws.Cells[1, type_col].Value = "Type";

            ws.Cells[1, 1, 1, type_col].Style.Font.Bold = true;
            ws.Cells[1, 1, 1, type_col].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            ws.Cells[1, 1, 1, type_col].Style.VerticalAlignment = ExcelVerticalAlignment.Top;

            for (int c = 2; c < type_col-1; c++)
            {
                ws.Column(c).Width = 3;
            }
            ws.Column(type_col - 1).Width = 20;

            items = items.OrderBy(t => String.Join("-", t.path.Append(t.id.Value).Select(a => a.ToString().PadLeft(9, '0')).ToArray())).ToList();
            for (int i = 0; i < items.Count(); i++)
            {
                var t = items.ElementAt(i);
                ws.Cells[2 + i, 1].Value = t.id;
                ws.Cells[2 + i, 2 + t.path.Length].Value = t.name;
                //ws.Cells[2 + i, 3].Value = t.parent_id;
                ws.Cells[2 + i, type_col].Value = t.type;
                //ws.Cells[2 + i, type_col + 1].Value = String.Join("-", t.path.Append(t.id.Value).Select(a => a.ToString().PadLeft(9, '0')).ToArray());
            }

            MemoryStream memoryStream = new MemoryStream(workbook.GetAsByteArray());
            memoryStream.Position = 0;
            return File(memoryStream, "application/vnd.ms-excel", "Location.xlsx");
        }

       // [Authorize("Location Add")]
        [HttpPost("UploadFiles")]
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

            List<Location> items = new List<Location>();
            int error_count = 0;
            int type_col = 3;
            List<int> id_path = new List<int> { };
            int tmp_id = tmp_start_id;
            int base_depth = 0;

            for (var c = 3; c < 10; c++)
            {
                if(ws.Cells[1, c].Value?.ToString().ToLower() == "type") {
                    type_col = c;
                    break;
                }
            }

            for (var r = 2; r <= rowCount; r++)
            {
                Location _row = new Location();
                LocationError _row_error = new LocationError();
                Location _existrow;

                int last_error_count = error_count;

                if (!String.IsNullOrWhiteSpace(ws.Cells[r, 1].Value?.ToString().Trim()))
                {
                    _row.id = Convert.ToInt32(ws.Cells[r, 1].Value?.ToString().Trim());
                }

                for (var c = 2; c < type_col; c++)
                {
                    if (!String.IsNullOrWhiteSpace(ws.Cells[r, c].Value?.ToString().Trim()))
                    {
                        tmp_id++;
                        _existrow = null;
                        if (c == 2) id_path = new List<int> { };

                        if (!_row.id.HasValue)
                        {
                            _row.id = tmp_id;
                        } else
                        {
                            _existrow = _location.Find(t => t.id == _row.id).FirstOrDefault();
                            if(_existrow == null)
                            {
                                _row_error._row = new ErrorItem { value = "error", message = "ID not found" };
                            } else
                            {
                                _row_error._row = new ErrorItem { value = "warning", message = "Existing ID found, data will be replaced" };
                            }
                        }

                        _row.name = ws.Cells[r, c].Value?.ToString().Trim();

                        if (_existrow != null && id_path.Count == 0)
                        {
                            _row.path = _existrow.path;
                            _row.parent_id = _existrow.parent_id;
                            id_path.AddRange(_existrow.path);
                            base_depth = _existrow.path.Count();
                        } else
                        {
                            if (id_path.Count > base_depth + c - 2)
                            {
                                id_path.RemoveRange(base_depth + c - 2, id_path.Count - (base_depth + c - 2));
                            }
                            if (id_path.Count > 0) _row.parent_id = id_path.Last();
                            _row.path = id_path.ToArray();
                        }
                        id_path.Add(_row.id.Value);

                        if (!String.IsNullOrWhiteSpace(ws.Cells[r, type_col].Value?.ToString().Trim()))
                        {
                            _row.type = ws.Cells[r, type_col].Value?.ToString().Trim();
                        }
                        else
                        {
                            _row_error.type = new ErrorItem { value = "(Blank)", message = "Blank Type is not allowed" };
                            error_count++;
                        }

                        /*
                        if (_row_error.id == null)
                        {
                            if (_location.Find(t => t.id == _row.id).CountDocuments() > 0)
                            {
                                _row_error._row = new ErrorItem { value = "warning", message = "Existing ID found, data will be replaced" };
                            }
                        }
                        */

                        _row._error = _row_error;
                        items.Add(_row);

                        break;
                    }
                }

                if (String.IsNullOrEmpty(_row.name))
                {
                    _row_error.name = new ErrorItem { value = "(Blank)", message = "Blank Name is not allowed" };
                    error_count++;
                }

                if (error_count > last_error_count)
                {
                    _row_error._row = new ErrorItem { value = "error", message = "Error found" };
                }

            }

            LocationTmp _tmp = new LocationTmp
            {
                error_count = error_count,
                items = items.ToArray()
            };
            _location_tmp.InsertOne(_tmp);

            return Ok(new
            {
                _id = _tmp._id,
                //items = items,
                error_count = error_count
            });
        }

        //[Authorize("Location Add")]
        [HttpGet("Tmp")]
        public ActionResult GetTmp(string _id, String sort = "date", String order = "desc", int page = 0, int pagesize = 50, String filter = "", String columnfilter = "", string mode = "")
        {
            LocationTmp _tmp = _location_tmp.Find(t => t._id == _id).FirstOrDefault();
            List<Location> _tmpitems = _tmp.items.ToList();
            if (mode == "error")
            {
                _tmpitems = _tmpitems.Where(r => r._error._row?.value == "error").ToList();
            }
            else if (mode == "warning")
            {
                _tmpitems = _tmpitems.Where(r => r._error._row?.value == "warning").ToList();
            }
            int total_count = _tmpitems.Count();
            if (pagesize * (page + 1) > total_count) pagesize = total_count - (page * pagesize);

            if (_tmp != null)
            {
                List<Location> items = _tmpitems.ToList().GetRange(page * pagesize, pagesize);
                return new JsonResult(new
                {
                    total_count = total_count,
                    error_count = _tmp.error_count,
                    incomplete_result = false,
                    items = items,
                })
                {
                    StatusCode = StatusCodes.Status200OK
                };
            }
            else
            {
                return BadRequest();
            }


        }

        //[Authorize("Location Add")]
        [HttpGet("SaveData")]
        public ActionResult SaveData(string _id)
        {
            try
            {
                LocationTmp _tmp = _location_tmp.Find(t => t._id == _id).FirstOrDefault();

                if (_tmp == null || _tmp.error_count > 0)
                {
                    throw new Exception();
                }

                List<Location> items = _tmp.items.ToList();

                long modified_count = 0;
                long created_count = items.Count();
                int last_id = _location.Find(t => true).Project<Location>(_fields_location).ToList().Select(t => t.id).Max() ?? 0;

                foreach (Location item in items)
                {
                    item._error = null;

                    var update = Builders<Location>.Update.Set(t => t.id, (item.id >= tmp_start_id) ? last_id + item.id - tmp_start_id : item.id)
                        .Set(t => t.name, item.name)
                        .Set(t => t.parent_id, (item.parent_id >= tmp_start_id) ? last_id + item.parent_id - tmp_start_id : item.parent_id)
                        .Set(t => t.path, item.path?.Select(p => (p >= tmp_start_id) ? last_id + p - tmp_start_id : p).ToArray())
                        .Set(t => t.type, item.type)
                        .Set(t => t.has_children, false)
                        .Set(t => t.updated_by, User.Identity.Name)
                        .Set(t => t.updated_date, DateTime.Now)
                        .SetOnInsert(t => t.created_by, User.Identity.Name)
                        .SetOnInsert(t => t.created_date, DateTime.Now);

                    UpdateResult res = _location.UpdateOne(
                        Builders<Location>.Filter.Eq(t => t.id, item.id),
                        update, new UpdateOptions() { IsUpsert = true });

                    modified_count += res.ModifiedCount;
                    created_count -= res.ModifiedCount;
                }

                List<int?> parent_ids = _location.Distinct<int?>("parent_id", Builders<Location>.Filter.Ne("a", "b")).ToList();
                if(parent_ids.Count() > 0)
                {
                    _location.UpdateMany(t => !parent_ids.Contains(t.id), Builders<Location>.Update.Set(t => t.has_children, false));
                    _location.UpdateMany(t => parent_ids.Contains(t.id), Builders<Location>.Update.Set(t => t.has_children, true));
                }

                _location_tmp.DeleteOne(d => d._id == _id);
                return Ok(new
                {
                    modified_count = modified_count,
                    created_count = created_count,
                    total_count = items.Count()
                });
            }
            catch (Exception e)
            {
                return BadRequest();
            }
        }

       // [Authorize("Location Delete")]
        [HttpDelete]
        public ActionResult Delete(string[] _ids)
        {
            try
            {
                long deleted_count = 0;
                long total_count = _ids.Length;
                foreach (string _id in _ids)
                {
                    DeleteResult res = _location.DeleteOne(t => t._id == _id);
                    deleted_count += res.DeletedCount;
                }

                List<int?> parent_ids = _location.Distinct<int?>("parent_id", Builders<Location>.Filter.Ne("a", "b")).ToList();
                if (parent_ids.Count() > 0)
                {
                    _location.UpdateMany(t => !parent_ids.Contains(t.id), Builders<Location>.Update.Set(t => t.has_children, false));
                    _location.UpdateMany(t => parent_ids.Contains(t.id), Builders<Location>.Update.Set(t => t.has_children, true));
                }

                return Ok(new
                {
                    deleted_count = deleted_count,
                    total_count = total_count
                });
            }
            catch (MongoException e)
            {
                return BadRequest();
            }
        }
    }
}