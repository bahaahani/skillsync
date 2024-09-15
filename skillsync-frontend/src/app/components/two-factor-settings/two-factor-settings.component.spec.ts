import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { TwoFactorSettingsComponent } from './two-factor-settings.component';
import { AuthService } from '../../services/auth.service';
import { MatModules } from '../../modules/shared/mat-modules';

describe('TwoFactorSettingsComponent', () => {
  let component: TwoFactorSettingsComponent;
  let fixture: ComponentFixture<TwoFactorSettingsComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('AuthService', ['getUserProfile', 'enableTwoFactor', 'verifyTwoFactorSetup', 'disableTwoFactor']);

    await TestBed.configureTestingModule({
      declarations: [TwoFactorSettingsComponent],
      imports: [
        ReactiveFormsModule,
        MatSnackBarModule,
        TranslateModule.forRoot(),
        MatModules
      ],
      providers: [
        { provide: AuthService, useValue: spy },
        TranslateService
      ]
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoFactorSettingsComponent);
    component = fixture.componentInstance;
    authServiceSpy.getUserProfile.and.returnValue(of({ twoFactorEnabled: false }));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with two-factor authentication disabled', () => {
    expect(component.twoFactorEnabled).toBeFalse();
  });

  it('should enable two-factor authentication', () => {
    const mockResponse = { secret: 'test-secret', qrCodeUrl: 'test-url' };
    authServiceSpy.enableTwoFactor.and.returnValue(of(mockResponse));

    component.enableTwoFactor();

    expect(authServiceSpy.enableTwoFactor).toHaveBeenCalled();
    expect(component.qrCodeUrl).toBe('test-url');
    expect(component.secret).toBe('test-secret');
  });

  it('should verify two-factor setup', () => {
    authServiceSpy.verifyTwoFactorSetup.and.returnValue(of(true));
    component.setupForm.setValue({ code: '123456' });

    component.verifySetup();

    expect(authServiceSpy.verifyTwoFactorSetup).toHaveBeenCalledWith('123456');
    expect(component.twoFactorEnabled).toBeTrue();
  });

  it('should disable two-factor authentication', () => {
    authServiceSpy.disableTwoFactor.and.returnValue(of(true));

    component.disableTwoFactor();

    expect(authServiceSpy.disableTwoFactor).toHaveBeenCalled();
    expect(component.twoFactorEnabled).toBeFalse();
  });

  it('should handle errors when enabling two-factor authentication', () => {
    authServiceSpy.enableTwoFactor.and.returnValue(throwError(() => new Error('Test error')));
    spyOn(component['snackBar'], 'open');

    component.enableTwoFactor();

    expect(component['snackBar'].open).toHaveBeenCalled();
  });

  it('should handle errors when verifying two-factor setup', () => {
    authServiceSpy.verifyTwoFactorSetup.and.returnValue(throwError(() => new Error('Test error')));
    spyOn(component['snackBar'], 'open');
    component.setupForm.setValue({ code: '123456' });

    component.verifySetup();

    expect(component['snackBar'].open).toHaveBeenCalled();
  });

  it('should handle errors when disabling two-factor authentication', () => {
    authServiceSpy.disableTwoFactor.and.returnValue(throwError(() => new Error('Test error')));
    spyOn(component['snackBar'], 'open');

    component.disableTwoFactor();

    expect(component['snackBar'].open).toHaveBeenCalled();
  });
});