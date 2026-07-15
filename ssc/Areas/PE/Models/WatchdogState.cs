using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ssc.Areas.PE.Models
{
    public class WatchdogState
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("well_id")]
        public string WellId { get; set; }

        [BsonElement("last_online")]
        public bool LastOnline { get; set; }

        [BsonElement("last_arus_status")]
        public int LastArusStatus { get; set; }

        [BsonElement("offline_notified")]
        public bool OfflineNotified { get; set; }
    }
}
