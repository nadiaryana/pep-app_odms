import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PeSuspendedWellComponent } from './pe-suspended-well.component';

describe('PeSuspendedWellComponent', () => {
  let component: PeSuspendedWellComponent;
  let fixture: ComponentFixture<PeSuspendedWellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeSuspendedWellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeSuspendedWellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
