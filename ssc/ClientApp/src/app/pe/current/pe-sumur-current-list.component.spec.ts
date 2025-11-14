import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeSumurCurrentComponent } from './pe-sumur-current-list.component';

describe('PeSumurCurrentComponent', () => {
  let component: PeSumurCurrentComponent;
  let fixture: ComponentFixture<PeSumurCurrentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeSumurCurrentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeSumurCurrentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
