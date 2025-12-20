import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeDailyChanPlotComponent } from './pe-daily-chan-plot.component';

describe('PeDailyChanPlotComponent', () => {
  let component: PeDailyChanPlotComponent;
  let fixture: ComponentFixture<PeDailyChanPlotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeDailyChanPlotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeDailyChanPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
