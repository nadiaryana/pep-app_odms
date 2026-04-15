using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ssc.Areas.PE.Models
{
    public class PumpingUnit
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        // public DateTime? date { get; set; }
        public string nomor { get; set; }
        public string well { get; set; }
        public string status { get; set; }
        public string primemover { get; set; }
        public string merk { get; set; }
        public string tipe { get; set; }
        public string noted { get; set; }
        public string created_by { get; set; }
        public DateTime? created_date { get; set; }
        public string updated_by { get; set; }
        public DateTime? updated_date { get; set; }
        public PumpingUnitError _error { get; set; }
    }

    public class PumpingUnitError
    {
        public ErrorItem _row { get; set; }
        // public ErrorItem date { get; set; }

        public ErrorItem nomor { get; set; }
        public ErrorItem well { get; set; }
        public ErrorItem status { get; set; }
        public ErrorItem primemover { get; set; }
        public ErrorItem merk { get; set; }
        public ErrorItem tipe { get; set; }
        public ErrorItem noted { get; set; }
    }

    public class PumpingUnitList
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public Object[] _id { get; set; }
        // public Object[] date { get; set; }
        public Object[] nomor { get; set; }
        public Object[] well { get; set; }
        public Object[] status { get; set; }
        public Object[] primemover { get; set; }
        public Object[] merk { get; set; }
        public Object[] tipe { get; set; }
        public Object[] noted { get; set; }
    }

    public class PumpingUnitTmp
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        public int error_count { get; set; }
        public PumpingUnit[] items { get; set; }
    }
}
