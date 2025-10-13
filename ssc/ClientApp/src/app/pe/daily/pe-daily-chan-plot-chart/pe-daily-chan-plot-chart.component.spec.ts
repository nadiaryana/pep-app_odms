import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeDailyChanPlotChartComponent } from './pe-daily-chan-plot-chart.component';

describe('PeDailyChanPlotChartComponent', () => {
  let component: PeDailyChanPlotChartComponent;
  let fixture: ComponentFixture<PeDailyChanPlotChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeDailyChanPlotChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeDailyChanPlotChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
