using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Globalization;

namespace ssc.Areas.SSC.Models
{
    public class SLA
    {
        public string group { get; set; }
        public int? no { get; set; }
        public int met { get; set; }
        public int missed { get; set; }
        public int total { get; set; }
        public decimal sla { get; set; }
    }

    static class Common
    {
        public static string[] _logical = new string[]{
            "and", "or"
        };

        public static Dictionary<string, string> status = new Dictionary<string, string>() {
            { "met", "WithinSLA" },
            { "missed", "SLABreached" },
            { "warning", "SLAWarning" },
            { "WithinSLA", "WithinSLA" },
            { "SLABreached", "SLABreached" },
            { "SLAWarning", "SLAWarning" }
        };

        public static string[] closed = new string[] { "Resolved", "Completed", "Closed" };

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
    }

    public class SLAFilter
    {
        public DateTime date { get; set; }
        public Int64 start_submitDate { get; set; }
        public string duration { get; set; }
    }
}
