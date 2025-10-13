import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeDailyZonechartListComponent } from './pe-daily-zonechart-list.component';

describe('PeDailyZonechartListComponent', () => {
  let component: PeDailyZonechartListComponent;
  let fixture: ComponentFixture<PeDailyZonechartListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeDailyZonechartListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeDailyZonechartListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
