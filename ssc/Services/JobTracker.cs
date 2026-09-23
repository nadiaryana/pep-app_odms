using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using ssc.Areas.PE.Models;
using ssc.Models;

namespace ssc.Services
{
    public interface IJobTracker
    {
        string Create(string user, string module, string refId, string fileName, string message = "Menunggu antrean");
        void MarkRunning(string jobId, string message = "Sedang diproses");
        void UpdateProgress(string jobId, long current, long total, string message = null);
        void Complete(string jobId, string status, string message);
        void Fail(string jobId, string message);

        bool HasActiveJob(string module, string refId);
        List<BackgroundJob> GetByUser(string user, DateTime sinceUtc);
        long GetQueuePosition(BackgroundJob job);
        void Dismiss(string jobId, string user);
        void DismissFinished(string user);
        long MarkInterruptedOnStartup();
    }

    public class JobTracker : IJobTracker
    {
        private readonly IMongoCollection<BackgroundJob> _jobs;
        private readonly ILogger<JobTracker> _logger;

        public JobTracker(ILogger<JobTracker> logger)
        {
            _logger = logger;
            // Pakai database "pe" yang sama dengan modul Daily
            _jobs = DailyCommon.database.GetCollection<BackgroundJob>("background_jobs");
            EnsureIndexes();
        }

        private void EnsureIndexes()
        {
            try
            {
                // Auto hapus job 3 hari setelah selesai. Job aktif (finished_at = null) tidak ikut terhapus.
                _jobs.Indexes.CreateOne(new CreateIndexModel<BackgroundJob>(
                    Builders<BackgroundJob>.IndexKeys.Ascending(j => j.finished_at),
                    new CreateIndexOptions { ExpireAfter = TimeSpan.FromDays(3), Name = "ttl_finished_at" }));

                // Query utama tombol Sync: job milik user, urut terbaru
                _jobs.Indexes.CreateOne(new CreateIndexModel<BackgroundJob>(
                    Builders<BackgroundJob>.IndexKeys.Ascending(j => j.user).Descending(j => j.queued_at),
                    new CreateIndexOptions { Name = "user_queued_at" }));

                _jobs.Indexes.CreateOne(new CreateIndexModel<BackgroundJob>(
                    Builders<BackgroundJob>.IndexKeys.Ascending(j => j.status).Ascending(j => j.queued_at),
                    new CreateIndexOptions { Name = "status_queued_at" }));
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Gagal membuat index background_jobs");
            }
        }

        public string Create(string user, string module, string refId, string fileName, string message = "Menunggu antrean")
        {
            var job = new BackgroundJob
            {
                user = user,
                module = module,
                ref_id = refId,
                file_name = fileName,
                status = JobStatus.Queued,
                message = message,
                queued_at = DateTime.UtcNow
            };
            try
            {
                _jobs.InsertOne(job);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal membuat job {Module} {RefId}", module, refId);
            }
            return job._id; // bisa null kalau insert gagal; method lain aman menerima null
        }

        public void MarkRunning(string jobId, string message = "Sedang diproses")
        {
            if (jobId == null) return;
            SafeUpdate(
                j => j._id == jobId && j.status == JobStatus.Queued,
                Builders<BackgroundJob>.Update
                    .Set(j => j.status, JobStatus.Running)
                    .Set(j => j.message, message)
                    .Set(j => j.started_at, DateTime.UtcNow));
        }

        public void UpdateProgress(string jobId, long current, long total, string message = null)
        {
            if (jobId == null) return;
            var update = Builders<BackgroundJob>.Update
                .Set(j => j.progress_current, current)
                .Set(j => j.progress_total, total);
            if (message != null) update = update.Set(j => j.message, message);

            // Hanya update selama masih running (jangan timpa status final)
            SafeUpdate(j => j._id == jobId && j.status == JobStatus.Running, update);
        }

        public void Complete(string jobId, string status, string message)
        {
            if (jobId == null) return;
            SafeUpdate(
                j => j._id == jobId,
                Builders<BackgroundJob>.Update
                    .Set(j => j.status, status)
                    .Set(j => j.message, message)
                    .Set(j => j.finished_at, DateTime.UtcNow));
        }

        public void Fail(string jobId, string message) => Complete(jobId, JobStatus.Failed, message);

        public bool HasActiveJob(string module, string refId)
        {
            try
            {
                return _jobs.CountDocuments(j => j.module == module && j.ref_id == refId
                    && (j.status == JobStatus.Queued || j.status == JobStatus.Running)) > 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "HasActiveJob gagal");
                return false;
            }
        }

        public List<BackgroundJob> GetByUser(string user, DateTime sinceUtc)
        {
            return _jobs.Find(j => j.user == user && j.dismissed != true && j.queued_at >= sinceUtc)
                .SortByDescending(j => j.queued_at)
                .Limit(50)
                .ToList();
        }

        public long GetQueuePosition(BackgroundJob job)
        {
            if (job.status != JobStatus.Queued) return 0;
            // Antrean bersifat global (semua user & modul berbagi 5 slot)
            return _jobs.CountDocuments(j => j.status == JobStatus.Queued && j.queued_at <= job.queued_at);
        }

        public void Dismiss(string jobId, string user)
        {
            SafeUpdate(j => j._id == jobId && j.user == user,
                Builders<BackgroundJob>.Update.Set(j => j.dismissed, true));
        }

        public void DismissFinished(string user)
        {
            try
            {
                _jobs.UpdateMany(
                    j => j.user == user && j.status != JobStatus.Queued && j.status != JobStatus.Running,
                    Builders<BackgroundJob>.Update.Set(j => j.dismissed, true));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DismissFinished gagal");
            }
        }

        /// <summary>
        /// Queue ada di memori → saat aplikasi start, semua job queued/running dari proses
        /// sebelumnya pasti sudah hilang. Tandai sebagai interrupted.
        /// </summary>
        public long MarkInterruptedOnStartup()
        {
            try
            {
                var result = _jobs.UpdateMany(
                    j => j.status == JobStatus.Queued || j.status == JobStatus.Running,
                    Builders<BackgroundJob>.Update
                        .Set(j => j.status, JobStatus.Interrupted)
                        .Set(j => j.message, "Server restart sebelum proses selesai. Silakan commit/upload ulang.")
                        .Set(j => j.finished_at, DateTime.UtcNow));
                return result.ModifiedCount;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "MarkInterruptedOnStartup gagal");
                return 0;
            }
        }

        private void SafeUpdate(System.Linq.Expressions.Expression<Func<BackgroundJob, bool>> filter,
            UpdateDefinition<BackgroundJob> update)
        {
            try
            {
                _jobs.UpdateOne(filter, update);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gagal update background_jobs");
            }
        }
    }
}