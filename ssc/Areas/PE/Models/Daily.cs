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
        public decimal? nomor { get; set; }
        public string location { get; set; }
        public string well { get; set; }
        public string well_string { get; set; }
        public string[] zone { get; set; }
        public decimal[][] interval { get; set; }
        public decimal? potensi_prod_gross { get; set; }
        public decimal? potensi_prod_net { get; set; }
        public decimal? tes_prod_gross { get; set; }
        public decimal? tes_prod_net { get; set; }
        public decimal? fig_last_gross { get; set; }
        public decimal? fig_last_net { get; set; }
        public decimal? fig_curr_gross { get; set; }
        public decimal? fig_curr_net { get; set; }
        public decimal? thp_last_fig { get; set; }
        public decimal? thp_potensi { get; set; }
        public decimal? wc { get; set; }
        public decimal? prod_hours { get; set; }
        public decimal? wor { get; set; }
        public decimal? gas { get; set; }
        public decimal? gor { get; set; }
        public decimal? glr { get; set; }
        public string ls_method { get; set; }
        public string ls_brandtype { get; set; }
        public string ls_prime_mover { get; set; }
        public string ls_hp { get; set; }
        public decimal? ds_size { get; set; }
        public decimal? ds_spm { get; set; }
        public decimal? ds_bean { get; set; }
        public decimal? ds_whp { get; set; }
        public decimal? ds_fl { get; set; }
        public decimal? ds_casing { get; set; }
        public decimal? ds_separator { get; set; }
        public decimal? ds_pump_displace { get; set; }
        public decimal? ds_efficiency { get; set; }
        public decimal? ds_kd { get; set; }
        public decimal? ds_sl { get; set; }
        public decimal? sm { get; set; }
        public DateTime? ds_tgl_pengujian { get; set; }

        public string noted { get; set; }
        //end
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
        public ErrorItem nomor { get; set; }
        public ErrorItem location { get; set; }
        public ErrorItem well { get; set; }
        public ErrorItem well_string { get; set; }
        public ErrorItem zone { get; set; }
        public ErrorItem interval { get; set; }
        public ErrorItem potensi_prod_gross { get; set; }
        public ErrorItem potensi_prod_net { get; set; }
        public ErrorItem tes_prod_gross { get; set; }
        public ErrorItem tes_prod_net { get; set; }
        public ErrorItem fig_last_gross { get; set; }
        public ErrorItem fig_last_net { get; set; }
        public ErrorItem fig_curr_gross { get; set; }
        public ErrorItem fig_curr_net { get; set; }
        public ErrorItem thp_last_fig { get; set; }
        public ErrorItem thp_potensi { get; set; }
        public ErrorItem wc { get; set; }
        public ErrorItem prod_hours { get; set; }
        public ErrorItem wor { get; set; }
        public ErrorItem gas { get; set; }
        public ErrorItem gor { get; set; }
        public ErrorItem glr { get; set; }
        public ErrorItem ls_method { get; set; }
        public ErrorItem ls_brandtype { get; set; }
        public ErrorItem ls_prime_mover { get; set; }
        public ErrorItem ls_hp { get; set; }
        public ErrorItem ds_size { get; set; }
        public ErrorItem ds_spm { get; set; }
        public ErrorItem ds_bean { get; set; }
        public ErrorItem ds_whp { get; set; }
        public ErrorItem ds_fl { get; set; }
        public ErrorItem ds_casing { get; set; }
        public ErrorItem ds_separator { get; set; }
        public ErrorItem ds_pump_displace { get; set; }
        public ErrorItem ds_efficiency { get; set; }
        public ErrorItem ds_sl { get; set; }
        public ErrorItem ds_kd { get; set; }
        public ErrorItem sm { get; set; }
        public ErrorItem ds_tgl_pengujian { get; set; }
        public ErrorItem noted { get; set; }
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
        public Object[] nomor { get; set; }
        public Object[] location { get; set; }
        public Object[] well { get; set; }
        public Object[] well_string { get; set; }
        public Object[] zone { get; set; }
        public Object[] interval { get; set; }
        public Object[] potensi_prod_gross { get; set; }
        public Object[] potensi_prod_net { get; set; }
        public Object[] tes_prod_gross { get; set; }
        public Object[] tes_prod_net { get; set; }
        public Object[] fig_last_gross { get; set; }
        public Object[] fig_last_net { get; set; }
        public Object[] fig_curr_gross { get; set; }
        public Object[] fig_curr_net { get; set; }
        public Object[] thp_last_fig { get; set; }
        public Object[] thp_potensi { get; set; }
        public Object[] wc { get; set; }
        public Object[] prod_hours { get; set; }
        public Object[] wor { get; set; }
        public Object[] gas { get; set; }
        public Object[] gor { get; set; }
        public Object[] glr { get; set; }
        public Object[] ls_method { get; set; }
        public Object[] ls_brandtype { get; set; }
        public Object[] ls_prime_mover { get; set; }
        public Object[] ls_hp { get; set; }
        public Object[] ds_size { get; set; }
        public Object[] ds_spm { get; set; }
        public Object[] ds_bean { get; set; }
        public Object[] ds_whp { get; set; }
        public Object[] ds_fl { get; set; }
        public Object[] ds_casing { get; set; }
        public Object[] ds_separator { get; set; }
        public Object[] ds_pump_displace { get; set; }
        public Object[] ds_efficiency { get; set; }
        public Object[] ds_sl { get; set; }
        public Object[] ds_kd { get; set; }
        public Object[] sm { get; set; }
        public Object[] ds_tgl_pengujian { get; set; }
        public Object[] noted { get; set; }
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
        public int batch_index { get; set; }
        public DateTime upload_date { get; set; }
        public Daily[] items { get; set; }
    }

    public static class DailyCommon
    {
        public static IMongoDatabase database;
        public static readonly IMongoCollection<Daily> _daily;
        public static readonly IMongoCollection<Sonolog> _sonolog;
        public static readonly IMongoCollection<Sensor> _sensor;
        public static readonly IMongoCollection<Production> _production;
        public static readonly IMongoCollection<ProductionTmp> _production_tmp;
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

            _daily_tmp = database.GetCollection<DailyTmp>("daily_tmp");
            _sonolog_tmp = database.GetCollection<SonologTmp>("sonolog_tmp");
            _sensor_tmp = database.GetCollection<SensorTmp>("sensor_tmp");

            _fields_daily = Builders<Daily>.Projection
                .Include(t => t.date)
                .Include(t => t.nomor)
                .Include(t => t.location)
                .Include(t => t.well)
                .Include(t => t.well_string)
                .Include(t => t.zone)
                .Include(t => t.interval)
                // .Include(t => t.test_date)
                // .Include(t => t.test_duration)
                .Include(t => t.potensi_prod_gross)
                .Include(t => t.potensi_prod_net)
                .Include(t => t.tes_prod_gross)
                .Include(t => t.tes_prod_net)
                .Include(t => t.fig_last_gross)
                .Include(t => t.fig_last_net)
                .Include(t => t.fig_curr_gross)
                .Include(t => t.fig_curr_net)
                .Include(t => t.thp_last_fig)
                .Include(t => t.thp_potensi)
                .Include(t => t.wc)
                .Include(t => t.prod_hours)
                .Include(t => t.wor)
                .Include(t => t.gas)
                .Include(t => t.gor)
                .Include(t => t.glr)
                .Include(t => t.ls_method)
                .Include(t => t.ls_brandtype)
                .Include(t => t.ls_prime_mover)
                .Include(t => t.ls_hp)
                .Include(t => t.ds_size)
                .Include(t => t.ds_spm)
                .Include(t => t.ds_bean)
                .Include(t => t.ds_whp)
                .Include(t => t.ds_fl)
                .Include(t => t.ds_casing)
                .Include(t => t.ds_separator)
                .Include(t => t.ds_pump_displace)
                .Include(t => t.ds_efficiency)
                .Include(t => t.ds_sl)
                .Include(t => t.ds_kd)
                .Include(t => t.sm)
                .Include(t => t.ds_tgl_pengujian)
                .Include(t => t.noted);

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
               .Include(t => t.gas)
               .Include(t => t.gas_sales)
               .Include(t => t.sgt_opr)
               .Include(t => t.sbr_opr)
               .Include(t => t.bd_opr)
               .Include(t => t.sgt_sot)
               .Include(t => t.sbr_sot)
               .Include(t => t.bd_sot)
               .Include(t => t.sgt_fig)
               .Include(t => t.sbr_fig)
               .Include(t => t.bd_fig)
               .Include(t => t.rkap_oil)
               .Include(t => t.wpnb_oil)
               .Include(t => t.rkap_gas)
               .Include(t => t.wpnb_gas);


            _logical = new string[]{
                "and", "or"
            };
        }

        // public static Daily CalculateFields(Daily daily)
        // {
        // //     DateTime? sensor_date = _sensor.Find(t => t.well == daily.well && t.date <= daily.date && t.pi != null)
        // //         .Project<Sensor>(_fields_sensor).ToList()?.Select(u => u.date).DefaultIfEmpty().Max() ?? null;

        // DateTime? sonolog_dfl_date = _sonolog.Find(t => t.well == daily.well && t.date <= daily.date && t.dfl != null)
        //     .Project<Sonolog>(_fields_sonolog).ToList()?.Select(u => u.date).DefaultIfEmpty().Max() ?? null;

        // DateTime? sonolog_sfl_date = _sonolog.Find(t => t.well == daily.well && t.date <= daily.date && t.sfl != null)
        //     .Project<Sonolog>(_fields_sonolog).ToList()?.Select(u => u.date).DefaultIfEmpty().Max() ?? null;

        //     // DateTime? sonolog_date;

        // //     decimal? pi = _sensor.Find(t => t.well == daily.well && t.date == sensor_date && t.pi != null).FirstOrDefault()?.pi;
        // //     decimal? sgmix = daily.last_prod_wc / 100 * (decimal)1.01 + (1 - daily.last_prod_wc / 100) * (decimal)0.878;

        // decimal? dfl = _sonolog.Find(t => t.well == daily.well && t.date == sonolog_dfl_date)
        // .Project<Sonolog>(_fields_sonolog).ToList()?.Average(i => i.dfl);

        // decimal? sfl = _sonolog.Find(t => t.well == daily.well && t.date == sonolog_sfl_date)
        // .Project<Sonolog>(_fields_sonolog).ToList()?.Average(i => i.sfl);

        // decimal? wc = _daily.Find(t => t.well == daily.well && t.date == daily_wc_date)
        // .Project<Daily>(_fields_daily).ToList()?.Average(i => i.wc);

        //     decimal? dfl;
        //     decimal? pump_capacity;
        //     decimal? plunger = null;
        //     decimal? pump_size = null;

        //     if (!String.IsNullOrEmpty(daily.art_lift_size))
        //     {
        //         pump_size = Convert.ToDecimal(daily.art_lift_size.Split(" ").ElementAt(0).Trim('"'));

        //         if (daily.art_lift_size.Length >= 4)
        //         {
        //             string suffix = daily.art_lift_size.Substring(daily.art_lift_size.Length - 4, 2).ToLower();
        //             switch (suffix)
        //             {
        //                 case "rw":
        //                     plunger = pump_size - (decimal)0.5;
        //                     break;
        //                 case "th":
        //                     plunger = pump_size - (decimal)0.25;
        //                     break;
        //                 default:
        //                     plunger = null;
        //                     break;
        //             }
        //         }
        //         else
        //         {
        //             plunger = null; // string too short, skip calculation
        //         }
        //     }


        //     if (!String.IsNullOrEmpty(daily.art_lift_type) && daily.art_lift_type.ToLower().StartsWith("e"))
        //     {
        //         dfl = (daily.pump_intake - (pi / (decimal)0.433 / sgmix / (decimal)3.281));
        //         pump_capacity = _sensor.Find(t => t.well == daily.well && t.date == sensor_date).FirstOrDefault()?.capacity;
        //     }
        //     else
        //     {
        //         dfl = cdfl;
        //         pump_capacity = (decimal)0.1484 * (decimal)3.14 * plunger * plunger / 4 * daily.art_lift_sl * daily.art_lift_spm;
        //     }
        //     if (dfl == null)

        //     {


        //         //     dfl = cdfl;
        //         //    pump_capacity = _sensor.Find(t => t.well == daily.well && t.date == sensor_date).FirstOrDefault()?.capacity;

        //     }

        //     if (!String.IsNullOrEmpty(daily.art_lift_type) && daily.art_lift_type.ToLower().StartsWith("e") && pi > 0 && sensor_date != null)
        //     {
        //         if (sonolog_cdfl_date != null && sonolog_sfl_date != null)
        //         {
        //             sonolog_date = (sensor_date >= sonolog_sfl_date && sonolog_sfl_date >= sonolog_cdfl_date) ? sensor_date
        //                 : (sonolog_cdfl_date > sonolog_sfl_date) ? sonolog_cdfl_date : sonolog_sfl_date;
        //         }
        //         else if (sonolog_cdfl_date != null && sonolog_sfl_date == null)
        //         {
        //             sonolog_date = (sensor_date > sonolog_cdfl_date) ? sensor_date : sonolog_cdfl_date;
        //         }
        //         else if (sonolog_sfl_date != null && sonolog_cdfl_date == null)
        //         {
        //             sonolog_date = (sensor_date > sonolog_sfl_date) ? sensor_date : sonolog_sfl_date;
        //         }
        //         else
        //         {
        //             sonolog_date = sensor_date;
        //         }

        //         //sonolog_date = new DateTime();
        //     }
        //     else
        //     {
        //         if (sonolog_cdfl_date != null && sonolog_sfl_date != null)
        //         {
        //             sonolog_date = (sonolog_cdfl_date > sonolog_sfl_date) ? sonolog_cdfl_date : sonolog_sfl_date;
        //         }
        //         else if (sonolog_cdfl_date == null && sonolog_sfl_date != null)
        //         {
        //             sonolog_date = sonolog_sfl_date;
        //         }
        //         else if (sonolog_cdfl_date != null && sonolog_sfl_date == null)
        //         {
        //             sonolog_date = sonolog_cdfl_date;
        //         }
        //         else
        //         {
        //             sonolog_date = _daily.Find(t => t.well == daily.well && t.date <= daily.date)
        //                 .Project<Daily>(_fields_daily).ToList()?.Select(u => u.sonolog_date).DefaultIfEmpty().Max() ?? null;
        //         }
        //     }

        //     decimal? pump_efficiency = (pump_capacity != 0) ? daily.last_prod_gross / pump_capacity : 0;
        //     decimal? pwf = (daily.mid - dfl) * (decimal)3.281 * sgmix * (decimal)0.433;
        // decimal? pwf = (0.433 * daily.wc) + (0.346 * (1 - daily.wc)) * (bop - dfl);
        // decimal? ps = (0.433 * daily.wc) + (0.346 * (1 - daily.wc)) * (bop - sfl);
        // decimal? pi = daily.fig_curr_gross / (ps - pwf);
        // decimal? qmax = pi * ps;
        //     decimal? ps = (daily.mid - sfl) * (decimal)3.281 * sgmix * (decimal)0.433;
        //     // decimal? sm = daily.pump_intake - dfl;
        //     decimal? qmaxth = 1 - (decimal)0.2 * pwf / ps - (decimal)0.8 * (pwf * pwf) / (ps * ps);
        //     decimal? qmax = (qmaxth != 0) ? daily.last_prod_gross / qmaxth : 0;
        //     decimal? well_efficiency = (qmax != 0) ? daily.last_prod_gross / qmax : 0;

        //     decimal? a = daily.last_prod_gross - daily.last_prod_net;
        //     decimal? wor = (daily.last_prod_net != 0) ? a / daily.last_prod_net : 0;

        //     daily.sonolog_date = sonolog_date;
        //     daily.pump_capacity = pump_capacity;
        //     daily.pump_efficiency = pump_efficiency;
        //     daily.sonolog_dfl = dfl;
        //     daily.sonolog_sfl = sfl;
        //     // daily.sm = sm;
        //     daily.sgmix = sgmix;
        //     daily.ps = ps;
        //     daily.pwf = pwf;
        //     daily.qmax = qmax;
        //     daily.well_efficiency = well_efficiency;
        //     daily.wor = wor;

        //     return daily;
        // }

        // public static long RecalculateFields(DateTime? start_date, string[] wells, string userName)
        // {
        //     try
        //     {
        //         long modified_count = 0;
        //         Daily daily;
        //         List<Daily> items = _daily.Find(t => t.date >= start_date && wells.Contains(t.well)).Project<Daily>(_fields_daily).ToList();

        //         foreach (Daily item in items)
        //         {
        //             daily = DailyCommon.CalculateFields(item);

        //             var update = Builders<Daily>.Update
        //                 .Set(t => t.pump_capacity, daily.pump_capacity)
        //                 .Set(t => t.pump_efficiency, daily.pump_efficiency)
        //                 .Set(t => t.sonolog_date, daily.sonolog_date)
        //                 .Set(t => t.sonolog_dfl, daily.sonolog_dfl)
        //                 .Set(t => t.sonolog_sfl, daily.sonolog_sfl)
        //                 .Set(t => t.sm, daily.sm)
        //                 .Set(t => t.ps, daily.ps)
        //                 .Set(t => t.pwf, daily.pwf)
        //                 .Set(t => t.qmax, daily.qmax)
        //                 .Set(t => t.well_efficiency, daily.well_efficiency)
        //                 .Set(t => t.wor, daily.wor)

        //                 .Set(t => t.updated_by, userName)
        //                 .Set(t => t.updated_date, DateTime.Now);

        //             UpdateResult res = _daily.UpdateOne(
        //                 Builders<Daily>.Filter.Eq(t => t.date, item.date) & Builders<Daily>.Filter.Eq(t => t.well, item.well),
        //                 update);

        //             modified_count += res.ModifiedCount;
        //         }

        //         return modified_count;

        //     }
        //     catch (Exception e)
        //     {
        //         return 0;
        //     }

        // }

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
