import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeOptimasiAddComponent } from './pe-optimasi-add.component';

describe('PeOptimasiAddComponent', () => {
  let component: PeOptimasiAddComponent;
  let fixture: ComponentFixture<PeOptimasiAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeOptimasiAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeOptimasiAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
