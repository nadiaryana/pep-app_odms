import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { TitleService } from 'src/app/navigation/title/title.service';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { PePermissionService } from '../pe-permission.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatSnackBar, MatPaginator, MatTableDataSource } from '@angular/material';
import { SnackbarApi, SnackbarService } from 'src/app/snackbar.service';
import { xFilterService } from 'src/app/xfilter/xfilter.component';
import { CommonService } from 'src/app/common.service';
import { merge, of as observableOf, Subscription } from 'rxjs';
import { startWith, switchMap, catchError, map } from 'rxjs/operators';


export interface Sumur {
  wellName: string;
  lat: string;
  lng: string;
  status: string;
  station: string;
  stationLat?: string;  // Latitude station dari table station
  stationLng?: string;  // Longitude station dari table station
}

export interface StationNode {
  name: string;
  lat: number;   // Decimal degree
  lng: number;   // Decimal degree
  wells: Sumur[];  // List of sumur yang terhubung ke station ini
}

@Component({
  selector: 'app-map-sumur',
  templateUrl: './pe-map-sumur.component.html',
  styleUrls: ['./pe-map-sumur.component.scss'],
})
export class MapSumurComponent implements OnInit, AfterViewInit, OnDestroy {

  map: L.Map | null = null;
  isLoading = true;
  showFlowlines = true;

  displayedColumns: string[] = ['wellName', 'lat', 'lng', 'status','station','actions'];

  stationCoordinates: { [key: string]: { lat: number; lng: number } } = {
    'GS-1': { lat: 0.458472, lng: 117.508200 },  
    'GS-2': { lat: 0.481794, lng: 117.505936 },
    'GS-3': { lat: 0.441436, lng: 117.506447 },
    'GS-4': { lat: 0.466297, lng: 117.517033 },
    'GS-5': { lat: 0.447578, lng: 117.517725 },
    'GS-6': { lat: 0.433383, lng: 117.517831 },
  };

  sumurList: Sumur[] = [];
  dataSource = new MatTableDataSource<Sumur>();
  
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  
  wellName_xSelected = [];
  status_xSelected = [];
  filterSubscription: Subscription;
  selectedSubscription: Subscription;
  listSubscription: Subscription;

  
  statusColors: { [key: string]: string } = {
    'produksi':          '#00B050',
    'off produksi':      '#92D050',
    'mati':              '#FF0000',
    'injeksi':           '#366092',
    'suspended':         '#ffff00',
    'kering':            '#25310e',
    'abandoned':         '#000000',

  };

  private svgOverlay: SVGElement | null = null;
  private flowlinePaths: SVGPathElement[] = [];
  private stationMarkers: L.Marker[] = [];
  
  constructor(
    private titleService: TitleService,
    private http: HttpClient,
    public pePermissionService: PePermissionService,
    private router: Router,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public snackbarService: SnackbarService,
    private route: ActivatedRoute,
    private xfilterService: xFilterService,
    public commonService: CommonService,

  ) {}

  ngOnInit(): void {
    this.titleService.titleSource.next({
      title: 'Map Sumur',
      icon: 'map',
      breadcrumbs: [],
    });

    this.fixLeafletDefaultIcon();
    this.loadSumurFromAPI();
    
    this.filterSubscription = this.xfilterService.filter.subscribe(res => {
      if(res && res.column) this.getColumnValues(res);
    })
    this.selectedSubscription = this.xfilterService.selected.subscribe(res => {
      // @ts-ignore
      this[res["column"] + "_xSelected"] = res["selected"];
    })
    
    this.listSubscription = merge(
      this.paginator.page, 
      this.xfilterService.selected,
    ).pipe(
      startWith({}),
      switchMap(() => {
        var columnfilter = this.getColumnFilter();
        return observableOf(this.applyFilters(columnfilter));
      }),
      map(data => {
        this.dataSource.data = data;
        // Update marker visibility based on filtered data
        this.updateMarkersVisibility(data);
        this.redrawFlowlines(data);
        return data;
      }),
      catchError(() => {
        return observableOf([]);
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    if (this.filterSubscription) this.filterSubscription.unsubscribe();
    if (this.selectedSubscription) this.selectedSubscription.unsubscribe();
    if (this.listSubscription) this.listSubscription.unsubscribe();
    if (this.map) {
      this.markers = [];
      this.selectedMarker = null;
      this.markerStatusMap.clear();
      this.flowlinePolylines.forEach(l => l.remove());
      this.flowlinePolylines = [];
      this.stationMarkers.forEach(m => m.remove())
      this.stationMarkers = [];
      this.map.remove();
      this.map = null;
    }
  }

  passPermission(path:String) {
    return this.pePermissionService.passPermission(path);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initMap();

      setTimeout(() => {
        if (this.map) {
          this.map.invalidateSize();
          this.isLoading = false;
        }
      }, 300);
    }, 0);
  }

  
  toggleFlowlines(): void {
    this.showFlowlines = !this.showFlowlines;
    if (this.svgOverlay) {
      this.svgOverlay.style.display = this.showFlowlines ? '' : 'none';
    }
    // Station marker juga disembunyikan/ditampilkan bersama flowline
    this.stationMarkers.forEach(m => {
      if (this.showFlowlines) {
        if (!this.map!.hasLayer(m)) m.addTo(this.map!);
      } else {
        if (this.map!.hasLayer(m)) m.removeFrom(this.map!);
      }
    });
  }

  // Load data sumur dari API backend
  private loadSumurFromAPI(): void {
    this.http.get<any>('/api/pe/map', {
      params: {
        page: '0',
        pagesize: '10000',
        sort: 'wellName',
        order: 'asc'
      }
    }).subscribe(
      (response) => {
        if (response && response.items) {
          // Transform data dari API ke format Sumur interface
          this.sumurList = response.items.map((item: any) => {
            return {
              wellName: item.wellName || '',
              lat: item.lat || '',
              lng: item.lng || '',
              status: item.status || '',
              station: item.station || '',
              stationLat: item.stationLat || '',
              stationLng: item.stationLng || '',
            };
          });
          console.log('[MapSumur] Loaded', this.sumurList.length, 'sumur from API');
          
          // Set dataSource untuk pagination
          this.dataSource.data = this.sumurList;
          setTimeout(() => {
            if (this.paginator) {
              this.dataSource.paginator = this.paginator;
            }
          }, 0);
          
          // Reload markers setelah data berhasil diloading
          // if (this.map) {
          //   this.loadMarkers();
          //   this.redrawFlowlines(this.sumurList); 
          // }
        }
      },
      (error) => {
        console.error('[MapSumur] Error loading sumur:', error);
        this.snackbarService.status.next(new SnackbarApi(true, 'Gagal mengambil data sumur', 'dismiss'));
      }
    );
  }

  
  private fixLeafletDefaultIcon(): void {
    delete (L.Icon.Default.prototype as any)._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconUrl: 'assets/leaflet/marker-icon.png',
      iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
      shadowUrl: 'assets/leaflet/marker-shadow.png',
    });
  }

  private initMap(): void {
    if (this.map) return;

    // Jika ada data sumur, gunakan data pertama sebagai center; kalau tidak, gunakan default
    let centerLat = this.dmsToDecimal('N 0° 27\' 37.433"');
    let centerLng = this.dmsToDecimal('E 117° 31\' 24.826"');
    
    if (this.sumurList && this.sumurList.length > 0) {
      const firstSumur = this.sumurList[0];
      if (firstSumur.lat && firstSumur.lng) {
        centerLat = this.dmsToDecimal(firstSumur.lat);
        centerLng = this.dmsToDecimal(firstSumur.lng);
      }
    }

    this.map = L.map('map', {
      center: [centerLat, centerLng],
      zoom: 13,
      zoomControl: true,
      attributionControl: true,
    });

    // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    //   maxZoom: 19,

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri',
      maxZoom: 18,
    }).addTo(this.map);

    const svgLayer = L.svg().addTo(this.map);
    this.svgOverlay = (svgLayer as any)._container as SVGElement;
    this.svgOverlay.style.pointerEvents = 'none';
    this.svgOverlay.style.overflow = 'visible';

    // this.injectFlowlineAnimation();

    // Gambar ulang path setiap kali peta digeser / di-zoom
    this.map.on('moveend zoomend viewreset', () => {
      this.redrawFlowlines(this.dataSource.data);
    });
  }

  private markers: L.Marker[] = [];
  private markerMap = new Map<string, L.Marker>(); 
  private markerStatusMap = new Map<L.Marker, string>(); 
  private selectedMarker: L.Marker | null = null; 

  private loadMarkers(): void {
    if (!this.map) return;

    this.sumurList.forEach((sumur) => {
      // Skip marker jika lat atau lng kosong
      if (!sumur.lat || !sumur.lng) {
        return;
      }

      const lat = this.dmsToDecimal(sumur.lat);
      const lng = this.dmsToDecimal(sumur.lng);

      const statusColor = this.getStatusColor(sumur.status);
      const icon = L.divIcon({
        html: `
          <div style="
            background-color: ${statusColor};
            width: 18px;
            height: 18px;
            border-radius: 50%;
            border: 2.5px solid ${statusColor};
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          "></div>
        `,
        className: '',
        iconSize: [18, 18],
        iconAnchor: [9, 9],
        popupAnchor: [0, -12],
      });

      const marker = L.marker([lat, lng], { icon })
        .addTo(this.map!)
        .bindPopup(`
          <b>${sumur.wellName}</b>
          Status: <span style="color: ${this.getStatusColor(sumur.status)}">${sumur.status}</span>
          <br> Station: ${sumur.station}

        `);
      
        marker.on('click', () => {
      this.highlightMarker(marker);
    });

    this.markerMap.set(sumur.wellName, marker);
    this.markerStatusMap.set(marker, sumur.status);
    this.markers.push(marker);
    });
  }

  private createIcon(type: 'default' | 'selected', status?: string): L.DivIcon {
    const isSelected = type === 'selected';
    const statusColor = isSelected && status ? this.getStatusColor(status) : '#1976d2';
    // const borderColor = isSelected && status ? this.getDarkerColor(statusColor) : '#0d47a1';
    
    return L.divIcon({
      html: `
        <div style="
          background-color: ${isSelected ? statusColor : '#1976d2'};
          width: ${isSelected ? '24px' : '18px'};
          height: ${isSelected ? '24px' : '18px'};
          border-radius: 50%;
          border: 2.5px solid ${isSelected ? statusColor : '#0d47a1'};
          box-shadow: ${isSelected ? `0 0 0 4px ${statusColor}33` : '0 2px 6px rgba(0,0,0,0.3)'};
          transition: all 0.2s ease;
        "></div>
      `,
      className: '',

      // Ukuran icon: [width, height] 
      iconSize: isSelected ? [24, 24] : [18, 18],
      // Anchor point (titik pusat dari icon)
      iconAnchor: isSelected ? [12, 12] : [9, 9],
      // Offset popup: muncul 12px ke atas dari center icon
      popupAnchor: [0, -12],
    });
  }

  private highlightMarker(marker: L.Marker): void {
    const status = this.markerStatusMap.get(marker);
    
    // Reset marker sebelumnya ke default
    if (this.selectedMarker && this.selectedMarker !== marker) {
      this.selectedMarker.setIcon(this.createIcon('default'));
    }
    // Set marker baru ke selected dengan status color
    marker.setIcon(this.createIcon('selected', status));
    this.selectedMarker = marker;
  }

  // private injectFlowlineAnimation(): void {
  //   if (document.getElementById('flowline-style')) return; // sudah ada
  //   const style = document.createElement('style');
  //   style.id = 'flowline-style';
  //   style.textContent = `
  //     @keyframes flowDash {
  //       to { stroke-dashoffset: -24; }
  //     }
  //     .flowline-path {
  //       animation: flowDash 0.9s linear infinite;
  //     }
  //   `;
  //   document.head.appendChild(style);
  // }

  //grup sumur sesuai stationnya
  private buildStationNodes(sumurData: Sumur[]): StationNode[] {
    const stationMap = new Map<string, StationNode>();

    sumurData.forEach(sumur => {
      // Abaikan sumur tanpa nama station
      if (!sumur.station) return;

      // Ambil koordinat station dari mapping
      const stationCoord = this.stationCoordinates[sumur.station];
      if (!stationCoord) {
        console.warn(`[MapSumur] Station '${sumur.station}' tidak ada di stationCoordinates mapping`);
        return;
      }

      if (!stationMap.has(sumur.station)) {
        stationMap.set(sumur.station, {
          name: sumur.station,
          lat: stationCoord.lat,
          lng: stationCoord.lng,
          wells: [],
        });
      }
      stationMap.get(sumur.station)!.wells.push(sumur);
    });

    return Array.from(stationMap.values());
  }

  // private createGradient(
  //   svgNS: string,
  //   id: string,
  //   fromPt: L.Point,
  //   toPt: L.Point
  // ): SVGLinearGradientElement {
  //   const grad = document.createElementNS(svgNS, 'linearGradient') as SVGLinearGradientElement;
  //   grad.setAttribute('id', id);
  //   grad.setAttribute('gradientUnits', 'userSpaceOnUse');
  //   grad.setAttribute('x1', String(fromPt.x));
  //   grad.setAttribute('y1', String(fromPt.y));
  //   grad.setAttribute('x2', String(toPt.x));
  //   grad.setAttribute('y2', String(toPt.y));

  //   const stop1 = document.createElementNS(svgNS, 'stop') as SVGStopElement;
  //   stop1.setAttribute('offset', '0%');
  //   stop1.setAttribute('stop-color', '#6ab1f7'); 
  //   stop1.setAttribute('stop-opacity', '0.9');

  //   const stop2 = document.createElementNS(svgNS, 'stop') as SVGStopElement;
  //   stop2.setAttribute('offset', '100%');
  //   stop2.setAttribute('stop-color', '#f4a169'); 
  //   stop2.setAttribute('stop-opacity', '1');

  //   grad.appendChild(stop1);
  //   grad.appendChild(stop2);
  //   return grad;
  // }

  // menghitung titik kontrol bezier untuk flowing bisa melengkung
  private bezierControl(from: L.Point, to: L.Point): { cx: number; cy: number } {
    return {
      cx: (from.x + to.x) / 2 - (to.y - from.y) * 0.18,
      cy: (from.y + to.y) / 2 + (to.x - from.x) * 0.18,
    };
  }

  private clearFlowlines(): void {
    this.flowlinePaths = [];

    if (this.svgOverlay) {
      while (this.svgOverlay.firstChild) {
        this.svgOverlay.removeChild(this.svgOverlay.firstChild);
      }
    }

    // Hapus marker station dari peta
    this.stationMarkers.forEach(m => {
      if (this.map && this.map.hasLayer(m)) m.removeFrom(this.map);
    });
    this.stationMarkers = [];
  }

  // private redrawFlowlines(sumurData: Sumur[]): void {
  //   if (!this.map || !this.svgOverlay) return;

  //   this.clearFlowlines();

  //   if (!this.showFlowlines) return;

  //   const svgNS = 'http://www.w3.org/2000/svg';
  //   const stations = this.buildStationNodes(sumurData);

  //   // Satu <defs> untuk menampung semua gradient
  //   // const defs = document.createElementNS(svgNS, 'defs');
  //   // this.svgOverlay.appendChild(defs);

  //   let pathIndex = 0;

  //   stations.forEach(station => {

  //     const stIcon = L.divIcon({
  //       html: `
  //         <div style="
  //           width: 20px; height: 20px;
  //           background: #6f4428;
  //           border: 1px solid #fff;
  //           border-radius: 4px;
  //           box-shadow: 0 2px 6px rgba(0,0,0,0.45);
  //           display: flex; align-items: center; justify-content: center;
  //         ">
  //           <svg width="10" height="10" viewBox="0 0 10 10">
  //             <rect x="1" y="4" width="8" height="5" fill="white"/>
  //             <polygon points="5,0 0,5 10,5" fill="white"/>
  //           </svg>
  //         </div>`,
  //       iconSize: [20, 20],
  //       iconAnchor: [10, 10],
  //       className: '',
  //     });

  //     const stMarker = L.marker([station.lat, station.lng], { icon: stIcon, zIndexOffset: 500 })
  //       .addTo(this.map!)
  //       .bindPopup(`
  //         <b>${station.name}</b><br>
  //         Jumlah sumur terhubung: ${station.wells.length}
  //       `);
  //     this.stationMarkers.push(stMarker);

  //     //flowline dari station ke sumur
  //     station.wells.forEach((sumur, wIdx) => {
  //       if (!sumur.lat || !sumur.lng) return;

  //       const fromLatLng = L.latLng(
  //         this.dmsToDecimal(sumur.lat),
  //         this.dmsToDecimal(sumur.lng)
  //       );
  //       const toLatLng = L.latLng(station.lat, station.lng);

  //       // Konversi ke koordinat piksel layer (bukan piksel layar)
  //       const fromPt = this.map!.latLngToLayerPoint(fromLatLng);
  //       const toPt   = this.map!.latLngToLayerPoint(toLatLng);

  //       // Gradient unik per garis
  //       // const gradId = `fl-grad-${pathIndex}`;
  //       // const gradient = this.createGradient(svgNS, gradId, fromPt, toPt);
  //       // defs.appendChild(gradient);

  //       // Bezier quadratic path
  //       const { cx, cy } = this.bezierControl(fromPt, toPt);
  //       const path = document.createElementNS(svgNS, 'path') as SVGPathElement;
  //       path.setAttribute('d', `M${fromPt.x},${fromPt.y} Q${cx},${cy} ${toPt.x},${toPt.y}`);
  //       path.setAttribute('stroke', `#F7C85C`);
  //       path.setAttribute('stroke-width', '2.5');
  //       path.setAttribute('fill', 'none');
  //       path.setAttribute('stroke-dasharray', '8 6');
  //       path.setAttribute('stroke-linecap', 'round');
  //       path.setAttribute('opacity', '0.85');
  //       // Delay animasi sedikit berbeda tiap garis agar tidak semua bergerak serentak
  //       path.style.animationDelay = `${(pathIndex % 12) * 0.075}s`;
  //       path.classList.add('flowline-path');

  //       this.svgOverlay!.appendChild(path);
  //       this.flowlinePaths.push(path);
  //       pathIndex++;
  //     });
  //   });
  // }

  private flowlinePolylines: L.Polyline[] = [];

  private redrawFlowlines(sumurData: Sumur[]): void {
      if (!this.map) return;

      // Hapus garis lama
      this.flowlinePolylines.forEach(line => this.map!.removeLayer(line));
      this.flowlinePolylines = [];

      this.stationMarkers.forEach(m => this.map!.removeLayer(m));
      this.stationMarkers = [];

      if (!this.showFlowlines) return;

      const stations = this.buildStationNodes(sumurData);

      stations.forEach(station => {

        const stIcon = L.divIcon({
          html: `
            <div style="
              width: 20px; height: 20px;
              background: #6f4428;
              border: 1px solid #fff;
              border-radius: 4px;
              box-shadow: 0 2px 6px rgba(0,0,0,0.45);
              display: flex; align-items: center; justify-content: center;
            ">
              <svg width="10" height="10" viewBox="0 0 10 10">
                <rect x="1" y="4" width="8" height="5" fill="white"/>
                <polygon points="5,0 0,5 10,5" fill="white"/>
              </svg>
            </div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
          className: '',
        });

        const stMarker = L.marker([station.lat, station.lng], { icon: stIcon, zIndexOffset: 500 })
          .addTo(this.map!)
          .bindPopup(`
            <b>${station.name}</b><br>
            Jumlah sumur terhubung: ${station.wells.length}
          `);

        this.stationMarkers.push(stMarker);

        station.wells.forEach(sumur => {
          if (!sumur.lat || !sumur.lng) return;

          const fromLatLng = L.latLng(
            this.dmsToDecimal(sumur.lat),
            this.dmsToDecimal(sumur.lng)
          );

          const toLatLng = L.latLng(station.lat, station.lng);

          const line = L.polyline([fromLatLng, toLatLng], {
            color: '#F7C85C',
            weight: 2.5,
            opacity: 0.85,
            dashArray: '8 6'
          }).addTo(this.map!);

          this.flowlinePolylines.push(line);
        });
      });
  }
  // Filter methods
  getColumnValues(param: any) {
    const column = param["column"];
    const filter = param["filter"];
    const clear  = param["clear"];

    if (!column || !this.sumurList || this.sumurList.length === 0) return;

    if (clear) {
      this[column + "_xSelected"] = [];
    }

    // Ambil filter existing dari state, tanpa kolom yang sedang di-query
    let columnfilter: any = this.getColumnFilter();
    delete columnfilter[column];

    // Terapkan filter yang ada
    let filteredData = this.applyFilters(columnfilter);

    // Ekstrak unique values untuk kolom, terapkan text filter jika ada
    let items = [...new Set(
      filteredData
        .map(x => (x as any)[column])
        .filter(v => v !== null && v !== undefined && v !== '')
        .filter(v => !filter || String(v).toLowerCase().includes(filter.toLowerCase()))
    )];

    // setTimeout agar dialog sempat subscribe ke xfilterService.update (EventEmitter)
    // sebelum updateItems emit — karena getColumnValues bersifat synchronous
    setTimeout(() => {
      this.xfilterService.updateItems({
        column: column,
        items: items
      });
    }, 0);
  }


  getColumnFilter() {
    var columnfilter: any = {};
    if(this.wellName_xSelected.length) columnfilter["wellName"] = this.wellName_xSelected;
    if(this.status_xSelected.length) columnfilter["status"] = this.status_xSelected;
    return columnfilter;
  }

  getStatusColor(status: string): string {
    if (!status) return '#bfbfbf';
    return this.statusColors[status.trim().toLowerCase()] || '#bfbfbf';
  }

  applyFilters(columnfilter: any): Sumur[] {
    let filtered = this.sumurList;
    
    // Apply xFilter selections
    if(columnfilter["wellName"] && columnfilter["wellName"].length > 0) {
      filtered = filtered.filter(sumur => 
        columnfilter["wellName"].includes(sumur.wellName)
      );
    }
    if(columnfilter["status"] && columnfilter["status"].length > 0) {
      filtered = filtered.filter(sumur => 
        columnfilter["status"].includes(sumur.status)
      );
    }
    
    return filtered;
  }

  // Mengonversi format DMS (Degrees, Minutes, Seconds) menjadi Decimal Degrees
  dmsToDecimal(dms: string): number {
    // Regular expression untuk mengekstrak komponen dari format DMS
    // Groups: (1) Direction [NSEW], (2) Degrees, (3) Minutes, (4) Seconds
    const regex = /([NSEW])\s*(\d+)[°\s]+(\d+)['\s]+(\d+\.?\d*)/;
    
    // Trim whitespace dari input dan match dengan regex pattern di atas
    const match = dms.trim().match(regex);

    if (!match) {
      console.warn(`[MapSumur] Format DMS tidak dikenali: ${dms}`);
      return 0;
    }

    // Ekstrak nilai direction (arah) dari group pertama: N, S, E, atau W
    const direction = match[1];
    const deg      = parseFloat(match[2]);
    const min      = parseFloat(match[3]);
    const sec      = parseFloat(match[4]);

    // Rumus konversi DMS ke Decimal
    let decimal = deg + min / 60 + sec / 3600;

    // South = negatif latitude, West = negatif longitude
    if (direction === 'S' || direction === 'W') {
      decimal *= -1;
    }

    // Return hasil konversi dalam format decimal degrees
    return decimal;
  }

  flyToSumur(sumur: Sumur): void {
    if (!this.map) return;

    if (!sumur.lat || !sumur.lng) {
      // alert
      alert("Koordinat tidak valid");
      return;
    }

    const lat = this.dmsToDecimal(sumur.lat);
    const lng = this.dmsToDecimal(sumur.lng);
    const status = this.getStatusColor(sumur.status);

    // Cari marker yang sesuai dengan nama sumur yang dipilih
    const marker = this.markerMap.get(sumur.wellName);
    if (marker) {
      this.highlightMarker(marker);
      marker.openPopup();
    }

    this.map.flyTo([lat, lng], 16, {      //16 = level zoom
      animate: true,
      duration: 1.2,                      //animasi bergerak ke lokasi
    });
  }

 private updateMarkersVisibility(filteredSumur: Sumur[]): void {
  if (!this.map) return;

  const hasActiveFilter =
    this.wellName_xSelected.length > 0 ||
    this.status_xSelected.length > 0;

  if (!hasActiveFilter) {
    // Tidak ada filter aktif — hapus semua marker dari peta
    this.markerMap.forEach((marker) => {
      if (this.map!.hasLayer(marker)) marker.removeFrom(this.map!);
    });
    return;
  }

  // Ada filter aktif — tampilkan hanya sumur yang lolos filter
  const filteredNames = new Set(filteredSumur.map(s => s.wellName));

  filteredSumur.forEach(sumur => {
    if (!sumur.lat || !sumur.lng) return;

    // Buat marker baru jika belum pernah dibuat sebelumnya 
    if (!this.markerMap.has(sumur.wellName)) {
      const lat         = this.dmsToDecimal(sumur.lat);
      const lng         = this.dmsToDecimal(sumur.lng);
      const statusColor = this.getStatusColor(sumur.status);

      const icon = L.divIcon({
        html: `<div style="
          background-color: ${statusColor};
          width: 18px; height: 18px;
          border-radius: 50%;
          border: 2.5px solid ${statusColor};
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        "></div>`,
        className: '',
        iconSize:    [18, 18],
        iconAnchor:  [9, 9],
        popupAnchor: [0, -12],
      });

      const marker = L.marker([lat, lng], { icon })
        .bindPopup(`
          <b>${sumur.wellName}</b><br>
          Status: <span style="color:${statusColor}">${sumur.status}</span><br>
          Station: ${sumur.station}
        `);

      marker.on('click', () => this.highlightMarker(marker));
      this.markerMap.set(sumur.wellName, marker);
      this.markerStatusMap.set(marker, sumur.status);
      this.markers.push(marker);
    }

    // Tambahkan ke peta jika belum ada
    const m = this.markerMap.get(sumur.wellName)!;
    if (!this.map!.hasLayer(m)) m.addTo(this.map!);
  });

  // Sembunyikan marker yg bukan fitered
  this.markerMap.forEach((marker, wellName) => {
    if (!filteredNames.has(wellName) && this.map!.hasLayer(marker)) {
      marker.removeFrom(this.map!);
    }
  });
}
}