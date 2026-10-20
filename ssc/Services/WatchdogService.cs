
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using ssc.Areas.PE.Models;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using System.Net.Http;
using MongoDB.Driver;

namespace ssc.Services
{
    public class WatchdogService : BackgroundService
    {
        private readonly ArusService _arusService;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<WatchdogService> _logger;
        private readonly IMongoCollection<WatchdogState> _stateCollection;

        private readonly TimeSpan _offlineThreshold =
            TimeSpan.FromMinutes(2);

        private readonly TimeSpan _checkInterval =
            TimeSpan.FromSeconds(15);

        private readonly string _pushoverToken;
        private readonly string _pushoverUserKey;

        public WatchdogService(
            ArusService arusService,
            IHttpClientFactory httpClientFactory,
            ILogger<WatchdogService> logger,
            IConfiguration config)
        {
            _arusService = arusService;
            _httpClientFactory = httpClientFactory;
            _logger = logger;

            // Ambil kredensial dari konfigurasi
            _pushoverToken = config["Pushover:Token"] ?? "";
            _pushoverUserKey = config["Pushover:UserKey"] ?? "";

            // Inisialisasi MongoDB
            var connectionString =
                config["PESumurSettings:ConnectionString"];

            var databaseName =
                config["PESumurSettings:DatabaseName"];

            if (string.IsNullOrWhiteSpace(connectionString) ||
                string.IsNullOrWhiteSpace(databaseName))
            {
                throw new InvalidOperationException(
                    "Konfigurasi MongoDB belum lengkap.");
            }

            var client = new MongoClient(connectionString);
            var db = client.GetDatabase(databaseName);

            _stateCollection =
                db.GetCollection<WatchdogState>("watchdog_state");

            // Satu state untuk setiap sumur
            var indexKeys =
                Builders<WatchdogState>.IndexKeys
                    .Ascending(x => x.WellId);

            var indexOptions = new CreateIndexOptions
            {
                Unique = true
            };

            _stateCollection.Indexes.CreateOne(
                new CreateIndexModel<WatchdogState>(
                    indexKeys, indexOptions));
        }

        protected override async Task ExecuteAsync(
            CancellationToken stoppingToken)
        {
            _logger.LogInformation(
                "[WATCHDOG] Service OFFLINE monitor berjalan.");

            try
            {
                await Task.Delay(
                    TimeSpan.FromSeconds(10), stoppingToken);

                while (!stoppingToken.IsCancellationRequested)
                {
                    await CekSemuaSumur(stoppingToken);

                    await Task.Delay(
                        _checkInterval, stoppingToken);
                }
            }
            catch (OperationCanceledException)
                when (stoppingToken.IsCancellationRequested)
            {
                // Service dihentikan secara normal
            }
            catch (Exception ex)
            {
                _logger.LogCritical(
                    ex, "[WATCHDOG] Service berhenti karena error.");
                throw;
            }
        }

        private async Task CekSemuaSumur(
            CancellationToken stoppingToken)
        {
            try
            {
                var wells = await _arusService.GetAllWellIdsAsync();

                if (wells == null)
                {
                    _logger.LogWarning(
                        "[WATCHDOG] Daftar sumur tidak tersedia.");
                    return;
                }

                // Ambil state yang tersimpan di MongoDB
                var allState = await _stateCollection
                    .Find(Builders<WatchdogState>.Filter.Empty)
                    .ToListAsync(stoppingToken);

                var stateMap = new Dictionary<string, WatchdogState>(
                    StringComparer.OrdinalIgnoreCase);

                foreach (var item in allState)
                {
                    stateMap[item.WellId] = item;
                }

                var bulkOps = new List<WriteModel<WatchdogState>>();

                foreach (var wellId in wells)
                {
                    stoppingToken.ThrowIfCancellationRequested();

                    var last = await _arusService
                        .GetLastReadingAsync(wellId);

                    // Tanpa data terakhir, waktu offline belum
                    // bisa dihitung dengan metode ini.
                    if (last == null || last.CreatedAt == null)
                    {
                        _logger.LogWarning(
                            "[WATCHDOG] {WellId}: data terakhir tidak ditemukan.",
                            wellId);
                        continue;
                    }

                    DateTime lastSeenUtc =
                        ToUtc(last.CreatedAt.Value);

                    TimeSpan age =
                        DateTime.UtcNow - lastSeenUtc;

                    bool isOnline = age <= _offlineThreshold;

                    // Ambil state sebelumnya atau buat state baru.
                    if (!stateMap.TryGetValue(wellId, out var state))
                    {
                        state = new WatchdogState
                        {
                            WellId = wellId,
                            LastOnline = false,
                            LastArusStatus = -1,
                            OfflineNotified = false
                        };
                    }

                    _logger.LogInformation(
                        "[WATCHDOG] {WellId} | Data terakhir {Seconds}s lalu | {Status}",
                        wellId,
                        Math.Round(age.TotalSeconds),
                        isOnline ? "ONLINE" : "OFFLINE");

                    if (!isOnline)
                    {
                        // OFFLINE: kirim sekali saja selama
                        // periode offline yang sama.
                        if (!state.OfflineNotified)
                        {
                            string message =
                                "🔴 " + wellId + " OFFLINE\n" +
                                "⚠ Tidak ada data masuk lebih dari 2 menit.\n" +
                                "⏰ Data terakhir: " +
                                FormatWita(lastSeenUtc);

                            bool sent = await KirimPushover(
                                "Sumur OFFLINE", message);

                            if (sent)
                            {
                                state.OfflineNotified = true;

                                _logger.LogWarning(
                                    "[WATCHDOG] Notifikasi OFFLINE terkirim untuk {WellId}.",
                                    wellId);
                            }
                            else
                            {
                                _logger.LogError(
                                    "[WATCHDOG] Notifikasi OFFLINE gagal untuk {WellId}; akan dicoba kembali.",
                                    wellId);
                            }
                        }

                        state.LastOnline = false;

                        // Watchdog tidak mengirim notifikasi arus ON/OFF.
                        state.LastArusStatus = -1;

                        bulkOps.Add(UpsertState(state));
                        continue;
                    }

                    // ONLINE: reset flag supaya kejadian OFFLINE
                    // berikutnya bisa mengirim notifikasi baru.
                    state.LastOnline = true;
                    state.LastArusStatus = last.Status;
                    state.OfflineNotified = false;

                    bulkOps.Add(UpsertState(state));
                }

                // Simpan state ke MongoDB
                if (bulkOps.Count > 0)
                {
                    await _stateCollection.BulkWriteAsync(
                        bulkOps,
                        new BulkWriteOptions
                        {
                            IsOrdered = false
                        },
                        stoppingToken);
                }
            }
            catch (OperationCanceledException)
                when (stoppingToken.IsCancellationRequested)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex, "[WATCHDOG] Gagal memeriksa status sumur.");
            }
        }

        private static WriteModel<WatchdogState> UpsertState(
            WatchdogState state)
        {
            var filter = Builders<WatchdogState>.Filter
                .Eq(s => s.WellId, state.WellId);

            var update = Builders<WatchdogState>.Update
                .Set(s => s.LastOnline, state.LastOnline)
                .Set(s => s.LastArusStatus, state.LastArusStatus)
                .Set(s => s.OfflineNotified, state.OfflineNotified);

            return new UpdateOneModel<WatchdogState>(
                filter, update)
            {
                IsUpsert = true
            };
        }

        private async Task<bool> KirimPushover(
            string title, string message)
        {
            if (string.IsNullOrWhiteSpace(_pushoverToken) ||
                string.IsNullOrWhiteSpace(_pushoverUserKey))
            {
                _logger.LogError(
                    "[WATCHDOG] Konfigurasi Pushover belum lengkap.");
                return false;
            }

            try
            {
                using (var client = _httpClientFactory.CreateClient())
                using (var content = new FormUrlEncodedContent(
                    new[]
                    {
                        new KeyValuePair<string, string>(
                            "token", _pushoverToken),

                        new KeyValuePair<string, string>(
                            "user", _pushoverUserKey),

                        new KeyValuePair<string, string>(
                            "title", title),

                        new KeyValuePair<string, string>(
                            "message", message)
                    }))
                using (var response = await client.PostAsync(
                    "https://api.pushover.net/1/messages.json",
                    content))
                {
                    if (response.IsSuccessStatusCode)
                    {
                        _logger.LogInformation(
                            "[WATCHDOG] Pushover berhasil. HTTP {StatusCode}",
                            (int)response.StatusCode);

                        return true;
                    }

                    string responseBody =
                        await response.Content.ReadAsStringAsync();

                    _logger.LogError(
                        "[WATCHDOG] Pushover gagal. HTTP {StatusCode}; respons: {Response}",
                        (int)response.StatusCode,
                        responseBody);

                    return false;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex, "[WATCHDOG] Gagal mengirim Pushover.");

                return false;
            }
        }

        private static DateTime ToUtc(DateTime value)
        {
            if (value.Kind == DateTimeKind.Utc)
                return value;

            if (value.Kind == DateTimeKind.Local)
                return value.ToUniversalTime();

            // MongoDB umumnya menyimpan DateTime dalam UTC.
            return DateTime.SpecifyKind(
                value, DateTimeKind.Utc);
        }

        private static string FormatWita(DateTime utcTime)
        {
            TimeZoneInfo wita;

            try
            {
                // Linux
                wita = TimeZoneInfo.FindSystemTimeZoneById(
                    "Asia/Makassar");
            }
            catch (TimeZoneNotFoundException)
            {
                try
                {
                    // Windows
                    wita = TimeZoneInfo.FindSystemTimeZoneById(
                        "Singapore Standard Time");
                }
                catch (TimeZoneNotFoundException)
                {
                    return utcTime.ToString(
                        "yyyy-MM-dd HH:mm:ss") + " UTC";
                }
            }

            return TimeZoneInfo.ConvertTimeFromUtc(
                utcTime, wita).ToString(
                    "yyyy-MM-dd HH:mm:ss") + " WITA";
        }
    }
}
