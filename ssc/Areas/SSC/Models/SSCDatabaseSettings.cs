using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ssc.Areas.SSC.Models
{
    public class SSCDatabaseSettings : ISSCDatabaseSettings
    {
        public string TicketCollectionName { get; set; }
        public string ConnectionString { get; set; }
        public string DatabaseName { get; set; }
    }

    public interface ISSCDatabaseSettings
    {
        string TicketCollectionName { get; set; }
        string ConnectionString { get; set; }
        string DatabaseName { get; set; }
    }
}
