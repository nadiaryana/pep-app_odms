import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeOptimasiListComponent } from './pe-optimasi-list.component';

describe('PeOptimasiListComponent', () => {
  let component: PeOptimasiListComponent;
  let fixture: ComponentFixture<PeOptimasiListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeOptimasiListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeOptimasiListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
