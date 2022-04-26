using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ssc.Areas.SSC.Models
{
    public class Ticket
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        public string id { get; set; }
        public string type { get; set; }
        public string displayId { get; set; }
        public string summary { get; set; }
        public TicketCustomer customer { get; set; }
        public TicketAssignee assignee { get; set; }
        public string priority { get; set; }
        public TicketStatus status { get; set; }
        public TicketSupportGroup supportGroup { get; set; }
        public Int64 submitDate { get; set; }
        public Int64 completedDate { get; set; }
        public string slaStatus { get; set; }
        public Int64 modifiedDate { get; set; }
    }

    public class TicketCustomer
    {
        public string lastName { get; set; }
        public string fullName { get; set; }
        public TicketCustomerCompany company { get; set; }
        public TicketCustomerSite site { get; set; }
        public string department { get; set; }
        public TicketCustomFields customFields { get; set; }
    }

    public class TicketCustomerCompany
    {
        public string name { get; set; }
    }

    public class TicketCustomerSite
    {
        public string name { get; set; }
    }

    public class TicketAssignee
    {
        public string fullName { get; set; }
        public string loginId { get; set; }
        public TicketCustomFields customFields { get; set; }
    }

    public class TicketCustomFields
    {
        public TicketPA pa { get; set; }
        public TicketPSA psa { get; set; }
        public TicketGroup group { get; set; }
    }

    public class TicketPA
    {
        public string PERS_AREA { get; set; }
        public string PERS_AREA_TEXT { get; set; }
    }

    public class TicketPSA
    {
        public string PERS_SUBAREA { get; set; }
        public string PERS_SUBAREA_TEXT { get; set; }
    }

    public class TicketGroup
    {
        public string name { get; set; }
        public int index { get; set; }
    }

    public class TicketStatus
    {
        public string value { get; set; }
        public string reason { get; set; }
    }

    public class TicketSupportGroup
    {
        public string name { get; set; }
    }
}
