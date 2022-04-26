using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ssc.Areas.SSC.Models
{
    public class TicketList
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public Object[] _id { get; set; }
        public Object[] id { get; set; }
        public Object[] type { get; set; }
        public Object[] displayId { get; set; }
        public Object[] summary { get; set; }
        public Object[] customer_fullName { get; set; }
        public Object[] customer_company { get; set; }
        public Object[] customer_site { get; set; }
        public Object[] customer_department { get; set; }
        public Object[] customer_pa { get; set; }
        public Object[] customer_psa { get; set; }
        public Object[] assignee_fullName { get; set; }
        public Object[] assignee_loginId { get; set; }
        public Object[] assignee_pa { get; set; }
        public Object[] assignee_psa { get; set; }
        public Object[] assignee_group { get; set; }
        public Object[] priority { get; set; }
        public Object[] status_value { get; set; }
        public Object[] status_reason { get; set; }
        public Object[] supportGroup_name { get; set; }
        public Object[] submitDate { get; set; }
        public Object[] completedDate { get; set; }
        public Object[] slaStatus { get; set; }
        public Object[] modifiedDate { get; set; }

        public Int64 start_submitDate { get; set; }
        public Int64 end_submitDate { get; set; }
        public string group { get; set; }
        public string status { get; set; }
    }
}
