// pe-map-sumur.component.ts

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


export interface Sumur {
  wellName: string;
  lat: string;
  lng: string;
}

@Component({
  selector: 'app-map-sumur',
  templateUrl: './pe-map-sumur.component.html',
  styleUrls: ['./pe-map-sumur.component.scss'],
})
export class MapSumurComponent implements OnInit, AfterViewInit, OnDestroy {

  // =============================================
  // PROPERTIES
  // =============================================

  map: L.Map | null = null;
  isLoading = true;

  displayedColumns: string[] = ['wellName', 'lat', 'lng', 'actions'];

  sumurList: Sumur[] = [];
  dataSource = new MatTableDataSource<Sumur>();
  
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  

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

  // =============================================
  // LIFECYCLE HOOKS
  // =============================================

  ngOnInit(): void {
    this.titleService.titleSource.next({
      title: 'Map Sumur',
      icon: 'map',
      breadcrumbs: [],
    });

    this.fixLeafletDefaultIcon();
    this.loadSumurFromAPI();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initMap();
      // loadMarkers akan dipanggil setelah loadSumurFromAPI selesai load data dari API

      setTimeout(() => {
        if (this.map) {
          this.map.invalidateSize();
          this.isLoading = false;
        }
      }, 300);
    }, 0);
  }

  passPermission(path:String) {
    return this.pePermissionService.passPermission(path);
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
              lng: item.lng || ''
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

  ngOnDestroy(): void {
    if (this.map) {
      this.markers = [];
      this.selectedMarker = null;

      if (this.map) {
      this.map.remove();
      this.map = null;
    }}
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

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(this.map);
  }

  private markers: L.Marker[] = []; // ← simpan semua marker
  private selectedMarker: L.Marker | null = null; // ← marker yang dipilih

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
          Lat: ${lat.toFixed(6)}<br>
          Lng: ${lng.toFixed(6)}
        `);
      
        marker.on('click', () => {
      this.highlightMarker(marker);
    });

    this.markers.push(marker);
    });
  }

  private createIcon(type: 'default' | 'selected'): L.DivIcon {
    const isSelected = type === 'selected';
    return L.divIcon({
      html: `
        <div style="
          background-color: ${isSelected ? '#e53935' : '#1976d2'};
          width: ${isSelected ? '24px' : '18px'};
          height: ${isSelected ? '24px' : '18px'};
          border-radius: 50%;
          border: 2.5px solid ${isSelected ? '#b71c1c' : '#0d47a1'};
          box-shadow: ${isSelected ? '0 0 0 4px rgba(229,57,53,0.3)' : '0 2px 6px rgba(0,0,0,0.3)'};
          transition: all 0.2s ease;
        "></div>
      `,
      className: '',
      iconSize: isSelected ? [24, 24] : [18, 18],
      iconAnchor: isSelected ? [12, 12] : [9, 9],
      popupAnchor: [0, -12],
    });
  }

  private highlightMarker(marker: L.Marker): void {
    // Reset marker sebelumnya ke default
    if (this.selectedMarker && this.selectedMarker !== marker) {
      this.selectedMarker.setIcon(this.createIcon('default'));
    }
    // Set marker baru ke selected
    marker.setIcon(this.createIcon('selected'));
    this.selectedMarker = marker;
  }

  // HELPER METHODS

  dmsToDecimal(dms: string): number {
    const regex = /([NSEW])\s*(\d+)[°\s]+(\d+)['\s]+(\d+\.?\d*)/;
    const match = dms.trim().match(regex);

    if (!match) {
      console.warn(`[MapSumur] Format DMS tidak dikenali: ${dms}`);
      return 0;
    }

    const direction = match[1];
    const deg      = parseFloat(match[2]);
    const min      = parseFloat(match[3]);
    const sec      = parseFloat(match[4]);

    let decimal = deg + min / 60 + sec / 3600;

    if (direction === 'S' || direction === 'W') {
      decimal *= -1;
    }

    return decimal;
  }

  flyToSumur(sumur: Sumur): void {
    if (!this.map) return;

    const lat = this.dmsToDecimal(sumur.lat);
    const lng = this.dmsToDecimal(sumur.lng);

    // Cari marker yang sesuai dengan sumur
    const index = this.sumurList.indexOf(sumur);
    if (index !== -1 && this.markers[index]) {
      this.highlightMarker(this.markers[index]);
      this.markers[index].openPopup(); // ← buka popup sekalian
    }

    this.map.flyTo([lat, lng], 16, {
      animate: true,
      duration: 1.2,
    });
  }
}