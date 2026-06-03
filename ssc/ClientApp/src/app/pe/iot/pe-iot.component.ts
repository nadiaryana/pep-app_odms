// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { PeIotService, IotReading } from './pe-iot.service';
// import { interval, Subscription } from 'rxjs';

// interface DeviceSummary {
//   wellId: string;
//   status: number;
//   current: number;
//   lastUpdate: string;
// }

// @Component({
//   selector: 'app-pe-iot',
//   templateUrl: './pe-iot.component.html',
//   styleUrls: ['./pe-iot.component.scss']
// })
// export class PeIotComponent implements OnInit, OnDestroy {

//   wells: string[] = [];
//   selectedWell: string = '';
//   chartData: IotReading[] = [];
//   deviceSummaries: DeviceSummary[] = [];

//   // Filter
//   limit: number = 100;
//   fromDate: string = '';
//   toDate: string = '';
//   useRange: boolean = false;

//   isLoading: boolean = false;
//   private refreshSub?: Subscription;

//   constructor(private iotService: PeIotService) {}

//   ngOnInit(): void {
//     this.loadWells();
//     // Auto-refresh setiap 15 detik (sama dengan interval ESP32)
//     this.refreshSub = interval(15000).subscribe(() => {
//       if (this.selectedWell) this.loadChartData();
//       this.loadAllSummaries();
//     });
//   }

//   ngOnDestroy(): void {
//     this.refreshSub?.unsubscribe();
//   }

//   loadWells(): void {
//     this.iotService.getWells().subscribe({
//       next: (wells) => {
//         this.wells = wells;
//         if (wells.length > 0) {
//           this.selectedWell = wells[0];
//           this.loadChartData();
//         }
//         this.loadAllSummaries();
//       },
//       error: (err) => console.error('Gagal load wells:', err)
//     });
//   }

//   loadAllSummaries(): void {
//     this.wells.forEach(wellId => {
//       this.iotService.getLastStatus(wellId).subscribe({
//         next: (res) => {
//           const idx = this.deviceSummaries.findIndex(d => d.wellId === wellId);
//           const summary: DeviceSummary = {
//             wellId,
//             status: res.last_status,
//             current: res.current,
//             lastUpdate: res.recorded_at
//           };
//           if (idx >= 0) {
//             this.deviceSummaries[idx] = summary;
//           } else {
//             this.deviceSummaries.push(summary);
//           }
//         }
//       });
//     });
//   }

//   onWellChange(wellId: string): void {
//     this.selectedWell = wellId;
//     this.loadChartData();
//   }

//   loadChartData(): void {
//     this.isLoading = true;
//     const obs = this.useRange && this.fromDate && this.toDate
//       ? this.iotService.getDataRange(this.selectedWell, this.fromDate, this.toDate)
//       : this.iotService.getData(this.selectedWell, this.limit);

//     obs.subscribe({
//       next: (data) => {
//         // Balik urutan agar chart kiri = lama, kanan = terbaru
//         this.chartData = [...data].reverse();
//         this.isLoading = false;
//       },
//       error: (err) => {
//         console.error('Gagal load chart:', err);
//         this.isLoading = false;
//       }
//     });
//   }

//   applyFilter(): void {
//     this.loadChartData();
//   }

//   // Untuk chart — label waktu
//   get chartLabels(): string[] {
//     return this.chartData.map(d => {
//       const date = new Date(d.created_at);
//       return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
//     });
//   }

//   // Untuk chart — nilai arus
//   get chartValues(): number[] {
//     return this.chartData.map(d => d.current);
//   }

//   getStatusLabel(status: number): string {
//     return status === 1 ? 'ON' : 'OFF';
//   }

//   getStatusClass(status: number): string {
//     return status === 1 ? 'status-on' : 'status-off';
//   }
// }
