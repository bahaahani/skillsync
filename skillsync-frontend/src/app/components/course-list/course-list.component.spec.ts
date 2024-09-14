import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CourseListComponent } from './course-list.component';
import { CourseService } from '../../services/course.service';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

describe('CourseListComponent', () => {
  let component: CourseListComponent;
  let fixture: ComponentFixture<CourseListComponent>;
  let courseServiceSpy: jasmine.SpyObj<CourseService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const courseSpy = jasmine.createSpyObj('CourseService', ['getCourses', 'getEnrolledCourses', 'enrollInCourse']);
    const authSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);

    await TestBed.configureTestingModule({
      declarations: [ CourseListComponent ],
      imports: [ TranslateModule.forRoot() ],
      providers: [
        { provide: CourseService, useValue: courseSpy },
        { provide: AuthService, useValue: authSpy }
      ]
    }).compileComponents();

    courseServiceSpy = TestBed.inject(CourseService) as jasmine.SpyObj<CourseService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseListComponent);
    component = fixture.componentInstance;
    courseServiceSpy.getCourses.and.returnValue(of({ courses: [], totalCount: 0 }));
    courseServiceSpy.getEnrolledCourses.and.returnValue(of([]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load courses on init', () => {
    expect(courseServiceSpy.getCourses).toHaveBeenCalled();
  });

  // Add more tests as needed
});