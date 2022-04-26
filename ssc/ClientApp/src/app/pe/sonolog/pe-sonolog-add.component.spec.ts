import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeSonologAddComponent } from './pe-sonolog-add.component';

describe('PeSonologAddComponent', () => {
  let component: PeSonologAddComponent;
  let fixture: ComponentFixture<PeSonologAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeSonologAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeSonologAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
