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
        public string Id { get; set; }
        public string WellName { get; set; }   // Nama sumur
        public double Current { get; set; }    // Nilai arus
        public DateTime Timestamp { get; set; } // Waktu dari ThingSpeak
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
