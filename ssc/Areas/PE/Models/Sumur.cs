using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ssc.Areas.PE.Models
{
    public class Sumur
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        // public string Id { get; set; }
        public string _id { get; set; }
        public DateTime Timestamp { get; set; } // Waktu dari ThingSpeak
        public DateTime? date { get; set; }
        public string WellName { get; set; }   // Nama sumur

        public double Current { get; set; }    // Nilai arus
        public decimal? entry_id { get; set; }
        public decimal? field_1 { get; set; }
        public decimal? field_2 { get; set; }

        public string created_by { get; set; }
        public DateTime? created_date { get; set; }
        public string updated_by { get; set; }
        public DateTime? updated_date { get; set; }
        public SumurError _error { get; set; }



    }

    public class SumurError
    {
        public ErrorItem _row { get; set; }
        public ErrorItem date { get; set; }
        public ErrorItem wellName { get; set; }
        public ErrorItem entry_id { get; set; }
        public ErrorItem field_1 { get; set; }
        public ErrorItem field_2 { get; set; }
    }

    public class SumurList
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public Object[] _id { get; set; }
        public Object[] date { get; set; }
        public Object[] wellName { get; set; }
        public Object[] entry_id { get; set; }
        public Object[] field_1 { get; set; }
        public Object[] field_2 { get; set; }
    }

    public class SumurTmp
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        public int error_count { get; set; }
        public Sumur[] items { get; set; }
    }
}
