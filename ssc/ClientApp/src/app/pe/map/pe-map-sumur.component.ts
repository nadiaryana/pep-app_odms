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
}

@Component({
  selector: 'app-map-sumur',
  templateUrl: './pe-map-sumur.component.html',
  styleUrls: ['./pe-map-sumur.component.scss'],
})
export class MapSumurComponent implements OnInit, AfterViewInit, OnDestroy {

  map: L.Map | null = null;
  isLoading = true;

  displayedColumns: string[] = ['wellName', 'lat', 'lng', 'status','station','actions'];

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
      if(res) this.getColumnValues(res.column);
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
      if (this.map) {
        this.map.remove();
        this.map = null;
      }
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
          if (this.map) {
            this.loadMarkers();
          }
        }
      },
      (error) => {
        console.error('[MapSumur] Error loading sumur:', error);
        this.snackbarService.status.next(new SnackbarApi(true, 'Gagal mengambil data sumur', 'dismiss'));
      }
    );
  }

  // MAP INITIALIZATION
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

      // Semua marker seragam — biru
      const icon = L.divIcon({
        html: `
          <div style="
            background-color: #1976d2;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            border: 2.5px solid #0d47a1;
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

  // Filter methods
  getColumnValues(param: any) {
    const column = param;
    
    if (!this.sumurList || this.sumurList.length === 0) {
      console.log("[MapSumur] Data belum siap");
      return;
    }

    // Ambil filter existing dari state
    let columnfilter: any = this.getColumnFilter();
    delete columnfilter[column];

    // Terapkan filter yang ada
    let filteredData = this.applyFilters(columnfilter);

    // Ekstrak unique values untuk kolom
    let items = [...new Set(
      filteredData
        .map(x => (x as any)[column])
        .filter(v => v !== null && v !== undefined && v !== '')
    )];

    // Update xfilterService dengan items
    this.xfilterService.updateItems({
      column: column,
      items: items
    });
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
}