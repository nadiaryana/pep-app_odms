import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeSensorComponent } from './pe-sensor.component';

describe('PeSensorComponent', () => {
  let component: PeSensorComponent;
  let fixture: ComponentFixture<PeSensorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeSensorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeSensorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
