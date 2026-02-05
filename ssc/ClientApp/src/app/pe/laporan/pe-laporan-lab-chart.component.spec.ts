import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeLaporanLabChartComponent } from './pe-laporan-lab-chart.component';

describe('PeLaporanLabChartComponent', () => {
  let component: PeLaporanLabChartComponent;
  let fixture: ComponentFixture<PeLaporanLabChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeLaporanLabChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeLaporanLabChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
