import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeDailyZonechartComponent } from './pe-daily-zonechart.component';

describe('PeDailyZonechartComponent', () => {
  let component: PeDailyZonechartComponent;
  let fixture: ComponentFixture<PeDailyZonechartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeDailyZonechartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeDailyZonechartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
