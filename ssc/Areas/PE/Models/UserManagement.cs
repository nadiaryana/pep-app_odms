using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ssc.Areas.PE.Models
{
    public class UserManagement
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        public string name { get; set; }
        public string email { get; set; }
        public string department { get; set; }
        public string role { get; set; }

        [BsonSerializer(typeof(StringArrayBsonSerializer))]
        public string[] access { get; set; }

        public string status { get; set; }
        public DateTime? join_date { get; set; }


        public string created_by { get; set; }
        public DateTime? created_date { get; set; }
        public string updated_by { get; set; }
        public DateTime? updated_date { get; set; }
        public UserManagementError _error { get; set; }
    }

    public class CreateUserManagementRequest
    {
        [Required]
        public string name { get; set; }

        [Required]
        [EmailAddress]
        public string email { get; set; }

        [Required]
        public string department { get; set; }

        [Required]
        public string role { get; set; }

        [Required]
        [MinLength(1)]
        public string[] access { get; set; }

        [Required]
        public string status { get; set; }

        public DateTime? join_date { get; set; }
    }

    public class UserManagementError
    {
        public ErrorItem _row { get; set; }
        public ErrorItem name { get; set; }
        public ErrorItem email { get; set; }
        public ErrorItem department { get; set; }
        public ErrorItem role { get; set; }
        public ErrorItem access { get; set; }
        public ErrorItem status { get; set; }
    }

    public class UserManagementList
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public Object[] _id { get; set; }
        public Object[] name { get; set; }
        public Object[] email { get; set; }
        public Object[] department { get; set; }
        public Object[] role { get; set; }
        public Object[] access { get; set; }
        public Object[] status { get; set; }

    }

    public class UserManagementTmp
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        public int error_count { get; set; }
        public UserManagement[] items { get; set; }
    }
}
