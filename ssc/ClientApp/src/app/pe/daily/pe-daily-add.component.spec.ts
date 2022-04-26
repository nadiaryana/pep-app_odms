import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeDailyAddComponent } from './pe-daily-add.component';

describe('PeDailyAddComponent', () => {
  let component: PeDailyAddComponent;
  let fixture: ComponentFixture<PeDailyAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeDailyAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeDailyAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
