import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeLaporanLabListComponent } from './pe-laporan-lab-list.component';

describe('PeLaporanLabListComponent', () => {
  let component: PeLaporanLabListComponent;
  let fixture: ComponentFixture<PeLaporanLabListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeLaporanLabListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeLaporanLabListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
