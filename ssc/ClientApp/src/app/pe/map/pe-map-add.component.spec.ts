import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeMapAddComponent} from './pe-map-add.component';

describe('PeMapAddComponent', () => {
  let component: PeMapAddComponent;
  let fixture: ComponentFixture<PeMapAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeMapAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeMapAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
