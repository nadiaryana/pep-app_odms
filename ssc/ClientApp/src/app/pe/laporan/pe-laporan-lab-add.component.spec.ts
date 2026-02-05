import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeLaporanLabAddComponent } from './pe-laporan-lab-add.component';

describe('PeLaporanLabAddComponent', () => {
  let component: PeLaporanLabAddComponent;
  let fixture: ComponentFixture<PeLaporanLabAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeLaporanLabAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeLaporanLabAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
