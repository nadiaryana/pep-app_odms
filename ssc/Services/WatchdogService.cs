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

        // Simpan status terakhir tiap sumur biar tau kapan berubah
        private readonly Dictionary<string, int> _lastKnownStatus = new();

        // Batas waktu — kalau lebih dari ini dianggap offline
        private readonly TimeSpan _offlineThreshold = TimeSpan.FromMinutes(2);

        // Interval cek — tiap 1 menit
        private readonly TimeSpan _checkInterval = TimeSpan.FromMinutes(1);

        // Pushover config — samakan dengan di ESP32
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
            _logger.LogInformation("Watchdog service berjalan...");

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
                // Ambil semua well ID
                var wells = await _arusService.GetAllWellIdsAsync();

                foreach (var wellId in wells)
                {
                    var last = await _arusService.GetLastReadingAsync(wellId);
                    if (last == null) continue;

                    var lastSeen = last.CreatedAt ?? DateTime.MinValue;
                    var selisih = DateTime.UtcNow - lastSeen;

                    if (selisih > _offlineThreshold)
                    {
                        // Alat offline — cek apakah sudah pernah notif atau belum
                        if (!_lastKnownStatus.ContainsKey(wellId) || _lastKnownStatus[wellId] != -1)
                        {
                            _logger.LogWarning($"[WATCHDOG] {wellId} offline! Terakhir kirim: {lastSeen}");

                            var msg = $"🔴 {wellId} OFF!\n" +
                                      $"⚠ Tidak ada data sejak {Math.Round(selisih.TotalMinutes)} menit lalu\n" +
                                      $"⏰ Terakhir aktif: {lastSeen.ToLocalTime():yyyy-MM-dd HH:mm:ss} WITA";

                            // await KirimPushover("⚠ Alat IoT Offline!", msg);
                            _lastKnownStatus[wellId] = -1; // -1 = offline
                        }
                    }
                    else
                    {
                        // Alat online — kalau sebelumnya offline, kirim notif ON
                        if (_lastKnownStatus.ContainsKey(wellId) && _lastKnownStatus[wellId] == -1)
                        {
                            _logger.LogInformation($"[WATCHDOG] {wellId} kembali online!");

                            var msg = $"✅ {wellId} Kembali ON!\n" +
                                      $"⚡ Arus: {last.Current:F2} A\n" +
                                      $"⏰ Time: {DateTime.UtcNow.ToLocalTime():yyyy-MM-dd HH:mm:ss} WITA";

                            // await KirimPushover("✅ Alat IoT Online", msg);
                        }

                        _lastKnownStatus[wellId] = last.Status;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"[WATCHDOG] Error: {ex.Message}");
            }
        }

        private async Task KirimPushover(string title, string message)
        {
            try
            {
                var client = _httpClientFactory.CreateClient();
                var content = new FormUrlEncodedContent(new[]
                {
                    new KeyValuePair<string, string>("token",   PushoverToken),
                    new KeyValuePair<string, string>("user",    PushoverUserKey),
                    new KeyValuePair<string, string>("title",   title),
                    new KeyValuePair<string, string>("message", message),
                });

                var response = await client.PostAsync(
                    "https://api.pushover.net/1/messages.json", content);

                _logger.LogInformation($"[WATCHDOG] Pushover: {response.StatusCode}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"[WATCHDOG] Gagal kirim Pushover: {ex.Message}");
            }
        }
    }
}