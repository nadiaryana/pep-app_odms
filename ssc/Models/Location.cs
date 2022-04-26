using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ssc.Models
{
    public class Location
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        public int? id { get; set; }
        public string name { get; set; }
        public int? parent_id { get; set; }
        public int[] path { get; set; }
        public string type { get; set; }
        public bool has_children { get; set; }
        public string created_by { get; set; }
        public DateTime? created_date { get; set; }
        public string updated_by { get; set; }
        public DateTime? updated_date { get; set; }
        public LocationError _error { get; set; }
    }

    public class LocationError
    {
        public ErrorItem _row { get; set; }
        public ErrorItem id { get; set; }
        public ErrorItem name { get; set; }
        public ErrorItem parent { get; set; }
        public ErrorItem type { get; set; }
    }

    public class LocationList
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public Object[] _id { get; set; }
        public Object[] id { get; set; }
        public Object[] name { get; set; }
        public Object[] parent_id { get; set; }
        public Object[] path { get; set; }
        public Object[] type { get; set; }
        public Object[] expand { get; set; }
    }

    public class LocationTmp
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        public int error_count { get; set; }
        public Location[] items { get; set; }
    }
}
