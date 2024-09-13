import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { CacheService } from './cache.service';
import { environment } from '../../environments/environment';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let cacheServiceSpy: jasmine.SpyObj<CacheService>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getToken']);
    const cacheSpy = jasmine.createSpyObj('CacheService', ['get', 'set']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ApiService,
        { provide: AuthService, useValue: authSpy },
        { provide: CacheService, useValue: cacheSpy }
      ]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    cacheServiceSpy = TestBed.inject(CacheService) as jasmine.SpyObj<CacheService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get courses from cache if available', () => {
    const mockCourses = [{ id: '1', title: 'Course 1' }];
    cacheServiceSpy.get.and.returnValue(mockCourses);

    service.getCourses().subscribe(courses => {
      expect(courses).toEqual(mockCourses);
    });

    expect(cacheServiceSpy.get).toHaveBeenCalledWith('courses');
    httpMock.expectNone(`${environment.apiUrl}/courses`);
  });

  it('should get courses from API if not in cache', () => {
    const mockCourses = [{ id: '1', title: 'Course 1' }];
    cacheServiceSpy.get.and.returnValue(null);

    service.getCourses().subscribe(courses => {
      expect(courses).toEqual(mockCourses);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/courses`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCourses);

    expect(cacheServiceSpy.set).toHaveBeenCalledWith('courses', mockCourses);
  });

  // Add more tests for other methods...
});