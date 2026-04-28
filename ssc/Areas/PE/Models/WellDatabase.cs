using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ssc.Areas.PE.Models
{
    public class WellDatabase
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        // public DateTime? date { get; set; }

        public DateTime? last_comp_date { get; set; }
        public string well { get; set; }
        public string[] layer_acc { get; set; }
        public decimal[][] interval_acc { get; set; }
        public decimal? top { get; set; }
        public decimal? bottom { get; set; }
        public string[] layer_unacc { get; set; }
        public decimal[][] interval_unacc { get; set; }
        public decimal? top_2 { get; set; }
        public decimal? bottom_2 { get; set; }
        public string hole_feature { get; set; }
        public decimal? panjang_feature { get; set; }
        public DateTime? date_acc { get; set; }
        public decimal? gross_acc { get; set; }
        public decimal? net_acc { get; set; }
        public decimal? wc_acc { get; set; }
        public string remarks_acc { get; set; }
        public DateTime? date_unacc { get; set; }
        public decimal? gross_unacc { get; set; }
        public decimal? net_unacc { get; set; }
        public decimal? wc_unacc { get; set; }
        public string remarks_unacc { get; set; }
        public string rtl { get; set; }
        public string remarks { get; set; }
        public string created_by { get; set; }
        public DateTime? created_date { get; set; }
        public string updated_by { get; set; }
        public DateTime? updated_date { get; set; }
        public WellDatabaseError _error { get; set; }
    }

    public class WellDatabaseError
    {
        public ErrorItem _row { get; set; }
        // public ErrorItem date { get; set; }

        public ErrorItem well { get; set; }
        public ErrorItem last_comp_date { get; set; }
        public ErrorItem layer_acc { get; set; }
        public ErrorItem interval_acc { get; set; }
        public ErrorItem top { get; set; }
        public ErrorItem bottom { get; set; }
        public ErrorItem layer_unacc { get; set; }
        public ErrorItem interval_unacc { get; set; }
        public ErrorItem top_2 { get; set; }
        public ErrorItem bottom_2 { get; set; }
        public ErrorItem hole_feature { get; set; }
        public ErrorItem panjang_feature { get; set; }
        public ErrorItem date_acc { get; set; }
        public ErrorItem gross_acc { get; set; }
        public ErrorItem net_acc { get; set; }
        public ErrorItem wc_acc { get; set; }
        public ErrorItem remarks_acc { get; set; }
        public ErrorItem date_unacc { get; set; }
        public ErrorItem gross_unacc { get; set; }
        public ErrorItem net_unacc { get; set; }
        public ErrorItem wc_unacc { get; set; }
        public ErrorItem remarks_unacc { get; set; }
        public ErrorItem rtl { get; set; }
        public ErrorItem remarks { get; set; }
    }

    public class WellDatabaseList
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public Object[] _id { get; set; }
        // public Object[] date { get; set; }
        public Object[] well { get; set; }
        public Object[] last_comp_date { get; set; }
        public Object[] layer_acc { get; set; }
        public Object[] interval_acc { get; set; }
        public Object[] top { get; set; }
        public Object[] bottom { get; set; }
        public Object[] layer_unacc { get; set; }
        public Object[] interval_unacc { get; set; }
        public Object[] top_2 { get; set; }
        public Object[] bottom_2 { get; set; }
        public Object[] hole_feature { get; set; }
        public Object[] panjang_feature { get; set; }
        public Object[] date_acc { get; set; }
        public Object[] gross_acc { get; set; }
        public Object[] net_acc { get; set; }
        public Object[] wc_acc { get; set; }
        public Object[] remarks_acc { get; set; }
        public Object[] date_unacc { get; set; }
        public Object[] gross_unacc { get; set; }
        public Object[] net_unacc { get; set; }
        public Object[] wc_unacc { get; set; }
        public Object[] remarks_unacc { get; set; }
        public Object[] rtl { get; set; }
        public Object[] remarks { get; set; }
    }

    public class WellDatabaseTmp
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        public int error_count { get; set; }
        public WellDatabase[] items { get; set; }
    }
}
