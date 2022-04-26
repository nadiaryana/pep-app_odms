import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeWellPerformanceComponent } from './pe-wellperformance.component';

describe('PeWellerformanceComponent', () => {
  let component: PeWellPerformanceComponent;
  let fixture: ComponentFixture<PeWellPerformanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeWellPerformanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeWellPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
