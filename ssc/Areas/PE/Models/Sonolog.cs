using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ssc.Areas.PE.Models
{
    public class Sonolog
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        public DateTime? date { get; set; }
        public string well { get; set; }
        public decimal? pump_intake { get; set; }
        public decimal? dfl { get; set; }
        public decimal? cdfl { get; set; }
        public decimal? sfl { get; set; }
        public decimal? tglc { get; set; }
        public decimal? egfl { get; set; }
        public decimal? al { get; set; }
        public string created_by { get; set; }
        public DateTime? created_date { get; set; }
        public string updated_by { get; set; }
        public DateTime? updated_date { get; set; }
        public SonologError _error { get; set; }
    }

    public class SonologError
    {
        public ErrorItem _row { get; set; }
        public ErrorItem date { get; set; }
        public ErrorItem well { get; set; }
        public ErrorItem pump_intake { get; set; }
        public ErrorItem dfl { get; set; }
        public ErrorItem cdfl { get; set; }
        public ErrorItem sfl { get; set; }
        public ErrorItem tglc { get; set; }
        public ErrorItem egfl { get; set; }
        public ErrorItem al { get; set; }
    }
    
    public class SonologList
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public Object[] _id { get; set; }
        public Object[] date { get; set; }
        public Object[] well { get; set; }
        public Object[] pump_intake { get; set; }
        public Object[] dfl { get; set; }
        public Object[] cdfl { get; set; }
        public Object[] sfl { get; set; }
        public Object[] tglc { get; set; }
        public Object[] egfl { get; set; }
        public Object[] al { get; set; }
    }

    public class SonologTmp
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        public int error_count { get; set; }
        public Sonolog[] items { get; set; }
    }
}
