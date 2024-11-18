import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseDialogHandlerComponent } from './course-dialog-handler.component';

describe('CourseDialogHandlerComponent', () => {
  let component: CourseDialogHandlerComponent;
  let fixture: ComponentFixture<CourseDialogHandlerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseDialogHandlerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseDialogHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
