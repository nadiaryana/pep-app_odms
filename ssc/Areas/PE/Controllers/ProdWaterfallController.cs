using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using MongoDB.Bson;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using ssc.Areas.PE.Models;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System.IO;

namespace ssc.Areas.PE.Controllers
{

    [Route("api/pe/[controller]")]
    [ApiController]
    public class ProdWaterfallController : ControllerBase
    {
        private readonly IMongoCollection<ProdWaterfall> _prod_waterfall;
        private readonly IMongoCollection<ProdWaterfallKategori> _kategori;
        private readonly IMongoCollection<Daily> _daily;


        private static readonly ProdWaterfallKategori[] DefaultKategori = new[]
        {
            new ProdWaterfallKategori { code = "A", name = "ARLIFT ISSUES AND FLUCTUATION", order = 1 },
            new ProdWaterfallKategori { code = "B", name = "WC RELATED", order = 2 },
            new ProdWaterfallKategori { code = "C", name = "OTHER"                      , order = 3 },
        };

        public ProdWaterfallController(IPEDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);
            _prod_waterfall = database.GetCollection<ProdWaterfall>("prod_waterfall");
            _kategori = database.GetCollection<ProdWaterfallKategori>("prod_waterfall_kategori");
            _daily = DailyCommon._daily;
        }



        [Authorize("PeProdWaterfall Read")]
        [HttpGet]
        public ActionResult Get(
            DateTime? start_date = null,
            DateTime? end_date = null,
            String sort = "kategori",
            String order = "asc",
            int page = 0,
            int pagesize = 50,
            String filter = "",
            String columnfilter = "",
            string mode = "")
        {
            FilterDefinition<ProdWaterfall> xfilter = PeriodFilter(start_date, end_date);
            FilterDefinition<ProdWaterfall> xcolfilter;

            if (!String.IsNullOrWhiteSpace(filter))
            {
                filter = filter.ToLower();
                xfilter = xfilter & (
                    Builders<ProdWaterfall>.Filter.Regex(t => t.well, new BsonRegularExpression(filter, "i")) |
                    Builders<ProdWaterfall>.Filter.Regex(t => t.kategori, new BsonRegularExpression(filter, "i")) |
                    Builders<ProdWaterfall>.Filter.Regex(t => t.remarks, new BsonRegularExpression(filter, "i"))
                );
            }

            if (!String.IsNullOrWhiteSpace(columnfilter))
            {
                xcolfilter = Builders<ProdWaterfall>.Filter.Ne("a", "b");
                ProdWaterfallList colfilter = JsonConvert.DeserializeObject<ProdWaterfallList>(columnfilter);

                if (colfilter.well?.ToList().Count(c => !(c is JObject)) > 0)
                    xcolfilter = xcolfilter & Builders<ProdWaterfall>.Filter.Or(colfilter.well.ToList().Where(c => !(c is JObject)).Select(c => Builders<ProdWaterfall>.Filter.Regex(t => t.well, new BsonRegularExpression((string)c, "i"))));

                if (colfilter.kategori?.ToList().Count(c => !(c is JObject)) > 0)
                    xcolfilter = xcolfilter & Builders<ProdWaterfall>.Filter.Or(colfilter.kategori.ToList().Where(c => !(c is JObject)).Select(c => Builders<ProdWaterfall>.Filter.Regex(t => t.kategori, new BsonRegularExpression((string)c, "i"))));

                if (colfilter.remarks?.ToList().Count(c => !(c is JObject)) > 0)
                    xcolfilter = xcolfilter & Builders<ProdWaterfall>.Filter.Or(colfilter.remarks.ToList().Where(c => !(c is JObject)).Select(c => Builders<ProdWaterfall>.Filter.Regex(t => t.remarks, new BsonRegularExpression((string)c, "i"))));

                if (colfilter.delta_prod?.ToList().Count(c => !(c is JObject)) > 0)
                    xcolfilter = xcolfilter & Builders<ProdWaterfall>.Filter.Or(colfilter.delta_prod.ToList().Where(c => !(c is JObject)).Select(c => Builders<ProdWaterfall>.Filter.Eq(t => t.delta_prod, Convert.ToDecimal(c))));

                xfilter = xfilter & xcolfilter;
            }

            var _items = _prod_waterfall.Find(xfilter, new FindOptions() { Collation = new Collation("en_US", numericOrdering: true) });
            var total_count = _items.CountDocuments();

            switch (sort)
            {
                case "well": _items = (order == "asc") ? _items.SortBy(t => t.well) : _items.SortByDescending(t => t.well); break;
                case "kategori": _items = (order == "asc") ? _items.SortBy(t => t.kategori).ThenBy(t => t.well) : _items.SortByDescending(t => t.kategori).ThenBy(t => t.well); break;
                case "delta_prod": _items = (order == "asc") ? _items.SortBy(t => t.delta_prod) : _items.SortByDescending(t => t.delta_prod); break;
                case "remarks": _items = (order == "asc") ? _items.SortBy(t => t.remarks) : _items.SortByDescending(t => t.remarks); break;
                default: _items = (order == "asc") ? _items.SortBy(t => t.kategori).ThenBy(t => t.well) : _items.SortByDescending(t => t.kategori).ThenBy(t => t.well); break;
            }

            if (mode == "excel")
            {
                return GetExcel(_items.ToList(), start_date, end_date);
            }

            if (!String.IsNullOrWhiteSpace(mode))
            {
                dynamic res;
                switch (mode)
                {
                    case "delta_prod":
                        res = _prod_waterfall.Distinct<decimal?>(mode, xfilter).ToEnumerable().OrderBy(t => t).ToList();
                        break;
                    default:
                        res = _prod_waterfall.Distinct<string>(mode, xfilter).ToEnumerable().Where(t => !String.IsNullOrEmpty(t)).OrderBy(t => t).ToList();
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

            var items = _items.Skip(page * pagesize).Limit(pagesize).ToList();

            // Total per kategori dari seluruh hasil filter (tanpa paging), dipakai
            // sebagai baris header kategori di tabel halaman list.
            var master = EnsureKategori();
            var categories = _prod_waterfall
                .Find(xfilter)
                .Project<ProdWaterfall>(Builders<ProdWaterfall>.Projection
                    .Include(t => t.kategori)
                    .Include(t => t.delta_prod))
                .ToList()
                .GroupBy(t => t.kategori ?? "")
                .Select(g => new
                {
                    kategori = g.Key,
                    label = LabelOf(master, g.Key),
                    delta_prod = g.Sum(t => t.delta_prod ?? 0),
                    well_count = g.Count(),
                })
                .OrderBy(g => OrderOf(master, g.kategori))
                .ToList();

            return new JsonResult(new
            {
                total_count = total_count,
                incomplete_result = false,
                categories = categories,
                items = items,
            })
            {
                StatusCode = StatusCodes.Status200OK
            };
        }

        // ------------------------------------------------------------------
        // GET: data untuk halaman chart (total awal/akhir + delta per kategori)
        // ------------------------------------------------------------------

        [Authorize("PeProdWaterfall Read")]
        [HttpGet("Chart")]
        public ActionResult GetChart(DateTime? start_date = null, DateTime? end_date = null)
        {
            var master = EnsureKategori();
            var items = _prod_waterfall.Find(PeriodFilter(start_date, end_date)).ToList();

            var categories = items
                .GroupBy(t => t.kategori ?? "")
                .Select(g => new
                {
                    kategori = g.Key,
                    label = LabelOf(master, g.Key),
                    delta_prod = g.Sum(t => t.delta_prod ?? 0),
                    well_count = g.Count(),
                })
                .OrderBy(g => OrderOf(master, g.kategori))
                .ToList();

            var total_start = TotalProduction(start_date);
            var total_end = TotalProduction(end_date);
            var explained = categories.Sum(c => c.delta_prod);

            var breakdown = items
                .OrderBy(t => OrderOf(master, t.kategori))
                .ThenBy(t => t.well)
                .Select(t => new
                {
                    t._id,
                    t.kategori,
                    label = LabelOf(master, t.kategori),
                    t.well,
                    t.delta_prod,
                    t.remarks,
                })
                .ToList();

            return Ok(new
            {
                start_date = start_date,
                end_date = end_date,
                total_start = total_start,
                total_end = total_end,
                // selisih yang tidak dijelaskan kategori terpilih (mis. sumur lain
                // yang tidak dimasukkan ke breakdown)
                others = (total_end - total_start) - explained,
                categories = categories.Select(c => new
                {
                    c.kategori,
                    c.label,
                    c.delta_prod,
                    c.well_count,
                }),
                items = breakdown,
            });
        }

        // ------------------------------------------------------------------
        // GET: daftar sumur + delta otomatis dari daily (dipakai halaman add)
        // ------------------------------------------------------------------

        [Authorize("PeProdWaterfall Read")]
        [HttpGet("Wells")]
        public ActionResult GetWells(DateTime? start_date = null, DateTime? end_date = null)
        {
            if (!start_date.HasValue || !end_date.HasValue)
            {
                return Ok(new { items = new List<object>() });
            }

            var before = WellProduction(start_date);
            var after = WellProduction(end_date);
            var added = new HashSet<string>(
                _prod_waterfall.Find(PeriodFilter(start_date, end_date))
                    .ToList()
                    .Select(t => t.well ?? ""),
                StringComparer.OrdinalIgnoreCase);

            // Daftar sumur diambil dari seluruh data daily pada periode (bukan hanya
            // kedua tanggal batas), supaya sumur yang tidak punya data di tanggal
            // batas tetap muncul dan bisa dipilih.
            var wells = PeriodWells(start_date, end_date)
                .OrderBy(t => t, StringComparer.OrdinalIgnoreCase)
                .Select(w =>
                {
                    var b = before.ContainsKey(w) ? before[w] : 0m;
                    var a = after.ContainsKey(w) ? after[w] : 0m;
                    return new
                    {
                        well = w,
                        before = b,
                        after = a,
                        delta_prod = a - b,
                        added = added.Contains(w),
                    };
                })
                .ToList();

            return Ok(new { items = wells });
        }

        // ------------------------------------------------------------------
        // GET: master kategori
        // ------------------------------------------------------------------

        [Authorize("PeProdWaterfall Read")]
        [HttpGet("Kategori")]
        public ActionResult GetKategori()
        {
            return Ok(new { items = EnsureKategori() });
        }

        // ------------------------------------------------------------------
        // POST / PATCH / DELETE
        // ------------------------------------------------------------------

        [Authorize("PeProdWaterfall Add")]
        [HttpPost]
        public ActionResult Post([FromBody] ProdWaterfall[] items)
        {
            if (items == null || items.Length == 0)
                return BadRequest(new { message = "No items provided" });

            var created = 0;
            var skipped = new List<string>();

            // produksi per sumur dihitung sekali untuk seluruh item
            var before = WellProduction(items[0].start_date);
            var after = WellProduction(items[0].end_date);

            foreach (var item in items)
            {
                if (String.IsNullOrWhiteSpace(item.well))
                    continue;

                // satu sumur hanya boleh muncul sekali per periode
                var exists = _prod_waterfall.Find(
                    PeriodFilter(item.start_date, item.end_date) &
                    Builders<ProdWaterfall>.Filter.Eq(t => t.well, item.well)
                ).FirstOrDefault();

                if (exists != null)
                {
                    skipped.Add(item.well);
                    continue;
                }

                if (!item.delta_prod.HasValue)
                {
                    var b = before.ContainsKey(item.well) ? before[item.well] : 0m;
                    var a = after.ContainsKey(item.well) ? after[item.well] : 0m;
                    item.delta_prod = a - b;
                }

                item.created_by = User?.Identity?.Name;
                item.created_date = DateTime.Now;
                _prod_waterfall.InsertOne(item);
                created++;
            }

            return Ok(new { created_count = created, skipped = skipped });
        }

        [Authorize("PeProdWaterfall Edit")]
        [HttpPatch("{id}")]
        public ActionResult Patch(string id, [FromBody] ProdWaterfall item)
        {
            var filter = Builders<ProdWaterfall>.Filter.Eq(t => t._id, id);
            var existing = _prod_waterfall.Find(filter).FirstOrDefault();
            if (existing == null)
            {
                return NotFound(new { message = "Item not found" });
            }

            var update = Builders<ProdWaterfall>.Update
                .Set(t => t.kategori, item.kategori)
                .Set(t => t.well, item.well)
                .Set(t => t.delta_prod, item.delta_prod)
                .Set(t => t.remarks, item.remarks)
                .Set(t => t.updated_by, User?.Identity?.Name)
                .Set(t => t.updated_date, DateTime.Now);

            _prod_waterfall.UpdateOne(filter, update);

            return Ok(new { message = "Item updated successfully" });
        }

        [Authorize("PeProdWaterfall Delete")]
        [HttpDelete]
        public ActionResult Delete([Microsoft.AspNetCore.Mvc.FromBody] string[] _ids)
        {
            var id_values = BulkDelete.ToIdValues(_ids);
            var result = _prod_waterfall.DeleteMany(Builders<ProdWaterfall>.Filter.In("_id", id_values));
            return new JsonResult(new
            {
                deleted_count = result.DeletedCount
            })
            {
                StatusCode = StatusCodes.Status200OK
            };
        }

        // ------------------------------------------------------------------
        // Helper
        // ------------------------------------------------------------------

        /// <summary>Filter periode; tanggal yang tidak dikirim diabaikan.</summary>
        private static FilterDefinition<ProdWaterfall> PeriodFilter(DateTime? start, DateTime? end)
        {
            var filter = Builders<ProdWaterfall>.Filter.Ne("a", "b");
            if (start.HasValue) filter = filter & Builders<ProdWaterfall>.Filter.Eq(t => t.start_date, start);
            if (end.HasValue) filter = filter & Builders<ProdWaterfall>.Filter.Eq(t => t.end_date, end);
            return filter;
        }

        /// <summary>Total produksi net (BOPD) seluruh sumur pada satu tanggal.</summary>
        private decimal TotalProduction(DateTime? date)
        {
            if (!date.HasValue)
                return 0;

            return _daily.Find(r => r.date == date)
                .Project<Daily>(DailyCommon._fields_daily)
                .ToList()
                .Sum(t => t.fig_curr_net ?? 0);
        }

        /// <summary>Produksi net (BOPD) per sumur pada satu tanggal.</summary>
        private Dictionary<string, decimal> WellProduction(DateTime? date)
        {
            var result = new Dictionary<string, decimal>(StringComparer.OrdinalIgnoreCase);
            if (!date.HasValue)
                return result;

            var items = _daily.Find(r => r.date == date)
                .Project<Daily>(DailyCommon._fields_daily)
                .ToList();

            foreach (var item in items)
            {
                if (String.IsNullOrWhiteSpace(item.well))
                    continue;

                result[item.well] = result.ContainsKey(item.well)
                    ? result[item.well] + (item.fig_curr_net ?? 0)
                    : (item.fig_curr_net ?? 0);
            }

            return result;
        }

        /// <summary>
        /// Nama sumur yang ada di data daily pada rentang tanggal (inklusif).
        /// Dipakai sebagai daftar pilihan sumur pada halaman add.
        /// </summary>
        private List<string> PeriodWells(DateTime? start, DateTime? end)
        {
            if (!start.HasValue || !end.HasValue)
                return new List<string>();

            return _daily.Find(r => r.date >= start && r.date <= end)
                .Project<Daily>(DailyCommon._fields_daily)
                .ToList()
                .Where(t => !String.IsNullOrWhiteSpace(t.well))
                .Select(t => t.well)
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList();
        }

        /// <summary>Ambil kategori master; isi dengan kategori bawaan bila masih kosong.</summary>
        private List<ProdWaterfallKategori> EnsureKategori()
        {
            if (_kategori.CountDocuments(Builders<ProdWaterfallKategori>.Filter.Ne("a", "b")) == 0)
            {
                _kategori.InsertMany(DefaultKategori);
            }

            return _kategori.Find(Builders<ProdWaterfallKategori>.Filter.Ne("a", "b"))
                .SortBy(t => t.order)
                .ToList();
        }

        private static string LabelOf(List<ProdWaterfallKategori> master, string code)
        {
            var kategori = master.FirstOrDefault(k => k.code == code);
            if (kategori == null)
                return String.IsNullOrWhiteSpace(code) ? "(tanpa kategori)" : code;

            return kategori.code + ". " + kategori.name;
        }

        private static int OrderOf(List<ProdWaterfallKategori> master, string code)
        {
            var kategori = master.FirstOrDefault(k => k.code == code);
            return kategori == null ? int.MaxValue : kategori.order;
        }

        private ActionResult GetExcel(List<ProdWaterfall> items, DateTime? start_date, DateTime? end_date)
        {
            var master = EnsureKategori();
            var workbook = new ExcelPackage();
            var ws = workbook.Workbook.Worksheets.Add("Waterfall");

            ws.Cells[1, 1].Value = "Production Waterfall";
            ws.Cells[1, 1, 1, 5].Merge = true;
            ws.Cells[1, 1].Style.Font.Bold = true;
            ws.Cells[1, 1].Style.Font.Size = 14;

            ws.Cells[2, 1].Value = (start_date.HasValue ? start_date.Value.ToString("d-MMM-yy") : "-")
                + " - "
                + (end_date.HasValue ? end_date.Value.ToString("d-MMM-yy") : "-");
            ws.Cells[2, 1, 2, 5].Merge = true;

            string[] headers = { "No", "Kategori", "Sumur", "Delta Prod (BOPD)", "Remarks" };
            for (int i = 0; i < headers.Length; i++)
            {
                ws.Cells[4, i + 1].Value = headers[i];
            }

            // baris header kategori
            int row = 5;
            foreach (var group in items.GroupBy(t => t.kategori ?? "").OrderBy(g => OrderOf(master, g.Key)))
            {
                ws.Cells[row, 1].Value = LabelOf(master, group.Key);
                ws.Cells[row, 1, row, 5].Merge = true;
                ws.Cells[row, 1].Style.Font.Bold = true;
                row++;

                int no = 1;
                foreach (var item in group.OrderBy(t => t.well))
                {
                    ws.Cells[row, 1].Value = no++;
                    ws.Cells[row, 2].Value = LabelOf(master, item.kategori);
                    ws.Cells[row, 3].Value = item.well;
                    ws.Cells[row, 4].Value = item.delta_prod;
                    ws.Cells[row, 5].Value = item.remarks;
                    row++;
                }

                ws.Cells[row, 3].Value = "Total";
                ws.Cells[row, 4].Value = group.Sum(t => t.delta_prod ?? 0);
                ws.Cells[row, 3, row, 4].Style.Font.Bold = true;
                row++;
            }

            ws.Cells[4, 1, Math.Max(row - 1, 4), 5].Style.VerticalAlignment = ExcelVerticalAlignment.Top;
            ws.Cells[4, 1, 4, 5].Style.Font.Bold = true;
            ws.Cells[4, 1, 4, 5].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            ws.Cells[5, 4, Math.Max(row - 1, 5), 4].Style.Numberformat.Format = "#,###.0";
            ws.Column(1).Width = 6;
            ws.Column(2).Width = 34;
            ws.Column(3).Width = 16;
            ws.Column(4).Width = 18;
            ws.Column(5).Width = 50;

            var memoryStream = new MemoryStream(workbook.GetAsByteArray());
            memoryStream.Position = 0;
            return File(memoryStream, "application/vnd.ms-excel", "Waterfall.xlsx");
        }
    }
}
