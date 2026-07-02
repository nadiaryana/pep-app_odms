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

        // C# 7.3 compatible — tulis tipe lengkap, tidak pakai new()
        private readonly Dictionary<string, bool> _lastKnownOnline = new Dictionary<string, bool>();

        private readonly TimeSpan _offlineThreshold = TimeSpan.FromMinutes(1);
        private readonly TimeSpan _checkInterval = TimeSpan.FromSeconds(30);

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
            _logger.LogInformation("[WATCHDOG] Service berjalan. Threshold offline: 1 menit.");
            await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);

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

                    _logger.LogInformation(
                        "[WATCHDOG] " + wellId +
                        " | Terakhir kirim: " + Math.Round(selisih.TotalSeconds) + "s lalu" +
                        " | " + (isOnline ? "ONLINE" : "OFFLINE"));

                    bool sudahAdaStatus = _lastKnownOnline.ContainsKey(wellId);
                    bool statusBerubah = !sudahAdaStatus || _lastKnownOnline[wellId] != isOnline;

                    if (statusBerubah)
                    {
                        if (!isOnline)
                        {
                            _logger.LogWarning("[WATCHDOG] " + wellId + " OFFLINE!");

                            string msg = "🔴 " + wellId + " Status: OFF\n" +
                                         "⚠ Alat tidak mengirim data\n" +
                                         "⏰ Terakhir aktif: " +
                                         lastSeen.ToLocalTime().ToString("yyyy-MM-dd HH:mm:ss") + " WITA";

                            // await KirimPushover("⚠ " + wellId + " OFFLINE!", msg);
                        }
                        else
                        {
                            // Hanya kirim notif ON kalau sebelumnya memang pernah offline
                            // (bukan saat pertama kali startup)
                            if (sudahAdaStatus && !_lastKnownOnline[wellId])
                            {
                                _logger.LogInformation("[WATCHDOG] " + wellId + " kembali ONLINE!");

                                string msg = "✅ " + wellId + " Status: ON\n" +
                                             "⚡ Arus: " + last.Current.ToString("F2") + " A\n" +
                                             "⏰ Kembali online: " +
                                             DateTime.UtcNow.ToLocalTime().ToString("yyyy-MM-dd HH:mm:ss") + " WITA";

                                // await KirimPushover("✅ " + wellId + " Kembali Online!", msg);
                            }
                        }

                        _lastKnownOnline[wellId] = isOnline;
                    }
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