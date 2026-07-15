using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using ssc.Services;
using ssc.Areas.PE.Models;
using System;
using System.Net.Http;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MongoDB.Driver;

namespace ssc.Services
{
    public class WatchdogService : BackgroundService
    {
        private readonly ArusService _arusService;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<WatchdogService> _logger;
        private readonly IMongoCollection<WatchdogState> _stateCollection;

        private readonly TimeSpan _offlineThreshold = TimeSpan.FromMinutes(2);
        private readonly TimeSpan _checkInterval = TimeSpan.FromSeconds(15);

        // Fonnte WhatsApp config
        private const string FonnteToken = "uY32HEmm747kGmXPcx8h";
        private const string GrupWAId = "120363408080815318@g.us";
        private const string FonnteUrl = "https://api.fonnte.com/send";

        private const string PushoverToken = "ai2ce22rg828o1q1r5n6v6afp9vd1d";
        private const string PushoverUserKey = "ujjtrrauiqqqn84skaitcxwfsayqwt";

        public WatchdogService(
            ArusService arusService,
            IHttpClientFactory httpClientFactory,
            ILogger<WatchdogService> logger,
            IConfiguration config)
        {
            _arusService = arusService;
            _httpClientFactory = httpClientFactory;
            _logger = logger;

            // Inisialisasi koleksi MongoDB untuk persistent state
            var connectionString = config["PESumurSettings:ConnectionString"];
            var databaseName = config["PESumurSettings:DatabaseName"];
            var client = new MongoClient(connectionString);
            var db = client.GetDatabase(databaseName);
            _stateCollection = db.GetCollection<WatchdogState>("watchdog_state");

            // Index agar cepat cari berdasar well_id
            var indexKeys = Builders<WatchdogState>.IndexKeys.Ascending(x => x.WellId);
            var indexOptions = new CreateIndexOptions { Unique = true };
            _stateCollection.Indexes.CreateOne(
                new CreateIndexModel<WatchdogState>(indexKeys, indexOptions));
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("[WATCHDOG] Service berjalan.");
            await Task.Delay(TimeSpan.FromSeconds(10), stoppingToken);

            while (!stoppingToken.IsCancellationRequested)
            {
                await CekSemuaSumur();
                await Task.Delay(_checkInterval, stoppingToken);
            }
        }

        private async Task CekSemuaSumur()
        {
            try
            {
                var wells = await _arusService.GetAllWellIdsAsync();

                // Load semua state dari MongoDB sekali per siklus
                var allState = await _stateCollection.Find(_ => true).ToListAsync();
                var stateMap = allState.ToDictionary(s => s.WellId, s => s);

                var bulkOps = new List<WriteModel<WatchdogState>>();

                foreach (var wellId in wells)
                {
                    var last = await _arusService.GetLastReadingAsync(wellId);
                    if (last == null || last.CreatedAt == null) continue;

                    DateTime lastSeen = last.CreatedAt.Value;
                    TimeSpan selisih = DateTime.UtcNow - lastSeen;
                    bool isOnline = selisih <= _offlineThreshold;
                    int arusStatus = last.Status; // 1=ON, 0=OFF

                    // Ambil state dari MongoDB (atau default jika belum ada)
                    bool stateExists = stateMap.TryGetValue(wellId, out var state);
                    if (!stateExists)
                    {
                        state = new WatchdogState
                        {
                            WellId = wellId,
                            LastOnline = false,
                            LastArusStatus = -1,
                            OfflineNotified = false
                        };
                    }

                    bool lastOnline = state.LastOnline;
                    int lastArus = state.LastArusStatus;
                    bool offlineNotified = state.OfflineNotified;

                    _logger.LogInformation(
                        "[WATCHDOG] " + wellId +
                        " | " + Math.Round(selisih.TotalSeconds) + "s lalu" +
                        " | Koneksi: " + (isOnline ? "ONLINE" : "OFFLINE") +
                        " | Arus status: " + arusStatus);


                    if (!isOnline)
                    {
                        // Kirim notif hanya sekali per periode offline & belum pernah dikirim
                        if (!offlineNotified)
                        {
                            _logger.LogWarning("[WATCHDOG] " + wellId + " OFFLINE!");

                            string msg = "🔴 " + wellId + " OFFLINE\n" +
                                         "⚠ Alat tidak mengirim data > 2 menit\n" +
                                         "⏰ Terakhir aktif: " +
                                         lastSeen.ToLocalTime().ToString("yyyy-MM-dd HH:mm:ss") + " WITA";

                            await KirimPushover("Status IoT", msg);
                        }

                        // Update state: offline, notified flag tetap true
                        state.LastOnline = false;
                        state.LastArusStatus = -1;
                        state.OfflineNotified = true;
                        bulkOps.Add(UpsertState(state));
                        continue;
                    }

                    // ── WELL ONLINE ──
                    // Reset flag offline_notified karena sudah online kembali

                    if (arusStatus == 1)
                    {
                        // ── Arus ON ──
                        bool kirimOn = !stateExists ||
                                       lastOnline == false ||
                                       lastArus == 0 ||
                                       lastArus == -1;

                        if (kirimOn)
                        {
                            _logger.LogInformation("[WATCHDOG] " + wellId + " ON!");

                            string msg = "✅ " + wellId + " Status: ON\n" +
                                         "⚡ Arus: " + last.Current.ToString("F2") + " A\n" +
                                         "⏰ " + DateTime.UtcNow.ToLocalTime().ToString("yyyy-MM-dd HH:mm:ss") + " WITA";

                            await KirimPushover("Status IoT", msg);
                        }
                    }
                    else
                    {
                        // ── Arus OFF < 1 ──
                        bool kirimOff = !stateExists ||
                                        lastArus == 1 ||
                                        lastArus == -1;

                        if (kirimOff)
                        {
                            _logger.LogInformation("[WATCHDOG] " + wellId + " OFF (arus rendah)!");

                            string msg = "⚠ " + wellId + " Status: OFF\n" +
                                         "⚡ Arus: " + last.Current.ToString("F2") + " A\n" +
                                         "⏰ " + DateTime.UtcNow.ToLocalTime().ToString("yyyy-MM-dd HH:mm:ss") + " WITA";

                            await KirimPushover("Status IoT", msg);
                        }
                    }

                    // Update state: online, reset offline_notified untuk periode offline berikutnya
                    state.LastOnline = true;
                    state.LastArusStatus = arusStatus;
                    state.OfflineNotified = false;
                    bulkOps.Add(UpsertState(state));
                }

                // Simpan semua perubahan state ke MongoDB sekaligus
                if (bulkOps.Count > 0)
                {
                    await _stateCollection.BulkWriteAsync(bulkOps, new BulkWriteOptions { IsOrdered = false });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("[WATCHDOG] Error: " + ex.Message);
            }
        }

        private static WriteModel<WatchdogState> UpsertState(WatchdogState state)
        {
            var filter = Builders<WatchdogState>.Filter.Eq(s => s.WellId, state.WellId);
            var update = Builders<WatchdogState>.Update
                .Set(s => s.LastOnline, state.LastOnline)
                .Set(s => s.LastArusStatus, state.LastArusStatus)
                .Set(s => s.OfflineNotified, state.OfflineNotified);
            return new UpdateOneModel<WatchdogState>(filter, update) { IsUpsert = true };
        }

        private async Task KirimPushover(string title, string message)
        {
            try
            {
                HttpClient client = _httpClientFactory.CreateClient();

                var content = new FormUrlEncodedContent(new[]
                {
                    new KeyValuePair<string, string>("token",   PushoverToken),
                    new KeyValuePair<string, string>("user",    PushoverUserKey),
                    new KeyValuePair<string, string>("title",   title),
                    new KeyValuePair<string, string>("message", message),
                });

                var response = await client.PostAsync(
                    "https://api.pushover.net/1/messages.json", content);

                _logger.LogInformation("[WATCHDOG] Pushover: " + (int)response.StatusCode);
            }
            catch (Exception ex)
            {
                _logger.LogError("[WATCHDOG] Gagal kirim Pushover: " + ex.Message);
            }
        }

        // private async Task KirimWA(string message)
        // {
        //     try
        //     {
        //         HttpClient client = _httpClientFactory.CreateClient();
        //         client.DefaultRequestHeaders.Clear();
        //         client.DefaultRequestHeaders.Add("Authorization", FonnteToken);

        //         var content = new FormUrlEncodedContent(new[]
        //         {
        //             new KeyValuePair<string, string>("target",  GrupWAId),
        //             new KeyValuePair<string, string>("message", message),
        //             new KeyValuePair<string, string>("isGroup", "true"),
        //         });

        //         var response = await client.PostAsync(FonnteUrl, content);
        //         string result = await response.Content.ReadAsStringAsync();

        //         _logger.LogInformation("[WATCHDOG] Fonnte WA response: " + result);
        //     }
        //     catch (Exception ex)
        //     {
        //         _logger.LogError("[WATCHDOG] Gagal kirim WA: " + ex.Message);
        //     }
        // }
    }
}