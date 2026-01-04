using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;
using Newtonsoft.Json;

namespace ssc.Areas.PE.Models
{
    public class Barchart
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        public string well { get; set; }
        public string job { get; set; }
        public string rig { get; set; }
        public DateTime? plan_start { get; set; }
        public DateTime? plan_end { get; set; }
        public string created_by { get; set; }
        public DateTime? created_date { get; set; }
        public string updated_by { get; set; }
        public DateTime? updated_date { get; set; }
        public BarchartError _error { get; set; }
        public string remarks { get; set; }
    }

    public class BarchartTmp
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        public int error_count { get; set; }
        public DateTime upload_date { get; set; }
        public Barchart[] items { get; set; }
        public string remarks { get; set; }
    }

    public class BarchartError
    {
        public ErrorItem _row { get; set; }
        public ErrorItem well { get; set; }
        public ErrorItem job { get; set; }
        public ErrorItem rig { get; set; }
        public ErrorItem plan_start { get; set; }
        public ErrorItem plan_end { get; set; }
        public ErrorItem remarks { get; set; }
    }

    public class BarchartList
    {
        public dynamic[] well { get; set; }
        public dynamic[] job { get; set; }
        public dynamic[] rig { get; set; }
        public dynamic[] plan_start { get; set; }
        public dynamic[] plan_end { get; set; }
        public dynamic[] remarks { get; set; }
    }
}
