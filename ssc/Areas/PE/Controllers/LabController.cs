using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;
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
    public class LabController : ControllerBase
    {
        private IMongoDatabase database;
        private readonly IMongoCollection<Lab> _lab;
        private readonly IMongoCollection<LabTmp> _lab_tmp;
        private ProjectionDefinition<Lab> _fields;


        public LabController(IPEDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            database = client.GetDatabase("pe");

            _lab = database.GetCollection<Lab>("lab");
            _lab_tmp = database.GetCollection<LabTmp>("lab_tmp");
            _fields = Builders<Lab>.Projection
                .Include(t => t.nomor)
                .Include(t => t._id)
                .Include(t => t.nama_alat)
                .Include(t => t.spesifikasi)
                .Include(t => t.satuan)
                .Include(t => t.kegunaan)
                .Include(t => t.baru)
                .Include(t => t.lama)
                .Include(t => t.rusak)
                .Include(t => t.stok_awal)
                .Include(t => t.barang_masuk)
                .Include(t => t.barang_keluar)
                .Include(t => t.stok_akhir)
                .Include(t => t.keterangan);
        }

        [Authorize("PeLab Read")]
        [HttpGet]
        public ActionResult Get(String sort = "nomor", String order = "desc", int page = 0, int pagesize = 50, String filter = "", String columnfilter = "", string mode = "")
        {

            //var _items = _tickets.Find(t => true);
            FilterDefinition<Lab> xfilter = Builders<Lab>.Filter.Ne("a", "b");
            FilterDefinition<Lab> xcolfilter;

            if (!String.IsNullOrWhiteSpace(filter))
            {
                filter = filter.ToLower();
                xfilter =
                    Builders<Lab>.Filter.Regex(t => t.nomor, new BsonRegularExpression(filter, "i")) |
                    Builders<Lab>.Filter.Regex(t => t._id, new BsonRegularExpression(filter, "i")) |
                    Builders<Lab>.Filter.Regex(t => t.nama_alat, new BsonRegularExpression(filter, "i")) |
                    Builders<Lab>.Filter.Regex(t => t.spesifikasi, new BsonRegularExpression(filter, "i")) |
                    Builders<Lab>.Filter.Regex(t => t.satuan, new BsonRegularExpression(filter, "i")) |
                    Builders<Lab>.Filter.Regex(t => t.kegunaan, new BsonRegularExpression(filter, "i")) |
                    Builders<Lab>.Filter.Regex(t => t.baru, new BsonRegularExpression(filter, "i")) |
                    Builders<Lab>.Filter.Regex(t => t.lama, new BsonRegularExpression(filter, "i")) |
                    Builders<Lab>.Filter.Regex(t => t.rusak, new BsonRegularExpression(filter, "i")) |
                    Builders<Lab>.Filter.Regex(t => t.barang_masuk, new BsonRegularExpression(filter, "i")) |
                    Builders<Lab>.Filter.Regex(t => t.stok_awal, new BsonRegularExpression(filter, "i")) |
                    Builders<Lab>.Filter.Regex(t => t.stok_akhir, new BsonRegularExpression(filter, "i")) |
                    Builders<Lab>.Filter.Regex(t => t.barang_keluar, new BsonRegularExpression(filter, "i")) |
                    Builders<Lab>.Filter.Regex(t => t.keterangan, new BsonRegularExpression(filter, "i"));
            }

            if (!String.IsNullOrWhiteSpace(columnfilter))
            {
                xcolfilter = Builders<Lab>.Filter.Ne("a", "b");
                LabList colfilter = JsonConvert.DeserializeObject<LabList>(columnfilter);

                if (colfilter.nomor?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Lab>.Filter.Or(colfilter.nomor.ToList().Where(c => !(c is JObject)).Select(c => Builders<Lab>.Filter.Regex(t => t.nomor, new BsonRegularExpression((string)c, "i"))));
                // if (colfilter._id?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Lab>.Filter.Or(colfilter._id.ToList().Where(c => !(c is JObject)).Select(c => Builders<Lab>.Filter.Regex(t => t._id, new BsonRegularExpression((string)c, "i"))));
                if (colfilter._id?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Lab>.Filter.Or(colfilter._id.ToList().Where(c => !(c is JObject)).Select(c => Builders<Lab>.Filter.Regex(t => t._id, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.nama_alat?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Lab>.Filter.Or(colfilter.nama_alat.ToList().Where(c => !(c is JObject)).Select(c => Builders<Lab>.Filter.Regex(t => t.nama_alat, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.spesifikasi?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Lab>.Filter.Or(colfilter.spesifikasi.ToList().Where(c => !(c is JObject)).Select(c => Builders<Lab>.Filter.Regex(t => t.spesifikasi, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.satuan?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Lab>.Filter.Or(colfilter.satuan.ToList().Where(c => !(c is JObject)).Select(c => Builders<Lab>.Filter.Regex(t => t.satuan, new BsonRegularExpression((string)c, "i"))));
                if (colfilter.kegunaan?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Lab>.Filter.Or(colfilter.satuan.ToList().Where(c => !(c is JObject)).Select(c => Builders<Lab>.Filter.Regex(t => t.satuan, new BsonRegularExpression((string)c, "i"))));

                if (colfilter.baru?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Lab>.Filter.Or(colfilter.baru.ToList().Where(c => !(c is JObject)).Select(c => Builders<Lab>.Filter.Eq(t => t.baru, Convert.ToDecimal(c))));
                if (colfilter.lama?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Lab>.Filter.Or(colfilter.lama.ToList().Where(c => !(c is JObject)).Select(c => Builders<Lab>.Filter.Eq(t => t.lama, Convert.ToDecimal(c))));
                if (colfilter.rusak?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Lab>.Filter.Or(colfilter.rusak.ToList().Where(c => !(c is JObject)).Select(c => Builders<Lab>.Filter.Eq(t => t.rusak, Convert.ToDecimal(c))));
                if (colfilter.stok_awal?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Lab>.Filter.Or(colfilter.stok_awal.ToList().Where(c => !(c is JObject)).Select(c => Builders<Lab>.Filter.Eq(t => t.stok_awal, Convert.ToDecimal(c))));
                if (colfilter.barang_masuk?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Lab>.Filter.Or(colfilter.barang_masuk.ToList().Where(c => !(c is JObject)).Select(c => Builders<Lab>.Filter.Eq(t => t.barang_masuk, Convert.ToDecimal(c))));
                if (colfilter.barang_keluar?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Lab>.Filter.Or(colfilter.barang_keluar.ToList().Where(c => !(c is JObject)).Select(c => Builders<Lab>.Filter.Eq(t => t.barang_keluar, Convert.ToDecimal(c))));
                if (colfilter.stok_akhir?.ToList().Count(c => !(c is JObject)) > 0) xcolfilter = xcolfilter & Builders<Lab>.Filter.Or(colfilter.stok_akhir.ToList().Where(c => !(c is JObject)).Select(c => Builders<Lab>.Filter.Eq(t => t.stok_akhir, Convert.ToDecimal(c))));


                foreach (string log in DailyCommon._logical)
                {
                    if (colfilter.nomor?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.nomor.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$nomor\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    // if (colfilter._id?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter._id.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$_id\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter._id?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter._id.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$_id\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.nama_alat?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.nama_alat.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$nama_alat\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.spesifikasi?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.spesifikasi.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$spesifikasi\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.satuan?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.satuan.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$satuan\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    if (colfilter.kegunaan?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.kegunaan.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$kegunaan\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                    // if (colfilter.meas_depth?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.meas_depth.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$meas_depth\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.baru?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.baru.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$baru\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.lama?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.lama.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$lama\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.rusak?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.rusak.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$rusak\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.stok_awal?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.stok_awal.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$stok_awal\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.barang_masuk?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.barang_masuk.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$barang_masuk\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.barang_keluar?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.barang_keluar.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$barang_keluar\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.stok_akhir?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.stok_akhir.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{${0}:[{{$toDecimal:\"$stok_akhir\"}},{1}]}}", ((JObject)c).GetValue("opr"), ((JObject)c).GetValue("val"))).ToArray()), log);
                    if (colfilter.keterangan?.ToList().Count(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log) > 0) xcolfilter = xcolfilter & String.Format("{{$expr:{{$and:[{{${1}:[{0}]}}]}}}}", String.Join(",", colfilter.keterangan.ToList().Where(c => (c is JObject) && ((JObject)c).GetValue("log").ToString() == log).Select(c => String.Format("{{$regexMatch:{{input:\"$keterangan\",regex:\"{0}\",options:\"i\"}}}}", DailyCommon.TextPattern(((JObject)c).GetValue("opr").ToString(), ((JObject)c).GetValue("val").ToString()))).ToArray()), log);
                }

                xfilter = xfilter & xcolfilter;
            }

            var _items = _lab.Find(xfilter, new FindOptions() { Collation = new Collation("en_US", numericOrdering: true) });
            var total_count = _items.CountDocuments();

            switch (sort)
            {
                case "nomor": _items = (order == "asc") ? _items.SortBy(t => t.nomor) : _items.SortByDescending(t => t.nomor); break;
                case "_id": _items = (order == "asc") ? _items.SortBy(t => t._id) : _items.SortByDescending(t => t._id); break;
                case "nama_alat": _items = (order == "asc") ? _items.SortBy(t => t.nama_alat) : _items.SortByDescending(t => t.nama_alat); break;
                case "spesifikasi": _items = (order == "asc") ? _items.SortBy(t => t.spesifikasi) : _items.SortByDescending(t => t.spesifikasi); break;
                case "satuan": _items = (order == "asc") ? _items.SortBy(t => t.satuan) : _items.SortByDescending(t => t.satuan); break;
                case "kegunaan": _items = (order == "asc") ? _items.SortBy(t => t.kegunaan) : _items.SortByDescending(t => t.kegunaan); break;
                case "baru": _items = (order == "asc") ? _items.SortBy(t => t.baru) : _items.SortByDescending(t => t.baru); break;
                case "lama": _items = (order == "asc") ? _items.SortBy(t => t.lama) : _items.SortByDescending(t => t.lama); break;
                case "rusak": _items = (order == "asc") ? _items.SortBy(t => t.rusak) : _items.SortByDescending(t => t.rusak); break;
                case "stok_awal": _items = (order == "asc") ? _items.SortBy(t => t.stok_awal) : _items.SortByDescending(t => t.stok_awal); break;
                case "barang_masuk": _items = (order == "asc") ? _items.SortBy(t => t.barang_masuk) : _items.SortByDescending(t => t.barang_masuk); break;
                case "barang_keluar": _items = (order == "asc") ? _items.SortBy(t => t.barang_keluar) : _items.SortByDescending(t => t.barang_keluar); break;
                case "stok_akhir": _items = (order == "asc") ? _items.SortBy(t => t.stok_akhir) : _items.SortByDescending(t => t.stok_akhir); break;
                case "keterangan": _items = (order == "asc") ? _items.SortBy(t => t.keterangan) : _items.SortByDescending(t => t.keterangan); break;
            }

            switch (mode)
            {
                case "":
                case null:
                    List<Lab> items = _items
                    .Skip(page * pagesize)
                    .Limit(pagesize)
                    .Project<Lab>(_fields).ToList();

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
                    .Project<Lab>(_fields).ToList());

                default:
                    dynamic res;
                    switch (mode)
                    {
                        case "_id":
                        case "nama_alat":
                        case "spesifikasi":
                        case "satuan":
                        case "kegunaan":
                        case "keterangan":
                            res = _lab.Distinct<string>(mode, xfilter).ToEnumerable().Where(t => t != null).OrderBy(t => t).ToList();
                            break;
                        case "nomor":
                        case "baru":
                        case "lama":
                        case "rusak":
                        case "stok_awal":
                        case "barang_masuk":
                        case "barang_keluar":
                        case "stok_akhir":
                            res = _lab.Distinct<decimal?>(mode, xfilter).ToEnumerable().OrderBy(t => t).ToList();
                            break;
                        default:
                            res = _lab.Distinct<string>(mode, xfilter).ToEnumerable().Where(t => t != null).OrderBy(t => t).ToList();
                            break;
                    }

                    return new JsonResult(new
                    {
                        //total_count = res.Count(),
                        items = res,
                    });
            }

        }

        private string ReplaceMonth(string str)
        {
            str = str.ToLower();
            for (var m = 1; m <= 12; m++)
            {
                string monthName = CultureInfo.CurrentCulture.DateTimeFormat.GetAbbreviatedMonthName(m).ToLower();
                if (str.IndexOf(monthName) != -1 && str.Trim() != monthName)
                {
                    str = str.Replace(monthName, m.ToString().PadLeft(2, '0'));
                    break;
                }
            }
            return str;
        }

        public ActionResult GetExcel(List<Lab> items)
        {
            var workbook = new ExcelPackage();
            var ws = workbook.Workbook.Worksheets.Add("Lab");
            ws.Cells[1, 1].Value = "Nomor";
            ws.Cells[1, 2].Value = "ID";
            ws.Cells[1, 3].Value = "Nama Alat";
            ws.Cells[1, 4].Value = "Spesifikasi";
            ws.Cells[1, 5].Value = "Satuan";
            ws.Cells[1, 6].Value = "Kegunaan";
            ws.Cells[1, 7].Value = "Baru";
            ws.Cells[1, 8].Value = "Lama";
            ws.Cells[1, 9].Value = "Rusak";
            ws.Cells[1, 10].Value = "Stok Awal";
            ws.Cells[1, 11].Value = "Barang Masuk";
            ws.Cells[1, 12].Value = "Barang Keluar";
            ws.Cells[1, 13].Value = "Stok Akhir";
            ws.Cells[1, 14].Value = "Keterangan";


            ws.Cells[1, 1, 1, 14].Style.Font.Bold = true;
            ws.Cells[1, 1, 1, 14].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            ws.Cells[1, 1, 1, 14].Style.VerticalAlignment = ExcelVerticalAlignment.Top;

            for (int c = 1; c <= 14; c++)
            {
                //ws.Column(c).AutoFit();
            }

            for (int i = 0; i < items.Count(); i++)
            {
                var t = items.ElementAt(i);
                // ws.Cells[2 + i, 1].Style.Numberformat.Format = "d-MMM-yy";
                ws.Cells[2 + i, 1].Value = t.nomor;
                ws.Cells[2 + i, 2].Value = t._id;
                ws.Cells[2 + i, 3].Value = t.nama_alat;
                ws.Cells[2 + i, 4].Value = t.spesifikasi;
                ws.Cells[2 + i, 5].Value = t.satuan;
                ws.Cells[2 + i, 6].Value = t.kegunaan;
                ws.Cells[2 + i, 7].Value = t.baru;
                ws.Cells[2 + i, 8].Value = t.lama;
                ws.Cells[2 + i, 9].Value = t.rusak;
                ws.Cells[2 + i, 10].Value = t.stok_awal;
                ws.Cells[2 + i, 11].Value = t.barang_masuk;
                ws.Cells[2 + i, 12].Value = t.barang_keluar;
                ws.Cells[2 + i, 13].Value = t.stok_akhir;
                ws.Cells[2 + i, 14].Value = t.keterangan;
            }

            MemoryStream memoryStream = new MemoryStream(workbook.GetAsByteArray());
            memoryStream.Position = 0;
            return File(memoryStream, "application/vnd.ms-excel", "BHP.xlsx");
        }

        [Authorize("PeLab Add")]
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

            List<Lab> items = new List<Lab>();
            int error_count = 0;

            for (var r = 5; r <= rowCount; r++)
            {
                if (!string.IsNullOrWhiteSpace(ws.Cells[r, 3].Value?.ToString()))
                {
                    Lab _row = new Lab();
                    LabError _row_error = new LabError();
                    int last_error_count = error_count;

                    var stringMappings = new[]
                    {
                        new { key = "_id", col = 3, required = true, errorMsg = "ID wajib diisi"},
                        new { key = "nama_alat", col = 4, required = true, errorMsg = "" },
                        new { key = "spesifikasi", col = 5, required = false, errorMsg = "" },
                        new { key = "satuan", col = 6, required = false, errorMsg = "" },
                        new { key = "kegunaan", col = 7, required = false, errorMsg = "" },
                        new { key = "keterangan", col = 15, required = false, errorMsg = "" },
                    };

                    foreach (var mapping in stringMappings)
                    {
                        var rawValue = ws.Cells[r, mapping.col].Value;
                        var strValue = rawValue?.ToString().Trim();

                        var prop = typeof(Lab).GetProperty(mapping.key);
                        var errorProp = typeof(LabError).GetProperty(mapping.key);

                        if (!string.IsNullOrWhiteSpace(strValue))
                        {
                            prop?.SetValue(_row, strValue);
                        }
                        else
                        {
                            if (mapping.required)
                            {
                                errorProp?.SetValue(_row_error, new ErrorItem { value = "(Blank)", message = mapping.errorMsg });
                                error_count++;
                            }
                            prop?.SetValue(_row, null);
                        }
                    }

                    // decimal mappings
                    // Column indexes based on the provided Excel structure
                    var mappings = new[]
                    {

                        new { key = "nomor", col = 2 },
                        new { key = "baru", col = 8 },
                        new { key = "lama", col = 9 },
                        new { key = "rusak", col = 10 },
                        new { key = "stok_awal", col = 11 },
                        new { key = "barang_masuk", col = 12 },
                        new { key = "barang_keluar", col = 13 },
                        new { key = "stok_akhir", col = 14 },
                    };

                    foreach (var mapping in mappings)
                    {
                        var rawValue = ws.Cells[r, mapping.col].Value;

                        // If empty → null
                        if (rawValue == null)
                        {
                            typeof(Lab).GetProperty(mapping.key)?.SetValue(_row, null);
                            continue;
                        }

                        string strValue = rawValue.ToString().Trim();
                        decimal num;
                        bool parsed = false;

                        // Excel stores most numbers as double
                        if (rawValue is double dbl)
                        {
                            num = Convert.ToDecimal(dbl);
                            parsed = true;
                        }
                        else if (rawValue is int itg)
                        {
                            num = Convert.ToDecimal(itg);
                            parsed = true;
                        }
                        else
                        {
                            // Last fallback: parse string
                            parsed = decimal.TryParse(strValue, out num);
                        }

                        if (parsed)
                        {
                            typeof(Lab).GetProperty(mapping.key)?.SetValue(_row, num);
                        }
                        else
                        {
                            typeof(Lab).GetProperty(mapping.key)?.SetValue(_row, null);

                            typeof(LabError).GetProperty(mapping.key)?.SetValue(
                                _row_error,
                                new ErrorItem
                                {
                                    value = strValue,
                                    message = "Invalid number"
                                }
                            );

                            error_count++;
                        }
                    }

                    decimal baru = _row.baru ?? 0;
                    decimal lama = _row.lama ?? 0;
                    decimal rusak = _row.rusak ?? 0;
                    decimal masuk = _row.barang_masuk ?? 0;
                    decimal keluar = _row.barang_keluar ?? 0;

                    // stok_awal
                    _row.stok_awal = baru + lama + rusak;

                    // stok_akhir 
                    _row.stok_akhir = _row.stok_awal + masuk - keluar;


                    if (error_count > last_error_count)
                    {
                        _row_error._row = new ErrorItem { value = "error", message = "Error found" };
                    }

                    _row._error = _row_error;

                    items.Add(_row);
                }
            }

            LabTmp _tmp = new LabTmp
            {
                error_count = error_count,
                items = items.ToArray()
            };
            _lab_tmp.InsertOne(_tmp);

            return Ok(new
            {
                _id = _tmp._id,
                //items = items,
                error_count = error_count
            });
        }

        [Authorize("PeLab Add")]
        [HttpGet("Tmp")]
        public ActionResult GetTmp(string _id, String sort = "date", String order = "desc", int page = 0, int pagesize = 50, String filter = "", String columnfilter = "", string mode = "")
        {
            LabTmp _tmp = _lab_tmp.Find(t => t._id == _id).FirstOrDefault();
            List<Lab> _tmpitems = _tmp.items.ToList();
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
                List<Lab> items = _tmpitems.ToList().GetRange(page * pagesize, pagesize);
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

        [Authorize("PeLab Add")]
        [HttpGet("SaveData")]
        public ActionResult SaveData(string _id)
        {
            try
            {
                LabTmp _tmp = _lab_tmp.Find(t => t._id == _id).FirstOrDefault();

                if (_tmp == null || _tmp.error_count > 0)
                {
                    throw new Exception();
                }

                List<Lab> items = _tmp.items.ToList();

                // DateTime? min_date = items.Select(m => m.date).Min();
                // string[] wells = items.Select(m => m.well).ToArray();

                long modified_count = 0;
                long created_count = items.Count();

                foreach (Lab item in items)
                {
                    item._error = null;

                    var update = Builders<Lab>.Update.Set(t => t.nomor, item.nomor)
                        .Set(t => t._id, item._id)
                        .Set(t => t.nama_alat, item.nama_alat)
                        .Set(t => t.spesifikasi, item.spesifikasi)
                        .Set(t => t.satuan, item.satuan)
                        .Set(t => t.kegunaan, item.kegunaan)
                        .Set(t => t.baru, item.baru)
                        .Set(t => t.lama, item.lama)
                        .Set(t => t.rusak, item.rusak)
                        .Set(t => t.stok_awal, item.stok_awal)
                        .Set(t => t.barang_masuk, item.barang_masuk)
                        .Set(t => t.barang_keluar, item.barang_keluar)
                        .Set(t => t.stok_akhir, item.stok_akhir)
                        .Set(t => t.keterangan, item.keterangan)
                        .Set(t => t.updated_by, User.Identity.Name)
                        .Set(t => t.updated_date, DateTime.Now)
                        .SetOnInsert(t => t.created_by, User.Identity.Name)
                        .SetOnInsert(t => t.created_date, DateTime.Now);

                    UpdateResult res = _lab.UpdateOne(
                        Builders<Lab>.Filter.Eq(t => t._id, item._id),
                        update, new UpdateOptions() { IsUpsert = true });

                    modified_count += res.ModifiedCount;
                    created_count -= res.ModifiedCount;
                }
                _lab_tmp.DeleteOne(d => d._id == _id);

                // modified_count += DailyCommon.RecalculateFields(min_date, wells, User.Identity.Name);

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

        [Authorize("PeLab Add")]
        [HttpPatch("{id}")]
        public IActionResult Update(string id, [FromBody] Lab payload)
        {
            if (payload == null)
                return BadRequest();

            var update = Builders<Lab>.Update
                .Set(t => t.nomor, payload.nomor)
                .Set(t => t.nama_alat, payload.nama_alat)
                .Set(t => t.spesifikasi, payload.spesifikasi)
                .Set(t => t.satuan, payload.satuan)
                .Set(t => t.kegunaan, payload.kegunaan)
                .Set(t => t.baru, payload.baru)
                .Set(t => t.lama, payload.lama)
                .Set(t => t.rusak, payload.rusak)
                .Set(t => t.stok_awal, payload.stok_awal)
                .Set(t => t.barang_masuk, payload.barang_masuk)
                .Set(t => t.barang_keluar, payload.barang_keluar)
                .Set(t => t.stok_akhir, payload.stok_akhir)
                .Set(t => t.keterangan, payload.keterangan)
                .Set(t => t.updated_by, User.Identity.Name)
                .Set(t => t.updated_date, DateTime.Now);

            var result = _lab.UpdateOne(
                Builders<Lab>.Filter.Eq(t => t._id, id),
                update
            );

            if (result.MatchedCount == 0)
                return NotFound();

            return Ok(new
            {
                modified_count = result.ModifiedCount
            });
        }


        [Authorize("PeLab Delete")]
        [HttpDelete]
        public ActionResult Delete(string[] _ids)
        {
            try
            {
                long deleted_count = 0;
                long total_count = _ids.Length;
                foreach (string _id in _ids)
                {
                    DeleteResult res = _lab.DeleteOne(t => t._id == _id);
                    deleted_count += res.DeletedCount;
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

        // [Authorize("PeLab Read")]
        // [HttpGet]
        // private ActionResult Data_Lab()
        // {
        // switch (type)
        // {
        //     case "lab_chart":

        //         // var startLocal = TimeZoneInfo.ConvertTimeFromUtc(start.Value, TimeZoneInfo.Local);
        //         // var endLocal = TimeZoneInfo.ConvertTimeFromUtc(end.Value, TimeZoneInfo.Local);

        //         var lab = _lab.Find(
        //             r => well.Contains(r.well) &&
        //             r.date >= start && r.date <= end
        //         ).Project<Lab>(_fields).ToList().OrderBy(t => t.date).Select(s => new
        //         {
        //             date = System.TimeZoneInfo.ConvertTimeFromUtc(s.date.Value, System.TimeZoneInfo.Local),
        //             well = s.well,
        //             pmax = s.pmax,
        //             tmax = s.tmax,

        //         });

        //         return Ok(new { items = lab });

        //     default:
        //         return Ok(new { });
        // }
        // }

    }
}
