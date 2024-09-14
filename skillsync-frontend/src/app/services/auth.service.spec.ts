import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and store token', () => {
    const mockResponse = { token: 'fake-token', expiresIn: 3600, role: 'USER' };
    const credentials = { username: 'test@example.com', password: 'password' };

    service.login(credentials).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(sessionStorage.getItem('token')).toBe('fake-token');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should logout and remove token', () => {
    sessionStorage.setItem('token', 'fake-token');
    service.logout();
    expect(sessionStorage.getItem('token')).toBeNull();
  });

  // Add more tests for other methods...
});