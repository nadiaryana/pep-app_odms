using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using ssc.Areas.PE.Models;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using OfficeOpenXml;

namespace ssc.Areas.PE.Controllers
{
    [Route("api/pe/[controller]")]
    [ApiController]
    public class RodPumpDataController : ControllerBase
    {
        private readonly IMongoCollection<RodPumpData> _rod_pump;
        private readonly IMongoCollection<RodPumpDataTmp> _rod_pump_tmp;

        public RodPumpDataController(IPEDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase("pe");

            _rod_pump = database.GetCollection<RodPumpData>("rod_pump_data");
            _rod_pump_tmp = database.GetCollection<RodPumpDataTmp>("rod_pump_data_tmp");
        }

        [Authorize("PePumpingUnit Read")]
        [HttpGet]
        public ActionResult Get(String sort = "rod_nomor", String order = "asc", int page = 0, int pagesize = 50)
        {
            if (page < 0) page = 0;
            if (pagesize <= 0) pagesize = 50;

            FilterDefinition<RodPumpData> xfilter = Builders<RodPumpData>.Filter.Empty;

            var total_count = _rod_pump.CountDocuments(xfilter);
            List<RodPumpData> items = _rod_pump.Find(xfilter)
                .Sort(GetSort(sort, order))
                .Skip(page * pagesize)
                .Limit(pagesize)
                .ToList();

            return new JsonResult(new
            {
                total_count = total_count,
                items = items,
            })
            {
                StatusCode = StatusCodes.Status200OK
            };
        }

        private SortDefinition<RodPumpData> GetSort(String sort, String order)
        {
            bool asc = String.IsNullOrWhiteSpace(order) || order == "asc";

            switch (sort)
            {
                case "plunger_diameter": return asc ? Builders<RodPumpData>.Sort.Ascending(t => t.plunger_diameter) : Builders<RodPumpData>.Sort.Descending(t => t.plunger_diameter);
                case "rod_weight": return asc ? Builders<RodPumpData>.Sort.Ascending(t => t.rod_weight) : Builders<RodPumpData>.Sort.Descending(t => t.rod_weight);
                case "elastic_constat": return asc ? Builders<RodPumpData>.Sort.Ascending(t => t.elastic_constat) : Builders<RodPumpData>.Sort.Descending(t => t.elastic_constat);
                case "freq_factor": return asc ? Builders<RodPumpData>.Sort.Ascending(t => t.freq_factor) : Builders<RodPumpData>.Sort.Descending(t => t.freq_factor);
                case "rod_string1": return asc ? Builders<RodPumpData>.Sort.Ascending(t => t.rod_string1) : Builders<RodPumpData>.Sort.Descending(t => t.rod_string1);
                case "rod_string2": return asc ? Builders<RodPumpData>.Sort.Ascending(t => t.rod_string2) : Builders<RodPumpData>.Sort.Descending(t => t.rod_string2);
                case "rod_string3": return asc ? Builders<RodPumpData>.Sort.Ascending(t => t.rod_string3) : Builders<RodPumpData>.Sort.Descending(t => t.rod_string3);
                case "rod_string4": return asc ? Builders<RodPumpData>.Sort.Ascending(t => t.rod_string4) : Builders<RodPumpData>.Sort.Descending(t => t.rod_string4);
                case "rod_string5": return asc ? Builders<RodPumpData>.Sort.Ascending(t => t.rod_string5) : Builders<RodPumpData>.Sort.Descending(t => t.rod_string5);
                case "rod_string6": return asc ? Builders<RodPumpData>.Sort.Ascending(t => t.rod_string6) : Builders<RodPumpData>.Sort.Descending(t => t.rod_string6);
                case "rod_string7": return asc ? Builders<RodPumpData>.Sort.Ascending(t => t.rod_string7) : Builders<RodPumpData>.Sort.Descending(t => t.rod_string7);
                case "rod_nomor":
                default:
                    return asc ? Builders<RodPumpData>.Sort.Ascending(t => t.rod_nomor) : Builders<RodPumpData>.Sort.Descending(t => t.rod_nomor);
            }
        }

                [Authorize("PePumpingUnit Add")]
        [HttpPost("UploadFiles")]
        public async Task<IActionResult> UploadFiles(List<IFormFile> files)
        {
            // simpan file ke temp
            var filePath = Path.GetTempFileName();
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await files[0].CopyToAsync(stream);
            }

            var workbook = new ExcelPackage(new FileInfo(filePath));
            var ws = workbook.Workbook.Worksheets.First();
            int rowCount = ws.Dimension.End.Row;

            string[] columnNames = { "Rod No", "Plunger diam", "Rod Weight", "Elastic Constant", "Frequency Factor",
                                     "1 1/4\"", "1 1/8\"", "1\"", "7/8\"", "3/4\"", "5/8\"", "1/2\"" };

            List<RodPumpData> items = new List<RodPumpData>();
            int error_count = 0;

            // baris 1-2 header, data mulai baris 3
            for (var r = 3; r <= rowCount; r++)
            {
                if (String.IsNullOrWhiteSpace(ws.Cells[r, 1].Value?.ToString())) continue;

                RodPumpData item = new RodPumpData
                {
                    rod_nomor        = ToDecimal(ws.Cells[r, 1].Value),
                    plunger_diameter = ToDecimal(ws.Cells[r, 2].Value),
                    rod_weight       = ToDecimal(ws.Cells[r, 3].Value),
                    elastic_constat  = ToDecimal(ws.Cells[r, 4].Value),
                    freq_factor      = ToDecimal(ws.Cells[r, 5].Value),
                    rod_string1      = ToDecimal(ws.Cells[r, 6].Value),
                    rod_string2      = ToDecimal(ws.Cells[r, 7].Value),
                    rod_string3      = ToDecimal(ws.Cells[r, 8].Value),
                    rod_string4      = ToDecimal(ws.Cells[r, 9].Value),
                    rod_string5      = ToDecimal(ws.Cells[r, 10].Value),
                    rod_string6      = ToDecimal(ws.Cells[r, 11].Value),
                    rod_string7      = ToDecimal(ws.Cells[r, 12].Value),
                    _error           = new RodPumpDataError(),
                };

                // cek kolom yang isinya bukan angka
                List<string> invalid = new List<string>();
                for (int c = 1; c <= 12; c++)
                {
                    if (IsInvalid(ws.Cells[r, c].Value)) invalid.Add(columnNames[c - 1]);
                }

                if (invalid.Count > 0)
                {
                    item._error._row = new ErrorItem { value = "error", message = "Baris " + r + ": kolom " + String.Join(", ", invalid) + " bukan angka" };
                    error_count++;
                }
                else if (_rod_pump.Find(DuplicateFilter(item)).CountDocuments() > 0)
                {
                    item._error._row = new ErrorItem { value = "warning", message = "Data sudah ada, akan dilewati" };
                }

                items.Add(item);
            }

            RodPumpDataTmp _tmp = new RodPumpDataTmp
            {
                error_count = error_count,
                items = items.ToArray()
            };
            _rod_pump_tmp.InsertOne(_tmp);

            return Ok(new
            {
                _id = _tmp._id,
                error_count = error_count
            });
        }

        [Authorize("PePumpingUnit Add")]
        [HttpGet("Tmp")]
        public ActionResult GetTmp(string _id, int page = 0, int pagesize = 50, string mode = "all")
        {
            RodPumpDataTmp _tmp = _rod_pump_tmp.Find(t => t._id == _id).FirstOrDefault();
            if (_tmp == null) return BadRequest();

            List<RodPumpData> items = _tmp.items.ToList();
            if (mode == "error" || mode == "warning")
            {
                items = items.Where(t => t._error?._row?.value == mode).ToList();
            }

            return new JsonResult(new
            {
                total_count = items.Count,
                error_count = _tmp.error_count,
                items = items.Skip(page * pagesize).Take(pagesize).ToList(),
            })
            {
                StatusCode = StatusCodes.Status200OK
            };
        }

        [Authorize("PePumpingUnit Add")]
        [HttpGet("SaveData")]
        public ActionResult SaveData(string _id)
        {
            RodPumpDataTmp _tmp = _rod_pump_tmp.Find(t => t._id == _id).FirstOrDefault();
            if (_tmp == null || _tmp.error_count > 0) return BadRequest();

            int created_count = 0;
            int duplicate_count = 0;

            foreach (RodPumpData item in _tmp.items)
            {
                // lewati kalau sudah ada (termasuk baris kembar di excel yang sama)
                if (_rod_pump.Find(DuplicateFilter(item)).CountDocuments() > 0)
                {
                    duplicate_count++;
                    continue;
                }

                item._id = null;
                item._error = null;
                item.created_by = User.Identity.Name;
                item.created_date = DateTime.Now;
                item.updated_by = User.Identity.Name;
                item.updated_date = DateTime.Now;

                _rod_pump.InsertOne(item);
                created_count++;
            }

            _rod_pump_tmp.DeleteOne(t => t._id == _id);

            return Ok(new
            {
                created_count = created_count,
                duplicate_count = duplicate_count,
                total_count = _tmp.items.Length
            });
        }
    
        // ubah isi cell excel jadi angka
        private decimal? ToDecimal(object value)
        {
            if (value == null) return null;
            if (value is double) return Convert.ToDecimal((double)value);

            string text = value.ToString().Trim();

            // "—" dan "All" disimpan null
            if (text == "" || text == "—" || text == "-" || text.ToLower() == "all") return null;

            decimal hasil;

            // format teks elastic constant: "0,997 × 10⁻⁶"
            if (text.Contains("×"))
            {
                text = text.Split('×')[0].Trim();
                if (decimal.TryParse(text.Replace(",", "."), NumberStyles.Any, CultureInfo.InvariantCulture, out hasil))
                    return hasil * 0.000001m;
                return null;
            }

            if (decimal.TryParse(text.Replace(",", "."), NumberStyles.Any, CultureInfo.InvariantCulture, out hasil))
                return hasil;
            return null;
        }

                // duplikat = semua kolom sama
        private FilterDefinition<RodPumpData> DuplicateFilter(RodPumpData item)
        {
            return Builders<RodPumpData>.Filter.Eq(t => t.rod_nomor, item.rod_nomor)
                & Builders<RodPumpData>.Filter.Eq(t => t.plunger_diameter, item.plunger_diameter)
                & Builders<RodPumpData>.Filter.Eq(t => t.rod_weight, item.rod_weight)
                & Builders<RodPumpData>.Filter.Eq(t => t.elastic_constat, item.elastic_constat)
                & Builders<RodPumpData>.Filter.Eq(t => t.freq_factor, item.freq_factor)
                & Builders<RodPumpData>.Filter.Eq(t => t.rod_string1, item.rod_string1)
                & Builders<RodPumpData>.Filter.Eq(t => t.rod_string2, item.rod_string2)
                & Builders<RodPumpData>.Filter.Eq(t => t.rod_string3, item.rod_string3)
                & Builders<RodPumpData>.Filter.Eq(t => t.rod_string4, item.rod_string4)
                & Builders<RodPumpData>.Filter.Eq(t => t.rod_string5, item.rod_string5)
                & Builders<RodPumpData>.Filter.Eq(t => t.rod_string6, item.rod_string6)
                & Builders<RodPumpData>.Filter.Eq(t => t.rod_string7, item.rod_string7);
        }

        // true kalau cell ada isinya tapi bukan angka
        private bool IsInvalid(object value)
        {
            string text = value?.ToString().Trim();
            if (String.IsNullOrWhiteSpace(text) || text == "—" || text == "-" || text.ToLower() == "all") return false;
            return ToDecimal(value) == null;
        }
    }
}
