// pe-map-sumur.component.ts

import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { TitleService } from 'src/app/navigation/title/title.service';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { PePermissionService } from '../pe-permission.service';

// =============================================
// INTERFACE
// =============================================

export interface Sumur {
  name: string;
  latDMS: string;
  lngDMS: string;
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

  displayedColumns: string[] = ['name', 'latDMS', 'lngDMS', 'actions'];

  sumurList: Sumur[] = [
    { name: 'ST-080', latDMS: 'N 0° 27\' 37.433"', lngDMS: 'E 117° 31\' 24.826"' },
    { name: 'ST-081', latDMS: 'N 0° 28\' 45.363"', lngDMS: 'E 117° 30\' 49.709"' },
    { name: 'ST-082', latDMS: 'N 0° 27\' 59.356"', lngDMS: 'E 117° 31\' 12.714"' },
    { name: 'ST-083', latDMS: 'N 0° 26\' 50.100"', lngDMS: 'E 117° 32\' 05.200"' },
    { name: 'ST-084', latDMS: 'N 0° 29\' 10.500"', lngDMS: 'E 117° 31\' 40.300"' },
    { name: 'ST-092', latDMS: 'N 0° 29\' 23.437"', lngDMS: 'E 117° 30\' 43.267"' },
  ];

  // =============================================
  // CONSTRUCTOR
  // =============================================

  constructor(
    private titleService: TitleService,
    private http: HttpClient,
    public pePermissionService: PePermissionService,
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
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initMap();
      this.loadMarkers();

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

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  // =============================================
  // MAP INITIALIZATION
  // =============================================

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

    const centerLat = this.dmsToDecimal('N 0° 27\' 37.433"');
    const centerLng = this.dmsToDecimal('E 117° 31\' 24.826"');

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

  private loadMarkers(): void {
    if (!this.map) return;

    this.sumurList.forEach((sumur) => {
      const lat = this.dmsToDecimal(sumur.latDMS);
      const lng = this.dmsToDecimal(sumur.lngDMS);

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

      L.marker([lat, lng], { icon })
        .addTo(this.map!)
        .bindPopup(`
          <b>${sumur.name}</b>
          Lat: ${lat.toFixed(6)}<br>
          Lng: ${lng.toFixed(6)}
        `);
    });
  }

  // =============================================
  // HELPER METHODS
  // =============================================

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

    const lat = this.dmsToDecimal(sumur.latDMS);
    const lng = this.dmsToDecimal(sumur.lngDMS);

    this.map.flyTo([lat, lng], 16, {
      animate: true,
      duration: 1.2,
    });
  }
}