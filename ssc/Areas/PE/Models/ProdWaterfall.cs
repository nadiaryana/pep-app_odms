using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ssc.Areas.PE.Models
{
    /// <summary>
    /// Satu baris breakdown pada Production Waterfall.
    ///
    /// Setiap baris mewakili satu sumur pada satu periode (start_date - end_date)
    /// dan tergabung pada satu kategori (mis. "A. ARLIFT ISSUES AND FLUCTUATION").
    /// start_date/end_date menyimpan rentang Periode 1. Rentang Periode 2 disimpan
    /// terpisah; delta_prod adalah selisih rata-rata net Periode 2 dan Periode 1.
    /// </summary>
    public class ProdWaterfall
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }

        /// <summary>Tanggal awal periode (inklusif).</summary>
        public DateTime? start_date { get; set; }

        /// <summary>Tanggal akhir periode (inklusif).</summary>
        public DateTime? end_date { get; set; }

        /// <summary>Tanggal awal Periode 2 (inklusif).</summary>
        public DateTime? period2_start_date { get; set; }

        /// <summary>Tanggal akhir Periode 2 (inklusif).</summary>
        public DateTime? period2_end_date { get; set; }

        /// <summary>Kode kategori master (lihat koleksi prod_waterfall_kategori).</summary>
        public string kategori { get; set; }

        public string well { get; set; }

        /// <summary>Selisih rata-rata net Periode 2 dan Periode 1 (BOPD).</summary>
        public decimal? delta_prod { get; set; }

        public string remarks { get; set; }

        public string created_by { get; set; }
        public DateTime? created_date { get; set; }
        public string updated_by { get; set; }
        public DateTime? updated_date { get; set; }
    }

    /// <summary>Dipakai untuk deserialisasi parameter columnfilter dari halaman list.</summary>
    public class ProdWaterfallList
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public Object[] _id { get; set; }
        public Object[] kategori { get; set; }
        public Object[] well { get; set; }
        public Object[] delta_prod { get; set; }
        public Object[] remarks { get; set; }
    }

    /// <summary>
    /// Master kategori waterfall. Baris pada koleksi prod_waterfall mengacu ke
    /// field code di sini, sehingga nama kategori dapat diubah tanpa menyentuh
    /// data transaksi.
    /// </summary>
    public class ProdWaterfallKategori
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }

        public string code { get; set; }
        public string name { get; set; }
        public int order { get; set; }
    }
}
