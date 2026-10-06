using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ssc.Areas.PE.Models
{
    public class ProdWaterfall
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        // public DateTime? date { get; set; }
        public string nomor { get; set; }
        public string well { get; set; }
        public decimal? delta_prod { get; set; }

        public string remarks { get; set; }
        public string created_by { get; set; }
        public DateTime? created_date { get; set; }
        public string updated_by { get; set; }
        public DateTime? updated_date { get; set; }
        public ProdWaterfallError _error { get; set; }
    }

    public class ProdWaterfallError
    {
        public ErrorItem _row { get; set; }
        // public ErrorItem date { get; set; }

        public ErrorItem nomor { get; set; }
        public ErrorItem well { get; set; }
        public ErrorItem delta_prod { get; set; }
        public ErrorItem remarks { get; set; }
    }

    public class ProdWaterfallList
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public Object[] _id { get; set; }
        // public Object[] date { get; set; }
        public Object[] nomor { get; set; }
        public Object[] well { get; set; }
        public Object[] delta_prod { get; set; }
        public Object[] remarks { get; set; }
    }

    public class ProdWaterfallTmp
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        public int error_count { get; set; }
        public PumpingUnit[] items { get; set; }
    }
}
