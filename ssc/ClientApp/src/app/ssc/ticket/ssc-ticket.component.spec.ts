import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SscTicketComponent } from './ssc-ticket.component';

describe('SscTicketComponent', () => {
  let component: SscTicketComponent;
  let fixture: ComponentFixture<SscTicketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SscTicketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SscTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
