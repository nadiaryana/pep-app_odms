using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ssc.Areas.PE.Models
{
    public class Map
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        // public string Id { get; set; }
        public string _id { get; set; }
        public string wellName { get; set; }
        public string lat { get; set; }   // Latitude
        public string lng { get; set; }   // Longitude
        public string status { get; set; }
        public string station { get; set; }


        public string created_by { get; set; }
        public DateTime? created_date { get; set; }
        public string updated_by { get; set; }
        public DateTime? updated_date { get; set; }
        public MapError _error { get; set; }



    }

    public class MapError
    {
        public ErrorItem _row { get; set; }
        public ErrorItem wellName { get; set; }
        public ErrorItem lat { get; set; }
        public ErrorItem lng { get; set; }
        public ErrorItem status { get; set; }
        public ErrorItem station { get; set; }

    }

    public class MapList
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public Object[] _id { get; set; }
        public Object[] wellName { get; set; }
        public Object[] lat { get; set; }
        public Object[] lng { get; set; }
        public Object[] status { get; set; }
        public Object[] station { get; set; }
    }

    public class MapTmp
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        public int error_count { get; set; }
        public Map[] items { get; set; }
    }

    // Satu dokumen per row, referensi ke MapTmp via tmp_id
    public class MapTmpItem : Map
    {
        public string tmp_id { get; set; }
    }
}
