using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace ssc.Areas.PE.Models
{
    public class DailyDelta
    {
        public DateTime date { get; set; }
        public string well { get; set; }

        public decimal? fig_curr_gross_today { get; set; }
        public decimal? fig_curr_gross_prev { get; set; }
        public decimal? delta_fig_curr_gross { get; set; }

        public decimal? fig_curr_net_today { get; set; }
        public decimal? fig_curr_net_prev { get; set; }
        public decimal? delta_fig_curr_net { get; set; }

        public decimal? wc_today { get; set; }
        public decimal? wc_prev { get; set; }
        public decimal? delta_wc { get; set; }

        public decimal? gas_today { get; set; }
        public decimal? gas_prev { get; set; }
        public decimal? delta_gas { get; set; }

        public decimal? ds_efficiency_today { get; set; }
        public decimal? ds_efficiency_prev { get; set; }
        public decimal? delta_ds_efficiency { get; set; }

        public decimal? sm_today { get; set; }
        public decimal? sm_prev { get; set; }
        public decimal? delta_sm { get; set; }
    }
}