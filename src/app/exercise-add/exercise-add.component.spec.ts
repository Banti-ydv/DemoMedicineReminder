import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseAddComponent } from './exercise-add.component';

describe('ExerciseAddComponent', () => {
  let component: ExerciseAddComponent;
  let fixture: ComponentFixture<ExerciseAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExerciseAddComponent]
    });
    fixture = TestBed.createComponent(ExerciseAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
