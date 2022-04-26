import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeSonologComponent } from './pe-sonolog.component';

describe('PeSonologComponent', () => {
  let component: PeSonologComponent;
  let fixture: ComponentFixture<PeSonologComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeSonologComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeSonologComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
