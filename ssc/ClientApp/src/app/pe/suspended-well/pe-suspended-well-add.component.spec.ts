import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeWellDatabaseAddComponent} from './pe-suspended-well-add.component';

describe('PeWellDatabaseAddComponent', () => {
  let component: PeWellDatabaseAddComponent;
  let fixture: ComponentFixture<PeWellDatabaseAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeWellDatabaseAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeWellDatabaseAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
