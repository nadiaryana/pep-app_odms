import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeSensorAddComponent } from './pe-sensor-add.component';

describe('PeSensorAddComponent', () => {
  let component: PeSensorAddComponent;
  let fixture: ComponentFixture<PeSensorAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeSensorAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeSensorAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
