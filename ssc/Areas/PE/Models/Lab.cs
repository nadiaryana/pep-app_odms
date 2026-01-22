using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ssc.Areas.PE.Models
{
    public class Lab
    {
        [BsonId]
        public string _id { get; set; }
        public decimal? nomor { get; set; }
        public string nama_alat { get; set; }
        public string spesifikasi { get; set; }
        public string satuan { get; set; }
        public string kegunaan { get; set; }
        public decimal? baru { get; set; }
        public decimal? lama { get; set; }
        public decimal? rusak { get; set; }
        public decimal? stok_awal { get; set; }
        public decimal? barang_masuk { get; set; }
        public decimal? barang_keluar { get; set; }
        public decimal? stok_akhir { get; set; }
        public string keterangan { get; set; }
        public string created_by { get; set; }
        public DateTime? created_date { get; set; }
        public string updated_by { get; set; }
        public DateTime? updated_date { get; set; }
        public LabError _error { get; set; }
    }

    public class LabError
    {
        public ErrorItem _row { get; set; }
        public ErrorItem _id { get; set; }
        public ErrorItem nomor { get; set; }
        public ErrorItem nama_alat { get; set; }
        public ErrorItem spesifikasi { get; set; }
        public ErrorItem satuan { get; set; }
        public ErrorItem kegunaan { get; set; }
        public ErrorItem baru { get; set; }
        public ErrorItem lama { get; set; }
        public ErrorItem rusak { get; set; }
        public ErrorItem stok_awal { get; set; }
        public ErrorItem barang_masuk { get; set; }
        public ErrorItem barang_keluar { get; set; }
        public ErrorItem stok_akhir { get; set; }
        public ErrorItem keterangan { get; set; }
    }

    public class LabList
    {

        public Object[] _id { get; set; }
        public Object[] nomor { get; set; }
        public Object[] nama_alat { get; set; }
        public Object[] spesifikasi { get; set; }
        public Object[] satuan { get; set; }
        public Object[] kegunaan { get; set; }
        public Object[] baru { get; set; }
        public Object[] lama { get; set; }
        public Object[] rusak { get; set; }
        public Object[] stok_awal { get; set; }
        public Object[] barang_masuk { get; set; }
        public Object[] barang_keluar { get; set; }
        public Object[] stok_akhir { get; set; }
        public Object[] keterangan { get; set; }
    }

    public class LabTmp
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        public int error_count { get; set; }
        public Lab[] items { get; set; }
    }
}
