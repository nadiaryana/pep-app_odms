import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PeWellDatabaseComponent } from './pe-suspended-well.component';

describe('PeWellDatabaseComponent', () => {
  let component: PeWellDatabaseComponent;
  let fixture: ComponentFixture<PeWellDatabaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeWellDatabaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeWellDatabaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
