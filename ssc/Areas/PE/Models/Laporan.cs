using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ssc.Areas.PE.Models
{
    public class LaporanLab
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        public decimal? nomor { get; set; }
        public DateTime? date { get; set; }
        public string well { get; set; }
        public decimal? sed { get; set; }
        public decimal? water { get; set; }
        public decimal? sludge { get; set; }
        public decimal? total { get; set; }
        public string api { get; set; }
        public decimal? sg { get; set; }
        public decimal? density_obs { get; set; }
        public decimal? density_dua { get; set; }
        public string pp { get; set; }
        public decimal? temperature { get; set; }
        public decimal? visc { get; set; }
        public string cl { get; set; }
        public decimal? rw { get; set; }
        public string keterangan { get; set; }
        public string created_by { get; set; }
        public DateTime? created_date { get; set; }
        public string updated_by { get; set; }
        public DateTime? updated_date { get; set; }
        public LaporanLabError _error { get; set; }
    }

    public class LaporanLabError
    {
        public ErrorItem _row { get; set; }
        public ErrorItem _id { get; set; }
        public ErrorItem nomor { get; set; }
        public ErrorItem date { get; set; }
        public ErrorItem well { get; set; }
        public ErrorItem sed { get; set; }
        public ErrorItem water { get; set; }
        public ErrorItem sludge { get; set; }
        public ErrorItem total { get; set; }
        public ErrorItem api { get; set; }
        public ErrorItem sg { get; set; }
        public ErrorItem density_obs { get; set; }
        public ErrorItem density_dua { get; set; }
        public ErrorItem pp { get; set; }
        public ErrorItem temperature { get; set; }
        public ErrorItem visc { get; set; }
        public ErrorItem cl { get; set; }
        public ErrorItem rw { get; set; }
        public ErrorItem keterangan { get; set; }
    }

    public class LaporanLabList
    {

        public Object[] _id { get; set; }
        public Object[] nomor { get; set; }
        public Object[] date { get; set; }
        public Object[] well { get; set; }
        public Object[] sed { get; set; }
        public Object[] water { get; set; }
        public Object[] sludge { get; set; }
        public Object[] total { get; set; }
        public Object[] api { get; set; }
        public Object[] sg { get; set; }
        public Object[] density_obs { get; set; }
        public Object[] density_dua { get; set; }
        public Object[] pp { get; set; }
        public Object[] temperature { get; set; }
        public Object[] visc { get; set; }
        public Object[] cl { get; set; }
        public Object[] rw { get; set; }
        public Object[] keterangan { get; set; }
    }

    public class LaporanLabTmp
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        public int error_count { get; set; }
        public LaporanLab[] items { get; set; }
    }


}

