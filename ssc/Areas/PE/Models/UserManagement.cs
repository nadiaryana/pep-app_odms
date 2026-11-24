using System;
using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace ssc.Areas.PE.Models
{
    // Dokumen di collection "users" (database common), sama dengan user login
    [BsonIgnoreExtraElements]
    public class UserManagement
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        public string username { get; set; }

        // Di Mongo tersimpan sebagai display_name (dipakai saat login)
        [BsonElement("display_name")]
        public string name { get; set; }

        public string email { get; set; }

        // Tidak pernah dikirim ke frontend
        [JsonIgnore]
        public string password_hash { get; set; }

        public string department { get; set; }
        public string role { get; set; }
        public string status { get; set; }
        public DateTime? join_date { get; set; }

        public string created_by { get; set; }
        public DateTime? created_date { get; set; }
        public string updated_by { get; set; }
        public DateTime? updated_date { get; set; }
    }

    public class CreateUserManagementRequest
    {
        [Required]
        public string username { get; set; }

        // Wajib saat create, boleh kosong saat edit (tidak diganti)
        public string password { get; set; }

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
        public string status { get; set; }

        public DateTime? join_date { get; set; }
    }
}
