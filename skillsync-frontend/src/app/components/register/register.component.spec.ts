import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('AuthService', ['register']);

    await TestBed.configureTestingModule({
      declarations: [ RegisterComponent ],
      imports: [
        ReactiveFormsModule,
        MatSnackBarModule,
        TranslateModule.forRoot(),
        RouterTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: spy },
        TranslateService
      ]
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty fields', () => {
    expect(component.registerForm.get('name')?.value).toBe('');
    expect(component.registerForm.get('email')?.value).toBe('');
    expect(component.registerForm.get('password')?.value).toBe('');
    expect(component.registerForm.get('confirmPassword')?.value).toBe('');
  });

  it('should validate required fields', () => {
    const form = component.registerForm;
    expect(form.valid).toBeFalsy();

    form.patchValue({
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!'
    });

    expect(form.valid).toBeTruthy();
  });

  it('should validate email format', () => {
    const emailControl = component.registerForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBeFalsy();

    emailControl?.setValue('valid@email.com');
    expect(emailControl?.valid).toBeTruthy();
  });

  it('should validate password strength', () => {
    const passwordControl = component.registerForm.get('password');
    passwordControl?.setValue('weak');
    expect(passwordControl?.hasError('weakPassword')).toBeTruthy();

    passwordControl?.setValue('StrongPassword123!');
    expect(passwordControl?.valid).toBeTruthy();
  });

  it('should validate password confirmation', () => {
    const form = component.registerForm;
    form.patchValue({
      password: 'Password123!',
      confirmPassword: 'DifferentPassword123!'
    });

    expect(form.hasError('notSame')).toBeTruthy();

    form.patchValue({
      confirmPassword: 'Password123!'
    });

    expect(form.hasError('notSame')).toBeFalsy();
  });

  it('should call register service on form submission', () => {
    authServiceSpy.register.and.returnValue(of({}));
    const form = component.registerForm;
    form.patchValue({
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!'
    });

    component.onSubmit();

    expect(authServiceSpy.register).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123!'
    });
  });

  it('should show success message on successful registration', () => {
    authServiceSpy.register.and.returnValue(of({}));
    spyOn(component['snackBar'], 'open');
    spyOn(component['router'], 'navigate');

    component.registerForm.patchValue({
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!'
    });

    component.onSubmit();

    expect(component['snackBar'].open).toHaveBeenCalled();
    expect(component['router'].navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should show error message on registration failure', () => {
    authServiceSpy.register.and.returnValue(throwError(() => new Error('Registration failed')));
    spyOn(component['snackBar'], 'open');

    component.registerForm.patchValue({
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!'
    });

    component.onSubmit();

    expect(component['snackBar'].open).toHaveBeenCalled();
  });
});