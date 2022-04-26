import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SscSlaComponent } from './ssc-sla.component';

describe('SscSlaComponent', () => {
  let component: SscSlaComponent;
  let fixture: ComponentFixture<SscSlaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SscSlaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SscSlaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
