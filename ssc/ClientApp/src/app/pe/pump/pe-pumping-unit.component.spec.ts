import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeBhpComponent } from './pe-bhp.component';

describe('PeBhpComponent', () => {
  let component: PeBhpComponent;
  let fixture: ComponentFixture<PeBhpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeBhpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeBhpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
