# Analisa Error 502 pada Fitur Upload Daily

**File terkait:**

- Frontend : `ssc/ClientApp/src/app/pe/daily/pe-daily-add.component.ts`
- Backend : `ssc/Areas/PE/Controllers/DailyController.cs`
- Startup : `ssc/Startup.cs` vs `prod_conf/Startup.cs`
- Config : `ssc/web.config`, `ssc/appsettings.json`

---

## Alur Upload (Normal Flow)

```
User pilih file Excel
  → Angular POST /api/pe/daily/UploadFiles  (multipart/form-data)
    → DailyController.Post(files)
      → Simpan file ke Path.GetTempPath()
      → Insert DailyTmp { status: "processing" } ke MongoDB
      → QueueBackgroundWorkItem(ProcessExcel)   ← background thread
      → Immediately return 200 { _id, status: "processing" }
  ← Angular terima _id, mulai polling setiap 2 detik ke /api/pe/daily/UploadStatus
    → Background thread: ProcessExcel selesai → update DailyTmp status: "done"
  ← Polling detect "done" → lanjut ke step berikutnya
```

---

## PENYEBAB ERROR 502

### ✅ PENYEBAB UTAMA #1 — `[DisableRequestSizeLimit]` tidak ada di endpoint UploadFiles

**Lokasi:** `DailyController.cs` baris 767–769

```csharp
[Authorize("PeDaily Add")]
[HttpPost("UploadFiles")]
public async Task<IActionResult> Post(List<IFormFile> files)   // ← tidak ada DisableRequestSizeLimit
```

**Bukti:** Controller lain di proyek yang sama SUDAH pakai atribut ini:

- `SumurController.cs` baris 296: `[HttpPost("UploadFiles"), DisableRequestSizeLimit]`
- `UploadController.cs` baris 30 : `[HttpPost, DisableRequestSizeLimit]`
- `UploadPDFController.cs` baris 29: `[HttpPost, DisableRequestSizeLimit]`

**Dampak:**

- ASP.NET Core + Kestrel memiliki batas default **30 MB** untuk request body.
- IIS (sebagai reverse proxy ke Kestrel) juga memiliki batas default **30 MB** (`maxAllowedContentLength`).
- Jika file Excel melebihi batas ini, Kestrel akan **membatalkan koneksi** di tengah transfer.
- IIS yang tidak mendapat respons valid dari Kestrel mengembalikan **502 Bad Gateway**.

**Fix:**

```csharp
[Authorize("PeDaily Add")]
[HttpPost("UploadFiles")]
[DisableRequestSizeLimit]
[RequestFormLimits(MultipartBodyLengthLimit = long.MaxValue)]
public async Task<IActionResult> Post(List<IFormFile> files)
```

---

### ✅ PENYEBAB UTAMA #2 — `web.config` tidak punya override `maxAllowedContentLength`

**Lokasi:** `ssc/web.config`

```xml
<aspNetCore processPath="%LAUNCHER_PATH%" arguments="%LAUNCHER_ARGS%"
            stdoutLogEnabled="true" stdoutLogFile=".\logs\stdout" />
```

Tidak ada konfigurasi `<requestLimits>`.

**Dampak:**

- IIS menolak request di atas 30 MB **sebelum** sampai ke Kestrel.
- Hasilnya adalah 413 (Request Too Large) dari IIS, atau **502** jika dikombinasikan dengan `AspNetCoreModule` V1.

**Fix:** Tambahkan di `web.config`:

```xml
<aspNetCore processPath="%LAUNCHER_PATH%" arguments="%LAUNCHER_ARGS%"
            stdoutLogEnabled="true" stdoutLogFile=".\logs\stdout">
  <handlerSettings>
    <handlerSetting name="requestTimeout" value="00:10:00" />
  </handlerSettings>
</aspNetCore>
```

Dan tambahkan di dalam `<system.webServer>`:

```xml
<security>
  <requestFiltering>
    <requestLimits maxAllowedContentLength="104857600" />  <!-- 100 MB -->
  </requestFiltering>
</security>
```

---

### ✅ PENYEBAB UTAMA #3 — `web.config` menggunakan `AspNetCoreModule` V1 (lama)

**Lokasi:** `ssc/web.config` baris 5

```xml
<add name="aspNetCore" path="*" verb="*" modules="AspNetCoreModule" ... />
```

**Dampak:**

- `AspNetCoreModule` (V1) memiliki bug dan keterbatasan pada penanganan streaming request besar.
- **V2** (`AspNetCoreModuleV2`) jauh lebih stabil untuk upload file.
- V1 bisa menyebabkan connection drop yang tampak sebagai **502**.

**Fix:**

```xml
<add name="aspNetCore" path="*" verb="*" modules="AspNetCoreModuleV2" resourceType="Unspecified" />
```

---

### ⚠️ PENYEBAB KRITIS #4 — `prod_conf/Startup.cs` TIDAK mendaftarkan `IBackgroundTaskQueue`

**Lokasi:** `prod_conf/Startup.cs` (berbeda dengan `ssc/Startup.cs`)

`ssc/Startup.cs` baris 54–57 (BENAR):

```csharp
// Register Background Task Queue and Hosted Service
services.AddSingleton<IBackgroundTaskQueue, BackgroundTaskQueue>();
services.AddHostedService<QueuedHostedService>();
```

`prod_conf/Startup.cs` — **TIDAK ADA** registrasi ini sama sekali.

**Dampak:**

- `DailyController` membutuhkan `IBackgroundTaskQueue` di constructor-nya:
  ```csharp
  public DailyController(IPEDatabaseSettings settings, IBackgroundTaskQueue taskQueue)
  ```
- Jika deployment production menggunakan `prod_conf/Startup.cs`, saat ada request ke **endpoint manapun** di `DailyController` (bukan hanya upload), .NET DI container akan melempar:
  ```
  InvalidOperationException: Unable to resolve service for type 'IBackgroundTaskQueue'
  ```
- Ini menyebabkan **seluruh DailyController** crash → 500/502 untuk semua request.

**Fix:** Tambahkan ke `prod_conf/Startup.cs`:

```csharp
services.AddSingleton<IBackgroundTaskQueue, BackgroundTaskQueue>();
services.AddHostedService<QueuedHostedService>();
```

---

### ⚠️ RISIKO #5 — MongoDB document size limit 16 MB terlampaui

**Lokasi:** `DailyController.cs` — fungsi `ProcessExcel`, bagian akhir

```csharp
DailyCommon._daily_tmp.UpdateOne(
    t => t._id == tmpId,
    Builders<DailyTmp>.Update
        .Set(t => t.items, items.ToArray())   // ← semua row tersimpan dalam 1 dokumen
        ...
);
```

**Dampak:**

- MongoDB memiliki batas **16 MB per dokumen**.
- Jika Excel berisi banyak baris (ratusan/ribuan), array `items` bisa melebihi 16 MB.
- `MongoException` akan dilempar di background thread, status diset ke `"failed"`.
- Tidak menyebabkan 502 secara langsung, tetapi upload akan selalu gagal untuk file besar.

**Fix:** Simpan items dalam koleksi terpisah atau gunakan pagination saat menyimpan ke `daily_tmp`.

---

### ⚠️ RISIKO #6 — Izin tulis ke direktori temp di IIS

**Lokasi:** `DailyController.cs` baris 778

```csharp
var filePath = Path.Combine(Path.GetTempPath(), Guid.NewGuid() + Path.GetExtension(files[0].FileName));
```

**Dampak:**

- `Path.GetTempPath()` di IIS biasanya mengarah ke `C:\Windows\Temp`.
- Application Pool identity (misal `IIS APPPOOL\DefaultAppPool`) mungkin tidak punya izin tulis ke sana.
- Akan melempar `UnauthorizedAccessException` saat mencoba membuat file temp → 500/502.

**Fix:** Gunakan direktori yang jelas punya izin, atau konfigurasi izin AppPool ke folder temp:

```csharp
var tempDir = Path.Combine(Directory.GetCurrentDirectory(), "temp");
Directory.CreateDirectory(tempDir);
var filePath = Path.Combine(tempDir, Guid.NewGuid() + Path.GetExtension(files[0].FileName));
```

---

### ℹ️ INFO #7 — JWT issuer berbeda antara `ssc/Startup.cs` dan `prod_conf/Startup.cs`

| File                   | ValidIssuer                | ValidAudience              |
| ---------------------- | -------------------------- | -------------------------- |
| `ssc/Startup.cs`       | `https://localhost:44342/` | `https://localhost:44342/` |
| `prod_conf/Startup.cs` | `https://localhost:1911/`  | `https://localhost:1911/`  |

Jika Startup yang salah digunakan, semua request yang butuh autentikasi akan dikembalikan 401, yang bisa muncul sebagai 502 jika ada proxy di depannya.

---

## Ringkasan & Prioritas Fix

| #   | Masalah                                                       | Dampak                               | Prioritas |
| --- | ------------------------------------------------------------- | ------------------------------------ | --------- |
| 1   | Tidak ada `[DisableRequestSizeLimit]` di `UploadFiles`        | 502 untuk file > 30MB                | 🔴 KRITIS |
| 2   | Tidak ada `maxAllowedContentLength` di `web.config`           | IIS reject file besar                | 🔴 KRITIS |
| 3   | `AspNetCoreModule` V1 di `web.config`                         | Koneksi tidak stabil                 | 🔴 KRITIS |
| 4   | `prod_conf/Startup.cs` tidak daftarkan `IBackgroundTaskQueue` | Semua endpoint DailyController gagal | 🔴 KRITIS |
| 5   | MongoDB 16MB doc limit                                        | Upload file besar gagal              | 🟡 SEDANG |
| 6   | Izin folder temp di IIS                                       | File temp gagal dibuat               | 🟡 SEDANG |
| 7   | JWT issuer mismatch antar config                              | 401 di production                    | 🟡 SEDANG |

---

## Lokasi File untuk Diperbaiki

1. `ssc/Areas/PE/Controllers/DailyController.cs` — tambah `[DisableRequestSizeLimit]` + `[RequestFormLimits]`
2. `ssc/web.config` — tambah `requestLimits` + ganti ke `AspNetCoreModuleV2`
3. `prod_conf/Startup.cs` — tambah registrasi `IBackgroundTaskQueue` + `QueuedHostedService`
4. `DailyController.cs` `ProcessExcel` — perbaiki penanganan file temp dan batas MongoDB
