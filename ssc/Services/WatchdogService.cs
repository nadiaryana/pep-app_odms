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

        // Simpan status koneksi terakhir tiap sumur (true=online, false=offline/belum pernah)
        private readonly Dictionary<string, bool> _lastOnlineStatus = new Dictionary<string, bool>();

        // Simpan status arus terakhir tiap sumur (1=ON, 0=OFF, -1=belum pernah)
        private readonly Dictionary<string, int> _lastArusStatus = new Dictionary<string, int>();

        // Batas waktu offline — lebih dari 2 menit dianggap alat mati
        private readonly TimeSpan _offlineThreshold = TimeSpan.FromMinutes(2);

        // Watchdog cek tiap 30 detik
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
                    int arusStatus = last.Status; // 1=ON, 0=OFF dari ESP32

                    bool sudahAdaOnlineStatus = _lastOnlineStatus.ContainsKey(wellId);
                    bool sudahAdaArusStatus = _lastArusStatus.ContainsKey(wellId);

                    int lastArus = sudahAdaArusStatus ? _lastArusStatus[wellId] : -1;
                    bool lastOnline = sudahAdaOnlineStatus ? _lastOnlineStatus[wellId] : false;

                    _logger.LogInformation(
                        "[WATCHDOG] " + wellId +
                        " | " + Math.Round(selisih.TotalSeconds) + "s lalu" +
                        " | Koneksi: " + (isOnline ? "ONLINE" : "OFFLINE") +
                        " | Arus status: " + arusStatus);

                    // ─────────────────────────────────────────────────────
                    // KASUS 1: Alat OFFLINE (tidak kirim data > 2 menit)
                    // ─────────────────────────────────────────────────────
                    if (!isOnline)
                    {
                        // Kirim notif OFF hanya kalau sebelumnya masih online
                        if (lastOnline || !sudahAdaOnlineStatus)
                        {
                            _logger.LogWarning("[WATCHDOG] " + wellId + " OFFLINE!");

                            string msg = "🔴 " + wellId + " OFFLINE\n" +
                                         "⚠ Alat tidak mengirim data > 2 menit\n" +
                                         "⏰ Terakhir aktif: " +
                                         lastSeen.ToLocalTime().ToString("yyyy-MM-dd HH:mm:ss") + " WITA";

                            await KirimPushover("🔴 " + wellId + " OFFLINE!", msg);
                        }

                        _lastOnlineStatus[wellId] = false;
                        // Reset arus status ke -1 saat offline
                        // biar saat online lagi bisa trigger notif ON
                        _lastArusStatus[wellId] = -1;
                        continue; // skip cek arus kalau offline
                    }

                    // ─────────────────────────────────────────────────────
                    // KASUS 2: Alat ONLINE — cek perubahan status arus
                    // ─────────────────────────────────────────────────────

                    // Alat baru nyala lagi setelah offline
                    bool baruNyalaLagiSetelahOffline = sudahAdaOnlineStatus && !lastOnline;

                    if (arusStatus == 1)
                    {
                        // ── ARUS ON ──
                        // Kirim notif ON kalau:
                        // 1. Pertama kali alat colok (belum ada status sebelumnya)
                        // 2. Baru nyala lagi setelah offline
                        // 3. Arus sebelumnya adalah OFF (0)
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

                            await KirimPushover("✅ " + wellId + " ON!", msg);
                        }
                    }
                    else
                    {
                        // ── ARUS OFF (arus < 1, pompa mati tapi alat masih hidup) ──
                        // Kirim notif OFF kalau:
                        // 1. Pertama kali alat colok dan langsung OFF
                        // 2. Arus sebelumnya adalah ON (1)
                        bool kirimOff = !sudahAdaArusStatus ||
                                        lastArus == 1 ||
                                        lastArus == -1;

                        if (kirimOff)
                        {
                            _logger.LogInformation("[WATCHDOG] " + wellId + " OFF (arus rendah)!");

                            string msg = "⚠ " + wellId + " Status: OFF\n" +
                                         "⚡ Arus: " + last.Current.ToString("F2") + " A\n" +
                                         "⏰ " + DateTime.UtcNow.ToLocalTime().ToString("yyyy-MM-dd HH:mm:ss") + " WITA";

                            await KirimPushover("⚠ " + wellId + " OFF", msg);
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