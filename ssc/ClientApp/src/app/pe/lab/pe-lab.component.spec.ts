import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeLabComponent } from './pe-lab.component';

describe('PeLabComponent', () => {
  let component: PeLabComponent;
  let fixture: ComponentFixture<PeLabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeLabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeLabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
