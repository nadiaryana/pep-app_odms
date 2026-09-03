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
    public class MonitoringRK
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        public string well { get; set; }
        public string job { get; set; }
        public string rig { get; set; }
        public DateTime? plan_start { get; set; }
        public DateTime? plan_end { get; set; }
        public DateTime? pop { get; set; }
        public decimal? target_oil { get; set; }
        public decimal? target_gas { get; set; }
        public decimal? realisasi_oil { get; set; }
        public decimal? realisasi_gas { get; set; }
        public decimal? before { get; set; }
        public decimal? after { get; set; }
        public string remarks { get; set; }
        public string created_by { get; set; }
        public DateTime? created_date { get; set; }
        public string updated_by { get; set; }
        public DateTime? updated_date { get; set; }
        public MonitoringRKError _error { get; set; }
    }

    public class MonitoringRKTmp
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        public int error_count { get; set; }
        public DateTime upload_date { get; set; }
        public MonitoringRK[] items { get; set; }
        public string remarks { get; set; }
    }

    public class MonitoringRKError
    {
        public ErrorItem _row { get; set; }
        public ErrorItem well { get; set; }
        public ErrorItem job { get; set; }
        public ErrorItem rig { get; set; }
        public ErrorItem plan_start { get; set; }
        public ErrorItem plan_end { get; set; }
        public ErrorItem pop { get; set; }
        public ErrorItem target_oil { get; set; }
        public ErrorItem target_gas { get; set; }
        public ErrorItem realisasi_oil { get; set; }
        public ErrorItem realisasi_gas { get; set; }
        public ErrorItem before { get; set; }
        public ErrorItem after { get; set; }
        public ErrorItem remarks { get; set; }
    }

    public class MonitoringRKList
    {
        public dynamic[] well { get; set; }
        public dynamic[] job { get; set; }
        public dynamic[] rig { get; set; }
        public dynamic[] plan_start { get; set; }
        public dynamic[] plan_end { get; set; }
        public dynamic[] pop { get; set; }
        public dynamic[] target_oil { get; set; }
        public dynamic[] target_gas { get; set; }
        public dynamic[] realisasi_oil { get; set; }
        public dynamic[] realisasi_gas { get; set; }
        public dynamic[] remarks { get; set; }
    }
}
