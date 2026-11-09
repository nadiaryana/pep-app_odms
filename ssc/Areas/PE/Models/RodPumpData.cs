using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ssc.Areas.PE.Models
{
    public class RodPumpData
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        public decimal? rod_nomor { get; set; }
        public decimal? plunger_diameter { get; set; }
        public decimal? rod_weight { get; set; }
        public decimal? elastic_constat { get; set; }
        public decimal? freq_factor { get; set; }
        public decimal? rod_string1 { get; set; }
        public decimal? rod_string2 { get; set; }
        public decimal? rod_string3 { get; set; }
        public decimal? rod_string4 { get; set; }
        public decimal? rod_string5 { get; set; }
        public decimal? rod_string6 { get; set; }
        public decimal? rod_string7 { get; set; }
        public string created_by { get; set; }
        public DateTime? created_date { get; set; }
        public string updated_by { get; set; }
        public DateTime? updated_date { get; set; }
    }
}
