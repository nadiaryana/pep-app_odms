import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeGrafikComponent } from './pe-grafik.component';

describe('PeGrafikComponent', () => {
  let component: PeGrafikComponent;
  let fixture: ComponentFixture<PeGrafikComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeGrafikComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeGrafikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
