using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ssc.Areas.PE.Models
{
    public class ArusReading
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("well_id")]
        public string WellId { get; set; }

        [BsonElement("current")]
        public float Current { get; set; }

        [BsonElement("status")]
        public int Status { get; set; }

        [BsonElement("recorded_at")]
        public string RecordedAt { get; set; }

        [BsonElement("created_at")]
        public DateTime? CreatedAt { get; set; }
    }
}