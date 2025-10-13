import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeDailyPerAreaChartComponent } from './pe-daily-per-area-chart.component';

describe('PeDailyPerAreaChartComponent', () => {
  let component: PeDailyPerAreaChartComponent;
  let fixture: ComponentFixture<PeDailyPerAreaChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeDailyPerAreaChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeDailyPerAreaChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
