using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ssc.Models
{
    /// <summary>
    /// Satu dokumen = satu pekerjaan di background queue (upload/save file).
    /// Dipakai frontend (tombol Sync) untuk memantau status.
    /// </summary>
    [BsonIgnoreExtraElements]
    public class BackgroundJob
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }

        public string user { get; set; }          // User.Identity.Name pemilik job
        public string module { get; set; }        // lihat JobModule
        public string ref_id { get; set; }        // _id dokumen tmp terkait (daily_tmp, sumur_tmp, ...)
        public string file_name { get; set; }

        public string status { get; set; }        // lihat JobStatus
        public string message { get; set; }

        public long progress_current { get; set; }
        public long progress_total { get; set; }

        public DateTime queued_at { get; set; }
        public DateTime? started_at { get; set; }
        public DateTime? finished_at { get; set; } // dipakai TTL index (auto hapus)

        public bool dismissed { get; set; }        // disembunyikan user dari panel
    }

    public static class JobStatus
    {
        public const string Queued = "queued";
        public const string Running = "running";
        public const string Success = "success";
        public const string Warning = "warning";
        public const string Failed = "failed";
        public const string Interrupted = "interrupted";

        public static readonly string[] Active = { Queued, Running };
    }

    public static class JobModule
    {
        public const string DailyUpload = "daily-upload";
        public const string DailySave = "daily-save";
        public const string SumurUpload = "sumur-upload";
    }
}