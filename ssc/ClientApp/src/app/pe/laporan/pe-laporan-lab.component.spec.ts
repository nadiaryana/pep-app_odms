import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeLaporanLabComponent } from './pe-laporan-lab.component';

describe('PeLaporanLabComponent', () => {
  let component: PeLaporanLabComponent;
  let fixture: ComponentFixture<PeLaporanLabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeLaporanLabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeLaporanLabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
