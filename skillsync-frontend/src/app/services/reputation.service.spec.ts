import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReputationService } from './reputation.service';
import { environment } from '../../environments/environment';

describe('ReputationService', () => {
  let service: ReputationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReputationService]
    });

    service = TestBed.inject(ReputationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get user reputation', () => {
    const mockReputation = 100;

    service.getUserReputation().subscribe(reputation => {
      expect(reputation).toEqual(mockReputation);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/reputation/user`);
    expect(req.request.method).toBe('GET');
    req.flush(mockReputation);
  });

  it('should get leaderboard', () => {
    const mockLeaderboard = [
      { userId: '1', reputation: 100 },
      { userId: '2', reputation: 90 }
    ];

    service.getLeaderboard().subscribe(leaderboard => {
      expect(leaderboard).toEqual(mockLeaderboard);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/reputation/leaderboard`);
    expect(req.request.method).toBe('GET');
    req.flush(mockLeaderboard);
  });

  it('should award reputation points', () => {
    const mockResponse = { success: true };
    const userId = '1';
    const points = 10;
    const reason = 'Test reason';

    service.awardReputationPoints(userId, points, reason).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/reputation/award`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ userId, points, reason });
    req.flush(mockResponse);
  });
});