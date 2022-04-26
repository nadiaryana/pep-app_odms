using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Oracle.ManagedDataAccess.Client;

namespace ssc.Areas.PE.Models
{
    public class Production
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        public DateTime? date { get; set; }
        public decimal? operation { get; set; }
        public decimal? sot { get; set; }
        public decimal? figure { get; set; }
        public decimal? gas { get; set; }
    }

    public class ProductionList
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public Object[] _id { get; set; }
        public Object[] date { get; set; }
        public Object[] operation { get; set; }
        public Object[] sot { get; set; }
        public Object[] figure { get; set; }
        public Object[] gas { get; set; }
    }

    public static class SOTCommon
    {
        public static OracleConnection conn;
        public static OracleCommand cmd;

        static SOTCommon()
        {
            string connString = "User Id=sot2014pm;Password=tskkm1645pm;Data Source=pepkpdb014.pertamina-ep.net:1521/SOTPROD;";
            conn = new OracleConnection(connString);
            conn.Open();
        }
    }
}
