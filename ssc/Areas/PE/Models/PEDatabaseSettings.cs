using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ssc.Areas.PE.Models
{
    public class PEDatabaseSettings : IPEDatabaseSettings
    {
        public string DailyCollectionName { get; set; }
        public string ConnectionString { get; set; }
        public string DatabaseName { get; set; }
    }

    public interface IPEDatabaseSettings
    {
        string DailyCollectionName { get; set; }
        string ConnectionString { get; set; }
        string DatabaseName { get; set; }
    }
}
