import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {OneSlideComponent } from './pe-one-slide.component';

describe('OneSlideComponent', () => {
  let component: OneSlideComponent;
  let fixture: ComponentFixture<OneSlideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneSlideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
