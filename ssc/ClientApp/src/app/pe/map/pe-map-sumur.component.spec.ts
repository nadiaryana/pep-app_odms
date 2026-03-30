// pe-map-sumur.component.spec.ts

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { MapSumurComponent } from './pe-map-sumur.component';
import { TitleService } from 'src/app/navigation/title/title.service';

class MockTitleService {
  titleSource = {
    next: jasmine.createSpy('next'),
  };
}

describe('MapSumurComponent', () => {
  let component: MapSumurComponent;
  let fixture: ComponentFixture<MapSumurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        HttpClientTestingModule,
        MatTableModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        MatProgressSpinnerModule,
      ],
      declarations: [MapSumurComponent],
      providers: [
        { provide: TitleService, useClass: MockTitleService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapSumurComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('dmsToDecimal()', () => {

    it('harus mengkonversi North dengan benar', () => {
      const result = component.dmsToDecimal('N 0° 27\' 37.433"');
      expect(result).toBeCloseTo(0.4604, 3);
    });

    it('harus mengkonversi East dengan benar', () => {
      const result = component.dmsToDecimal('E 117° 31\' 24.826"');
      expect(result).toBeCloseTo(117.5236, 3);
    });

    it('harus menghasilkan nilai negatif untuk South', () => {
      const result = component.dmsToDecimal('S 6° 12\' 0"');
      expect(result).toBeLessThan(0);
    });

    it('harus menghasilkan nilai negatif untuk West', () => {
      const result = component.dmsToDecimal('W 74° 0\' 0"');
      expect(result).toBeLessThan(0);
    });

    it('harus mengembalikan 0 jika format tidak valid', () => {
      spyOn(console, 'warn');
      const result = component.dmsToDecimal('invalid format');
      expect(result).toBe(0);
      expect(console.warn).toHaveBeenCalled();
    });
  });

  describe('ngOnInit()', () => {

    it('harus memanggil titleService.titleSource.next()', () => {
      const titleService = TestBed.get(TitleService) as MockTitleService;
      component.ngOnInit();
      expect(titleService.titleSource.next).toHaveBeenCalledWith(
        jasmine.objectContaining({ title: 'Map Sumur', icon: 'map' })
      );
    });
  });

  describe('ngOnDestroy()', () => {

    it('harus tidak error jika map null', () => {
      component.map = null;
      expect(() => component.ngOnDestroy()).not.toThrow();
    });

    it('harus set map ke null setelah destroy', () => {
      component.map = null;
      component.ngOnDestroy();
      expect(component.map).toBeNull();
    });
  });
});