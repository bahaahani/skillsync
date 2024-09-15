import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { PasswordResetComponent } from './password-reset.component';
import { AuthService } from '../../services/auth.service';
import { MatModules } from '../../modules/shared/mat-modules';

describe('PasswordResetComponent', () => {
  let component: PasswordResetComponent;
  let fixture: ComponentFixture<PasswordResetComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['resetPassword']);
    const activatedRouteStub = {
      queryParams: of({ token: 'fake-token' })
    };

    await TestBed.configureTestingModule({
      declarations: [PasswordResetComponent],
      imports: [
        ReactiveFormsModule,
        MatSnackBarModule,
        TranslateModule.forRoot(),
        MatModules
      ],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        TranslateService
      ]
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty fields', () => {
    expect(component.resetForm.get('password')?.value).toBe('');
    expect(component.resetForm.get('confirmPassword')?.value).toBe('');
  });

  it('should set token from query params', () => {
    expect(component.token).toBe('fake-token');
  });

  it('should validate required fields', () => {
    const form = component.resetForm;
    expect(form.valid).toBeFalsy();

    form.patchValue({
      password: 'newPassword123!',
      confirmPassword: 'newPassword123!'
    });

    expect(form.valid).toBeTruthy();
  });

  it('should validate password confirmation', () => {
    const form = component.resetForm;
    form.patchValue({
      password: 'newPassword123!',
      confirmPassword: 'differentPassword123!'
    });

    expect(form.hasError('notSame')).toBeTruthy();

    form.patchValue({
      confirmPassword: 'newPassword123!'
    });

    expect(form.hasError('notSame')).toBeFalsy();
  });

  it('should call resetPassword service on form submission', () => {
    authServiceSpy.resetPassword.and.returnValue(of({}));
    const form = component.resetForm;
    form.patchValue({
      password: 'newPassword123!',
      confirmPassword: 'newPassword123!'
    });

    component.onSubmit();

    expect(authServiceSpy.resetPassword).toHaveBeenCalledWith('fake-token', 'newPassword123!');
  });

  it('should show success message on successful password reset', () => {
    authServiceSpy.resetPassword.and.returnValue(of({}));
    spyOn(component['snackBar'], 'open');

    component.resetForm.patchValue({
      password: 'newPassword123!',
      confirmPassword: 'newPassword123!'
    });

    component.onSubmit();

    expect(component['snackBar'].open).toHaveBeenCalled();
  });

  it('should show error message on password reset failure', () => {
    authServiceSpy.resetPassword.and.returnValue(throwError(() => new Error('Reset failed')));
    spyOn(component['snackBar'], 'open');

    component.resetForm.patchValue({
      password: 'newPassword123!',
      confirmPassword: 'newPassword123!'
    });

    component.onSubmit();

    expect(component['snackBar'].open).toHaveBeenCalled();
  });
});