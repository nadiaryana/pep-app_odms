using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;
using Newtonsoft.Json;

namespace ssc.Models
{
    public class CommonDatabaseSettings : ICommonDatabaseSettings
    {
        public string ConnectionString { get; set; }
        public string DatabaseName { get; set; }
    }

    public interface ICommonDatabaseSettings
    {
        string ConnectionString { get; set; }
        string DatabaseName { get; set; }
    }

    //public class Login
    //{
    //    public string company_id { get; set; }
    //    public string username { get; set; }
    //    public string password { get; set; }
    //}

    public class User
    {
        [BsonId]
        public ObjectId Id { get; set; }

        public string username { get; set; }
        public string email { get; set; }
        public string password_hash { get; set; }
        public string display_name { get; set; }
        public string role { get; set; }
    }

    public class Company
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        public string name { get; set; }
        public string domain { get; set; }
        public Container[] container { get; set; }
    }

    public class Container
    {
        public string container_role { get; set; }
        public string prefix_role { get; set; }
    }

    public class Role
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public string[] permission { get; set; }
    }

    public class Region
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        public string id { get; set; }
        public string name { get; set; }
        public string parent_id { get; set; }
        public string type { get; set; }
    }

    public class RegionLoad
    {
        public string error { get; set; }
        public string message { get; set; }
        public RegionList[] semuaprovinsi { get; set; }
        public RegionList[] kabupatens { get; set; }
        public RegionList[] kecamatans { get; set; }
        public RegionList[] desas { get; set; }
    }

    public class RegionList
    {
        public string id { get; set; }
        public string nama { get; set; }
        public string id_prov { get; set; }
        public string id_kabupaten { get; set; }
        public string id_kecamatan { get; set; }
    }

    public class ErrorItem
    {
        public string value { get; set; }
        public string message { get; set; }
    }

    public static class Common
    {
        public static IMongoDatabase database;
        public static readonly IMongoCollection<Location> _location;
        public static readonly IMongoCollection<LocationTmp> _location_tmp;
        public static ProjectionDefinition<Location> _fields_location;
        public static string[] _logical;

        static Common()
        {
            var client = new MongoClient("mongodb://localhost:27017");
            database = client.GetDatabase("common");

            _location = database.GetCollection<Location>("location");
            _location_tmp = database.GetCollection<LocationTmp>("location_tmp");

            _fields_location = Builders<Location>.Projection
                .Include(t => t.id)
                .Include(t => t.name)
                .Include(t => t.parent_id)
                .Include(t => t.path)
                .Include(t => t.type)
                .Include(t => t.has_children);

            _logical = new string[]{
                "and", "or"
            };
        }

        public static string TextPattern(string opr, string val)
        {
            Dictionary<string, string> patterns = new Dictionary<string, string> { };
            patterns.Add("eq", "^string$");
            patterns.Add("ne", "^(?!string$)");
            patterns.Add("bw", "^string");
            patterns.Add("ew", "string$");
            patterns.Add("ct", "string");
            patterns.Add("nct", "^((?!string).)*$");
            string res = patterns.GetValueOrDefault(opr).Replace("string", val);
            return res;
        }

        public static string ReplaceMonth(string str)
        {
            str = str.ToLower();
            for (var m = 1; m <= 12; m++)
            {
                string monthName = CultureInfo.CurrentCulture.DateTimeFormat.GetAbbreviatedMonthName(m).ToLower();
                if (str.IndexOf(monthName) != -1 && str.Trim() != monthName)
                {
                    str = str.Replace(monthName, m.ToString().PadLeft(2, '0'));
                    break;
                }
            }
            return str;
        }
    }
}
