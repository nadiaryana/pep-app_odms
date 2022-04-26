import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeDailyComponent } from './pe-daily.component';

describe('PeDailyComponent', () => {
  let component: PeDailyComponent;
  let fixture: ComponentFixture<PeDailyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeDailyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeDailyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
