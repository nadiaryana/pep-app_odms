import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeOptimasiChartComponent } from './pe-optimasi-chart.component';

describe('PeOptimasiChartComponent', () => {
  let component: PeOptimasiChartComponent;
  let fixture: ComponentFixture<PeOptimasiChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeOptimasiChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeOptimasiChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
