import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeActualComponent } from './pe-actual.component';

describe('PeActualComponent', () => {
  let component: PeActualComponent;
  let fixture: ComponentFixture<PeActualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeActualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeActualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
