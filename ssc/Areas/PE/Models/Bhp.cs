using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ssc.Areas.PE.Models
{
    public class Bhp
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        public DateTime? date { get; set; }
        public string well { get; set; }
        public string compl_layer { get; set; }
        public string[] layer_name { get; set; }
        public decimal[][] perfo_interval { get; set; }
        public string meas_type { get; set; }
        public string meas_depth { get; set; }
        public decimal? pmax { get; set; }
        public decimal? tmax { get; set; }
        public string noted { get; set; }
        public string created_by { get; set; }
        public DateTime? created_date { get; set; }
        public string updated_by { get; set; }
        public DateTime? updated_date { get; set; }
        public BhpError _error { get; set; }
    }

    public class BhpError
    {
        public ErrorItem _row { get; set; }
        public ErrorItem date { get; set; }
        public ErrorItem well { get; set; }
        public ErrorItem compl_layer { get; set; }
        public ErrorItem layer_name { get; set; }
        public ErrorItem perfo_interval { get; set; }
        public ErrorItem meas_type { get; set; }
        public ErrorItem meas_depth { get; set; }
        public ErrorItem pmax { get; set; }
        public ErrorItem tmax { get; set; }
        public ErrorItem noted { get; set; }
    }

    public class BhpList
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public Object[] _id { get; set; }
        public Object[] date { get; set; }
        public Object[] well { get; set; }
        public Object[] compl_layer { get; set; }
        public Object[] layer_name { get; set; }
        public Object[] perfo_interval { get; set; }
        public Object[] meas_type { get; set; }
        public Object[] meas_depth { get; set; }
        public Object[] pmax { get; set; }
        public Object[] tmax { get; set; }
        public Object[] noted { get; set; }
    }

    public class BhpTmp
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        public int error_count { get; set; }
        public Bhp[] items { get; set; }
    }
}
