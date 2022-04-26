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
    public class Daily
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        public DateTime? date { get; set; }
        public string well { get; set; }
        public string[] zone { get; set; }
        public decimal[][] interval { get; set; }
        public DateTime? test_date { get; set; }
        public decimal? test_duration { get; set; }
        public decimal? last_prod_hours { get; set; }
        public decimal? last_prod_gross { get; set; }
        public decimal? last_prod_net { get; set; }
        public decimal? last_prod_wc { get; set; }
        public decimal? gas { get; set; }
        public string art_lift_size { get; set; }
        public string art_lift_type { get; set; }
        public decimal? art_lift_sl { get; set; }
        public decimal? art_lift_spm { get; set; }
        public decimal? art_lift_freq { get; set; }
        public decimal? art_lift_load { get; set; }
        public decimal? art_lift_bean_size { get; set; }
        public decimal? art_lift_efficiency { get; set; }
        public decimal? thp { get; set; }
        public decimal? chp { get; set; }
        public decimal? pfl { get; set; }
        public decimal? psep { get; set; }
        public decimal? pump_intake { get; set; }
        public decimal? top { get; set; }
        public decimal? mid { get; set; }
        public decimal? bottom { get; set; }

        public decimal? pump_capacity { get; set; }
        public decimal? pump_efficiency { get; set; }
        public DateTime? sonolog_date { get; set; }
        public decimal? sonolog_dfl { get; set; }
        public decimal? sonolog_sfl { get; set; }
        public decimal? sm { get; set; }
        public decimal? sgmix { get; set; }
        public decimal? ps { get; set; }
        public decimal? pwf { get; set; }
        public decimal? qmax { get; set; }
        public decimal? well_efficiency { get; set; }

        public DailyStructure structure { get; set; }

        public string created_by { get; set; }
        public DateTime? created_date { get; set; }
        public string updated_by { get; set; }
        public DateTime? updated_date { get; set; }
        public DailyError _error { get; set; }
    }

    public class DailyError
    {
        public ErrorItem _row { get; set; }
        public ErrorItem date { get; set; }
        public ErrorItem well { get; set; }
        public ErrorItem zone { get; set; }
        public ErrorItem interval { get; set; }
        public ErrorItem test_date { get; set; }
        public ErrorItem test_duration { get; set; }
        public ErrorItem last_prod_hours { get; set; }
        public ErrorItem last_prod_gross { get; set; }
        public ErrorItem last_prod_net { get; set; }
        public ErrorItem last_prod_wc { get; set; }
        public ErrorItem gas { get; set; }
        public ErrorItem art_lift_size { get; set; }
        public ErrorItem art_lift_type { get; set; }
        public ErrorItem art_lift_sl { get; set; }
        public ErrorItem art_lift_spm { get; set; }
        public ErrorItem art_lift_freq { get; set; }
        public ErrorItem art_lift_load { get; set; }
        public ErrorItem art_lift_bean_size { get; set; }
        public ErrorItem art_lift_efficiency { get; set; }
        public ErrorItem thp { get; set; }
        public ErrorItem chp { get; set; }
        public ErrorItem pfl { get; set; }
        public ErrorItem psep { get; set; }
        public ErrorItem pump_intake { get; set; }
        public ErrorItem top { get; set; }
        public ErrorItem mid { get; set; }
        public ErrorItem bottom { get; set; }
    }

    public class ErrorItem
    {
        public string value { get; set; }
        public string message { get; set; }
    }

    public class DailyList
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public Object[] _id { get; set; }
        public Object[] date { get; set; }
        public Object[] well { get; set; }
        public Object[] zone { get; set; }
        public Object[] interval { get; set; }
        public Object[] test_date { get; set; }
        public Object[] test_duration { get; set; }
        public Object[] last_prod_hours { get; set; }
        public Object[] last_prod_gross { get; set; }
        public Object[] last_prod_net { get; set; }
        public Object[] last_prod_wc { get; set; }
        public Object[] gas { get; set; }
        public Object[] art_lift_size { get; set; }
        public Object[] art_lift_type { get; set; }
        public Object[] art_lift_sl { get; set; }
        public Object[] art_lift_spm { get; set; }
        public Object[] art_lift_freq { get; set; }
        public Object[] art_lift_load { get; set; }
        public Object[] art_lift_bean_size { get; set; }
        public Object[] art_lift_efficiency { get; set; }
        public Object[] thp { get; set; }
        public Object[] chp { get; set; }
        public Object[] pfl { get; set; }
        public Object[] psep { get; set; }
        public Object[] pump_intake { get; set; }
        public Object[] top { get; set; }
        public Object[] mid { get; set; }
        public Object[] bottom { get; set; }
        public Object[] pump_capacity { get; set; }
        public Object[] pump_efficiency { get; set; }
        public Object[] sonolog_date { get; set; }
        public Object[] sonolog_dfl { get; set; }
        public Object[] sonolog_sfl { get; set; }
        public Object[] sm { get; set; }
        public Object[] sgmix { get; set; }
        public Object[] ps { get; set; }
        public Object[] pwf { get; set; }
        public Object[] qmax { get; set; }
        public Object[] well_efficiency { get; set; }
    }

    public class DailyStructure
    {
        public string name { get; set; }
        public string shortName { get; set; }
    }

    public class Structure
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        public string name { get; set; }
        public string shortName { get; set; }
        public string[] prefix { get; set; }
    }

    public class DailyTmp
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        public int error_count { get; set; }
        public Daily[] items { get; set; }
    }

    public static class DailyCommon
    {
        public static IMongoDatabase database;
        public static readonly IMongoCollection<Daily> _daily;
        public static readonly IMongoCollection<Sonolog> _sonolog;
        public static readonly IMongoCollection<Sensor> _sensor;
        public static readonly IMongoCollection<Production> _production;
        public static readonly IMongoCollection<Structure> _structure;
        public static readonly IMongoCollection<DailyTmp> _daily_tmp;
        public static readonly IMongoCollection<SonologTmp> _sonolog_tmp;
        public static readonly IMongoCollection<SensorTmp> _sensor_tmp;
        public static ProjectionDefinition<Daily> _fields_daily;
        public static ProjectionDefinition<Sonolog> _fields_sonolog;
        public static ProjectionDefinition<Sensor> _fields_sensor;
        public static ProjectionDefinition<Production> _fields_production;
        public static ProjectionDefinition<Structure> _fields_structure;
        public static string[] _logical;

        static DailyCommon()
        {
            var client = new MongoClient("mongodb://localhost:27017");
            database = client.GetDatabase("pe");

            _daily = database.GetCollection<Daily>("daily");
            _sonolog = database.GetCollection<Sonolog>("sonolog");
            _sensor = database.GetCollection<Sensor>("sensor");
            _production = database.GetCollection<Production>("production");
            _structure = database.GetCollection<Structure>("structure");

            _daily_tmp = database.GetCollection<DailyTmp>("daily_tmp");
            _sonolog_tmp = database.GetCollection<SonologTmp>("sonolog_tmp");
            _sensor_tmp = database.GetCollection<SensorTmp>("sensor_tmp");

            _fields_daily = Builders<Daily>.Projection
                .Include(t => t.date)
                .Include(t => t.well)
                .Include(t => t.zone)
                .Include(t => t.interval)
                .Include(t => t.test_date)
                .Include(t => t.test_duration)
                .Include(t => t.last_prod_hours)
                .Include(t => t.last_prod_gross)
                .Include(t => t.last_prod_net)
                .Include(t => t.last_prod_wc)
                .Include(t => t.gas)
                .Include(t => t.art_lift_size)
                .Include(t => t.art_lift_type)
                .Include(t => t.art_lift_sl)
                .Include(t => t.art_lift_spm)
                .Include(t => t.art_lift_freq)
                .Include(t => t.art_lift_load)
                .Include(t => t.art_lift_bean_size)
                .Include(t => t.art_lift_efficiency)
                .Include(t => t.thp)
                .Include(t => t.chp)
                .Include(t => t.pfl)
                .Include(t => t.psep)
                .Include(t => t.pump_intake)
                .Include(t => t.top)
                .Include(t => t.mid)
                .Include(t => t.bottom)
                .Include(t => t.structure)
                .Include(t => t.pump_capacity)
                .Include(t => t.pump_efficiency)
                .Include(t => t.sonolog_date)
                .Include(t => t.sonolog_dfl)
                .Include(t => t.sonolog_sfl)
                .Include(t => t.sm)
                .Include(t => t.ps)
                .Include(t => t.pwf)
                .Include(t => t.qmax)
                .Include(t => t.well_efficiency);

            _fields_sonolog = Builders<Sonolog>.Projection
                .Include(t => t.date)
                .Include(t => t.well)
                .Include(t => t.pump_intake)
                .Include(t => t.dfl)
                .Include(t => t.cdfl)
                .Include(t => t.sfl)
                .Include(t => t.tglc)
                .Include(t => t.egfl)
                .Include(t => t.al);

            _fields_sensor = Builders<Sensor>.Projection
               .Include(t => t.date)
               .Include(t => t.well)
               .Include(t => t.freq)
               .Include(t => t.load)
               .Include(t => t.pi)
               .Include(t => t.ti);

            _fields_production = Builders<Production>.Projection
               .Include(t => t.date)
               .Include(t => t.operation)
               .Include(t => t.sot)
               .Include(t => t.figure)
               .Include(t => t.gas);

            _fields_structure = Builders<Structure>.Projection
               .Include(t => t.name)
               .Include(t => t.shortName)
               .Include(t => t.prefix);

            _logical = new string[]{
                "and", "or"
            };
        }

        public static Daily CalculateFields(Daily daily)
        {
            DateTime? sensor_date = _sensor.Find(t => t.well == daily.well && t.date <= daily.date)
                .Project<Sensor>(_fields_sensor).ToList()?.Select(u => u.date).DefaultIfEmpty().Max() ?? null;

            DateTime? sonolog_cdfl_date = _sonolog.Find(t => t.well == daily.well && t.date <= daily.date && t.cdfl != null)
                .Project<Sonolog>(_fields_sonolog).ToList()?.Select(u => u.date).DefaultIfEmpty().Max() ?? null;

            DateTime? sonolog_sfl_date = _sonolog.Find(t => t.well == daily.well && t.date <= daily.date && t.sfl != null)
                .Project<Sonolog>(_fields_sonolog).ToList()?.Select(u => u.date).DefaultIfEmpty().Max() ?? null;

            DateTime? sonolog_date;

            decimal? pi = _sensor.Find(t => t.well == daily.well && t.date == sensor_date).FirstOrDefault()?.pi;
            decimal? sgmix = daily.last_prod_wc / 100 * (decimal)1.01 + (1 - daily.last_prod_wc / 100) * (decimal)0.878;

            decimal? cdfl = _sonolog.Find(t => t.well == daily.well && t.date == sonolog_cdfl_date)
                .Project<Sonolog>(_fields_sonolog).ToList()?.Average(i => i.cdfl);

            decimal? sfl = _sonolog.Find(t => t.well == daily.well && t.date == sonolog_sfl_date)
                .Project<Sonolog>(_fields_sonolog).ToList()?.Average(i => i.sfl);

            decimal? dfl;
            decimal? pump_capacity;
            decimal? plunger = null;
            decimal? pump_size = null;

            if (!String.IsNullOrEmpty(daily.art_lift_size))
            {
                pump_size = Convert.ToDecimal(daily.art_lift_size?.Split(" ")?.ElementAt(0).Trim('"'));
                switch (daily.art_lift_size.Substring(daily.art_lift_size.Length - 4).Substring(0, 2).ToLower())
                {
                    case "rw":
                        plunger = pump_size - (decimal)0.5;
                        break;
                    case "th":
                        plunger = pump_size - (decimal)0.25;
                        break;
                    default:
                        plunger = null;
                        break;
                }
            }


            if (!String.IsNullOrEmpty(daily.art_lift_type) && daily.art_lift_type.ToLower().StartsWith("e"))
            {
                dfl = (daily.pump_intake - (pi / (decimal)0.433 / sgmix / (decimal)3.281));
                pump_capacity = _sensor.Find(t => t.well == daily.well && t.date == sensor_date).FirstOrDefault()?.capacity;
            }
            else
            {
                dfl = cdfl;
                pump_capacity = (decimal)0.1484 * (decimal)3.14 * plunger * plunger / 4 * daily.art_lift_sl * daily.art_lift_spm;
            }
            if (dfl == null)
            {

            }

            if (!String.IsNullOrEmpty(daily.art_lift_type) && daily.art_lift_type.ToLower().StartsWith("e") && pi > 0 && sensor_date != null && (sensor_date >= sonolog_cdfl_date || sensor_date >= sonolog_sfl_date))
            {
                sonolog_date = sensor_date;
                //sonolog_date = new DateTime();
            } else
            {
                if (sonolog_cdfl_date != null && sonolog_sfl_date != null)
                {
                    sonolog_date = (sonolog_cdfl_date > sonolog_sfl_date) ? sonolog_cdfl_date : sonolog_sfl_date;
                }
                else if (sonolog_cdfl_date == null && sonolog_sfl_date != null)
                {
                    sonolog_date = sonolog_sfl_date;
                }
                else if (sonolog_cdfl_date != null && sonolog_sfl_date == null)
                {
                    sonolog_date = sonolog_cdfl_date;
                }
                else
                {
                    sonolog_date = _daily.Find(t => t.well == daily.well && t.date <= daily.date)
                        .Project<Daily>(_fields_daily).ToList()?.Select(u => u.sonolog_date).DefaultIfEmpty().Max() ?? null;
                }
            }

            decimal? pump_efficiency = (pump_capacity != 0)? daily.last_prod_gross / pump_capacity : 0;
            decimal? pwf = (daily.mid - dfl) * (decimal)3.281 * sgmix * (decimal)0.433;
            decimal? ps = (daily.mid - sfl) * (decimal)3.281 * sgmix * (decimal)0.433;
            decimal? sm = daily.pump_intake - dfl;
            decimal? qmaxth = 1 - (decimal)0.2 * pwf / ps - (decimal)0.8 * (pwf * pwf) / (ps * ps);
            decimal? qmax = (qmaxth != 0) ? daily.last_prod_gross / qmaxth : 0;
            decimal? well_efficiency = (qmax != 0) ? daily.last_prod_gross / qmax : 0;

            daily.sonolog_date = sonolog_date;
            daily.pump_capacity = pump_capacity;
            daily.pump_efficiency = pump_efficiency;
            daily.sonolog_dfl = dfl;
            daily.sonolog_sfl = sfl;
            daily.sm = sm;
            daily.sgmix = sgmix;
            daily.ps = ps;
            daily.pwf = pwf;
            daily.qmax = qmax;
            daily.well_efficiency = well_efficiency;

            return daily;
        }

        public static long RecalculateFields(DateTime? start_date, string[] wells, string userName)
        {
            try
            {
                long modified_count = 0;
                Daily daily;
                List<Daily> items = _daily.Find(t => t.date >= start_date && wells.Contains(t.well)).Project<Daily>(_fields_daily).ToList();

                foreach(Daily item in items)
                {
                    daily = DailyCommon.CalculateFields(item);

                    var update = Builders<Daily>.Update
                        .Set(t => t.pump_capacity, daily.pump_capacity)
                        .Set(t => t.pump_efficiency, daily.pump_efficiency)
                        .Set(t => t.sonolog_date, daily.sonolog_date)
                        .Set(t => t.sonolog_dfl, daily.sonolog_dfl)
                        .Set(t => t.sonolog_sfl, daily.sonolog_sfl)
                        .Set(t => t.sm, daily.sm)
                        .Set(t => t.ps, daily.ps)
                        .Set(t => t.pwf, daily.pwf)
                        .Set(t => t.qmax, daily.qmax)
                        .Set(t => t.well_efficiency, daily.well_efficiency)

                        .Set(t => t.updated_by, userName)
                        .Set(t => t.updated_date, DateTime.Now);

                    UpdateResult res = _daily.UpdateOne(
                        Builders<Daily>.Filter.Eq(t => t.date, item.date) & Builders<Daily>.Filter.Eq(t => t.well, item.well),
                        update);

                    modified_count += res.ModifiedCount;
                }

                return modified_count;

            } catch(Exception e)
            {
                return 0;
            }
            
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
    
    public class ExprDecimal
    {
        public string opr { get; set; }
        public decimal? val { get; set; }
    }
}
