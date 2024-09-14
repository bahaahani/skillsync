import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../services/auth.service';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('AuthService', ['login', 'verifyTwoFactor']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        MatSnackBarModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: AuthService, useValue: spy },
        TranslateService
      ]
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call login method on form submit', () => {
    authServiceSpy.login.and.returnValue(of({ token: 'fake-token', expiresIn: 3600, requiresTwoFactor: false }));

    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password'
    });
    component.login();

    expect(authServiceSpy.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password'
    });
  });

  it('should show two-factor form when required', () => {
    authServiceSpy.login.and.returnValue(of({ requiresTwoFactor: true }));

    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password'
    });
    component.login();

    expect(component.showTwoFactorForm).toBeTrue();
  });

  it('should handle login error', () => {
    authServiceSpy.login.and.returnValue(throwError(() => new Error('Login failed')));

    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password'
    });
    component.login();

    expect(component.isLoading).toBeFalse();
    // You might want to check if the error message is displayed here
  });

  // Add more tests for two-factor authentication, form validation, etc.
});