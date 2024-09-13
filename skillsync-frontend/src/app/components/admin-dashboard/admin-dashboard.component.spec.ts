import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatModules } from '../../modules/mat-modules';
import { ApiService } from '../../services/api.service';
import { of, throwError } from 'rxjs';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ApiService', ['getAnalytics']);

    await TestBed.configureTestingModule({
      declarations: [ AdminDashboardComponent ],
      imports: [
        TranslateModule.forRoot(),
        MatModules
      ],
      providers: [
        TranslateService,
        { provide: ApiService, useValue: spy }
      ]
    }).compileComponents();

    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load analytics on init', () => {
    const mockAnalytics = {
      totalUsers: 100,
      totalCourses: 50,
      activeUsers: 75,
      courseCompletions: 25
    };
    apiServiceSpy.getAnalytics.and.returnValue(of(mockAnalytics));

    fixture.detectChanges(); // This will trigger ngOnInit

    expect(apiServiceSpy.getAnalytics).toHaveBeenCalled();
    expect(component.analytics).toEqual(mockAnalytics);
    expect(component.isLoading).toBeFalse();
  });

  it('should handle error when loading analytics', () => {
    apiServiceSpy.getAnalytics.and.returnValue(throwError(() => new Error('API error')));

    fixture.detectChanges(); // This will trigger ngOnInit

    expect(apiServiceSpy.getAnalytics).toHaveBeenCalled();
    expect(component.analytics).toBeUndefined();
    expect(component.isLoading).toBeFalse();
  });

  it('should reload analytics when refresh button is clicked', () => {
    const mockAnalytics = {
      totalUsers: 100,
      totalCourses: 50,
      activeUsers: 75,
      courseCompletions: 25
    };
    apiServiceSpy.getAnalytics.and.returnValue(of(mockAnalytics));

    component.loadAnalytics();

    expect(apiServiceSpy.getAnalytics).toHaveBeenCalled();
    expect(component.analytics).toEqual(mockAnalytics);
    expect(component.isLoading).toBeFalse();
  });
});