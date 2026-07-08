using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ssc.Areas.PE.Models
{
    public class WatchdogState
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        /// <summary>ID sumur (well_id)</summary>
        [BsonElement("well_id")]
        public string WellId { get; set; }

        /// <summary>Terakhir diketahui online?</summary>
        [BsonElement("last_online")]
        public bool LastOnline { get; set; }

        /// <summary>Terakhir diketahui arus status (1=ON, 0=OFF, -1=unknown)</summary>
        [BsonElement("last_arus_status")]
        public int LastArusStatus { get; set; }

        /// <summary>Apakah notifikasi offline sudah dikirim untuk periode offline ini?</summary>
        [BsonElement("offline_notified")]
        public bool OfflineNotified { get; set; }
    }
}
