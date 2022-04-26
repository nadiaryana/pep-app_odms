using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ssc.Areas.PE.Models
{
    public class WellPerformance
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        public string uid { get; set; }
        public string well { get; set; }
        public string structure { get; set; }
        public int? month { get; set; }
        public int? year { get; set; }
        public decimal? gross { get; set; }
        public decimal? net { get; set; }
        public decimal? wc { get; set; }
        public decimal? gross_prev { get; set; }
        public decimal? net_prev { get; set; }
        public decimal? wc_prev { get; set; }
        public decimal? gross_gap { get; set; }
        public decimal? gross_gap_sort { get; set; }
        public decimal? net_gap { get; set; }
        public decimal? net_gap_sort { get; set; }
        public decimal? wc_gap { get; set; }
        public decimal? wc_gap_sort { get; set; }
    }

    public class WellPerformanceList
    {
        public Object[] date { get; set; }
        public Object[] date_prev { get; set; }
        public Object[] well { get; set; }
        public Object[] structure { get; set; }
        public Object[] month { get; set; }
        public Object[] year { get; set; }
        public Object[] gross { get; set; }
        public Object[] net { get; set; }
        public Object[] wc { get; set; }
        public Object[] gross_prev { get; set; }
        public Object[] net_prev { get; set; }
        public Object[] wc_prev { get; set; }
        public Object[] gross_gap { get; set; }
        public Object[] net_gap { get; set; }
        public Object[] wc_gap { get; set; }
    }

    public class WellPerformanceAnnual
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        public string uid { get; set; }
        public int year { get; set; }
        public string well { get; set; }
        public string structure { get; set; }
        public decimal? m1 { get; set; }
        public decimal? m2 { get; set; }
        public decimal? m3 { get; set; }
        public decimal? m4 { get; set; }
        public decimal? m5 { get; set; }
        public decimal? m6 { get; set; }
        public decimal? m7 { get; set; }
        public decimal? m8 { get; set; }
        public decimal? m9 { get; set; }
        public decimal? m10 { get; set; }
        public decimal? m11 { get; set; }
        public decimal? m12 { get; set; }
    }

    public class WellPerformanceAnnualList
    {
        public Object[] uid { get; set; }
        public Object[] year { get; set; }
        public Object[] well { get; set; }
        public Object[] structure { get; set; }
        public Object[] m1 { get; set; }
        public Object[] m2 { get; set; }
        public Object[] m3 { get; set; }
        public Object[] m4 { get; set; }
        public Object[] m5 { get; set; }
        public Object[] m6 { get; set; }
        public Object[] m7 { get; set; }
        public Object[] m8 { get; set; }
        public Object[] m9 { get; set; }
        public Object[] m10 { get; set; }
        public Object[] m11 { get; set; }
        public Object[] m12 { get; set; }
    }
}
