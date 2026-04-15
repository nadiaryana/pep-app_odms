import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeBhpAddComponent} from './pe-pumping-unit-add.component';

describe('PeBhpAddComponent', () => {
  let component: PeBhpAddComponent;
  let fixture: ComponentFixture<PeBhpAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeBhpAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeBhpAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
