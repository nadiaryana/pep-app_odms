import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PePumpingUnitComponent } from './pe-pumping-unit.component';

describe('PePumpingUnitComponent', () => {
  let component: PePumpingUnitComponent;
  let fixture: ComponentFixture<PePumpingUnitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PePumpingUnitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PePumpingUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
