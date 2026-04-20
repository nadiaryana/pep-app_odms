import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PePumpingUnitAddComponent} from './pe-pumping-unit-add.component';

describe('PePumpingUnitAddComponent', () => {
  let component: PePumpingUnitAddComponent;
  let fixture: ComponentFixture<PePumpingUnitAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PePumpingUnitAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PePumpingUnitAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
