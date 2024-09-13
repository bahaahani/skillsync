import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnauthorizedComponent } from './unauthorized.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

describe('UnauthorizedComponent', () => {
  let component: UnauthorizedComponent;
  let fixture: ComponentFixture<UnauthorizedComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnauthorizedComponent ],
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule,
        MatIconModule,
        MatButtonModule
      ],
      providers: [TranslateService]
    }).compileComponents();

    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnauthorizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a warning icon', () => {
    const iconElement = fixture.nativeElement.querySelector('mat-icon.warning-icon');
    expect(iconElement).toBeTruthy();
    expect(iconElement.textContent).toContain('warning');
  });

  it('should have a title', () => {
    const titleElement = fixture.nativeElement.querySelector('h1');
    expect(titleElement).toBeTruthy();
    expect(titleElement.textContent).toContain('UNAUTHORIZED.TITLE');
  });

  it('should have a message', () => {
    const messageElement = fixture.nativeElement.querySelector('p');
    expect(messageElement).toBeTruthy();
    expect(messageElement.textContent).toContain('UNAUTHORIZED.MESSAGE');
  });

  it('should have a button to return to dashboard', () => {
    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement).toBeTruthy();
    expect(buttonElement.textContent).toContain('UNAUTHORIZED.RETURN_TO_DASHBOARD');
  });

  it('should navigate to dashboard when button is clicked', () => {
    spyOn(router, 'navigate');
    const buttonElement = fixture.nativeElement.querySelector('button');
    buttonElement.click();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });
});