import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeSonologChartComponent } from './pe-sonolog-chart.component';

describe('PeSonologChartComponent', () => {
  let component: PeSonologChartComponent;
  let fixture: ComponentFixture<PeSonologChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeSonologChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeSonologChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
