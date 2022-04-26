using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ssc.Areas.PE.Models
{
    public class Sensor
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        public DateTime? date { get; set; }
        public string well { get; set; }
        public decimal? freq { get; set; }
        public decimal? load { get; set; }
        public decimal? pi { get; set; }
        public decimal? ti { get; set; }
        public string esp { get; set; }
        public decimal? capacity { get; set; }
        public string created_by { get; set; }
        public DateTime? created_date { get; set; }
        public string updated_by { get; set; }
        public DateTime? updated_date { get; set; }
        public SensorError _error { get; set; }
    }

    public class SensorError
    {
        public ErrorItem _row { get; set; }
        public ErrorItem date { get; set; }
        public ErrorItem well { get; set; }
        public ErrorItem freq { get; set; }
        public ErrorItem load { get; set; }
        public ErrorItem pi { get; set; }
        public ErrorItem ti { get; set; }
        public ErrorItem esp { get; set; }
        public ErrorItem capacity { get; set; }
    }

    public class SensorList
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public Object[] _id { get; set; }
        public Object[] date { get; set; }
        public Object[] well { get; set; }
        public Object[] freq { get; set; }
        public Object[] load { get; set; }
        public Object[] pi { get; set; }
        public Object[] ti { get; set; }
        public Object[] esp { get; set; }
        public Object[] capacity { get; set; }
    }

    public class SensorTmp
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        public int error_count { get; set; }
        public Sensor[] items { get; set; }
    }
}
