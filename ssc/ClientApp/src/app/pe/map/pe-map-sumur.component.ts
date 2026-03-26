import { Component, ViewChild, AfterViewInit, OnInit, OnDestroy } from "@angular/core";
import { TitleService } from "src/app/navigation/title/title.service";
import { HttpClient } from "@angular/common/http";
import * as Highcharts from "highcharts";
import { FormControl } from "@angular/forms";
import { MatDatepicker, MatPaginator, MatSort } from "@angular/material";
import { merge, of as observableOf, Subscription } from 'rxjs';
import { catchError, map, startWith, switchMap, debounceTime } from 'rxjs/operators';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';


@Component({
  selector: 'app-map-sumur',
  templateUrl: './pe-map-sumur.component.html',
  styleUrls: ['./pe-map-sumur.component.scss'],
})
export class MapSumurComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(private titleService: TitleService, private http: HttpClient) {}

  map: any;

  // Fungsi konversi DMS ke Decimal
  dmsToDecimal(dms: string): number {
    // Contoh input: "N 0° 27' 37.433""
    const parts = dms.trim().split(/[^\d\w\.]+/); // split by non-alphanumeric
    const direction = parts[0]; // N/S/E/W
    const deg = parseFloat(parts[1]);
    const min = parseFloat(parts[2]);
    const sec = parseFloat(parts[3]);

    let dec = deg + (min / 60) + (sec / 3600);

    if (direction === 'S' || direction === 'W') dec *= -1;
    return dec;
  }

  // contoh data sumur dengan DMS
  sumurList = [
    { name: 'ST-080 ', latDMS: 'N 0° 27\' 37.433"', lngDMS: 'E 117° 31\' 24.826"', status: 'ON' },
    { name: 'ST-081', latDMS: 'N 0° 28\' 45.363"', lngDMS: 'E 117° 30\' 49.709"', status: 'OFF' },
    { name: 'ST-082', latDMS: 'N 0° 27\' 59.356"', lngDMS: 'E 117° 31\' 12.714"', status: 'ON' },
  ];

  ngOnInit(): void {
    // Initialize on component init
    this.titleService.titleSource.next({
      title: "Map",
      icon: "map",
      breadcrumbs: []
    });
  }

  ngAfterViewInit(): void {
  this.initMap();
  this.loadMarkers();

  setTimeout(() => {
    if (this.map) {
      this.map.invalidateSize();
    }
  }, 300);
}

  ngOnDestroy(): void {
    // Clean up map if needed
    if (this.map) {
      this.map.remove();
    }
  }

  initMap() {
    this.map = L.map('map').setView(
      [this.dmsToDecimal('N 0° 27\' 37.433"'), this.dmsToDecimal('E 117° 31\' 24.826"')],
      12
    );

    // tile dari OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(this.map);
  }

  loadMarkers() {
    this.sumurList.forEach(sumur => {
      // konversi DMS ke decimal
      const lat = this.dmsToDecimal(sumur.latDMS);
      const lng = this.dmsToDecimal(sumur.lngDMS);

      // warna marker ON=green, OFF=red
      const color = sumur.status === 'ON' ? 'green' : 'red';

      const icon = L.divIcon({
        html: `<div style="
          background-color:${color};
          width:15px;
          height:15px;
          border-radius:50%;
          border:2px solid white;">
        </div>`,
        className: ''
      });

      // tambah marker ke map
      L.marker([lat, lng], { icon: icon })
        .addTo(this.map)
        .bindPopup(`<b>${sumur.name}</b><br>Status: ${sumur.status}`);
    });
  }

}