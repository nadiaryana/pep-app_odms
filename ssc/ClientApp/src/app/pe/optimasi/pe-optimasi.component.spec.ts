import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeOptimasiComponent } from './pe-optimasi.component';

describe('PeOptimasiComponent', () => {
  let component: PeOptimasiComponent;
  let fixture: ComponentFixture<PeOptimasiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeOptimasiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeOptimasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
