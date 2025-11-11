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
    public class Ipr
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        public DateTime? date { get; set; }
        public string well { get; set; }
        public string[] zone { get; set; }
        public decimal[][] interval { get; set; }
        // Perforation depths (user input)
        public double? TopPerforationDepth { get; set; }
        public double? BottomPerforationDepth { get; set; }

        // Computed reference depth (optional to store — kept for convenience)
        public double? PerforationDepthReference { get; set; }


        // Test metadata
        [Required]
        public DateTime Date { get; set; }

        // timeframe: Daily / Weekly / Monthly
        public string TimeFrame { get; set; }


        // Production values (derived from Daily depending on timeframe)
        public double? Gross { get; set; }
        public double? Net { get; set; }
        public double? WC { get; set; } // water cut fraction or percentage depending on UI


        // fluid levels and pressures (some may be user input or computed)
        public double? StaticFluidLevel { get; set; }
        public double? DynamicFluidLevel { get; set; }


        // Optional stored pressures (can be computed on read if needed)
        public double? StaticBottomholePressure { get; set; }
        public double? FlowingBottomholePressure { get; set; }


        // Results
        public double? PI { get; set; }
        public double? AOFP { get; set; }

        public List<IprCurvePoint> PwfCurve { get; set; }

        // optional notes / metadata
        public string Remark { get; set; }

        // Audit
        public string CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

    }
    public class IprCurvePoint
    {
        public double Pwf { get; set; }
        public double LiquidRate { get; set; }
    }
}