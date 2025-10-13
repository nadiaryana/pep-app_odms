import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeDailyAreaChartComponent } from './pe-daily-area-chart.component';

describe('PeDailyAreaChartComponent', () => {
  let component: PeDailyAreaChartComponent;
  let fixture: ComponentFixture<PeDailyAreaChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeDailyAreaChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeDailyAreaChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
