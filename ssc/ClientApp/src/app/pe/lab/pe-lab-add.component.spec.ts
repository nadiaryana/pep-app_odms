import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeLabAddComponent} from './pe-lab-add.component';

describe('PeLabAddComponent', () => {
  let component: PeLabAddComponent;
  let fixture: ComponentFixture<PeLabAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeLabAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeLabAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
