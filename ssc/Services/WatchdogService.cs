using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using ssc.Services;
using System;
using System.Net.Http;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace ssc.Services
{
    public class WatchdogService : BackgroundService
    {
        private readonly ArusService _arusService;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<WatchdogService> _logger;

        private readonly Dictionary<string, bool> _lastOnlineStatus = new Dictionary<string, bool>();

        private readonly Dictionary<string, int> _lastArusStatus = new Dictionary<string, int>();

        private readonly TimeSpan _offlineThreshold = TimeSpan.FromMinutes(2);

        private readonly TimeSpan _checkInterval = TimeSpan.FromSeconds(15);

        private const string PushoverToken = "ai2ce22rg828o1q1r5n6v6afp9vd1d";
        private const string PushoverUserKey = "ujjtrrauiqqqn84skaitcxwfsayqwt";

        public WatchdogService(
            ArusService arusService,
            IHttpClientFactory httpClientFactory,
            ILogger<WatchdogService> logger)
        {
            _arusService = arusService;
            _httpClientFactory = httpClientFactory;
            _logger = logger;
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

                foreach (var wellId in wells)
                {
                    var last = await _arusService.GetLastReadingAsync(wellId);
                    if (last == null || last.CreatedAt == null) continue;

                    DateTime lastSeen = last.CreatedAt.Value;
                    TimeSpan selisih = DateTime.UtcNow - lastSeen;
                    bool isOnline = selisih <= _offlineThreshold;
                    int arusStatus = last.Status; // 1=ON, 0=OFF

                    bool sudahAdaOnlineStatus = _lastOnlineStatus.ContainsKey(wellId);
                    bool sudahAdaArusStatus = _lastArusStatus.ContainsKey(wellId);

                    int lastArus = sudahAdaArusStatus ? _lastArusStatus[wellId] : -1;
                    bool lastOnline = sudahAdaOnlineStatus ? _lastOnlineStatus[wellId] : false;

                    _logger.LogInformation(
                        "[WATCHDOG] " + wellId +
                        " | " + Math.Round(selisih.TotalSeconds) + "s lalu" +
                        " | Koneksi: " + (isOnline ? "ONLINE" : "OFFLINE") +
                        " | Arus status: " + arusStatus);


                    if (!isOnline)
                    {
                        if (lastOnline || !sudahAdaOnlineStatus)
                        {
                            _logger.LogWarning("[WATCHDOG] " + wellId + " OFFLINE!");

                            string msg = "🔴 " + wellId + " OFFLINE\n" +
                                         "⚠ Alat tidak mengirim data > 2 menit\n" +
                                         "⏰ Terakhir aktif: " +
                                         lastSeen.ToLocalTime().ToString("yyyy-MM-dd HH:mm:ss") + " WITA";

                            await KirimPushover("Status IoT", msg);
                        }

                        _lastOnlineStatus[wellId] = false;
                        // Reset arus status ke -1 saat offline
                        _lastArusStatus[wellId] = -1;
                        continue;
                    }

                    // Alat baru nyala lagi setelah offline
                    bool baruNyalaLagiSetelahOffline = sudahAdaOnlineStatus && !lastOnline;

                    if (arusStatus == 1)
                    {
                        // ── Arus ON ──
                        bool kirimOn = !sudahAdaArusStatus ||
                                       baruNyalaLagiSetelahOffline ||
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
                        bool kirimOff = !sudahAdaArusStatus ||
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

                    // Update status
                    _lastOnlineStatus[wellId] = true;
                    _lastArusStatus[wellId] = arusStatus;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("[WATCHDOG] Error: " + ex.Message);
            }
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
    }
}