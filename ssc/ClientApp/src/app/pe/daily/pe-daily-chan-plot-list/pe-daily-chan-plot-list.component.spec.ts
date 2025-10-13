import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeDailyChanPlotListComponent } from './pe-daily-chan-plot-list.component';

describe('PeDailyChanPlotListComponent', () => {
  let component: PeDailyChanPlotListComponent;
  let fixture: ComponentFixture<PeDailyChanPlotListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeDailyChanPlotListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeDailyChanPlotListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
