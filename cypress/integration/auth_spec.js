describe('Authentication', () => {
  it('should allow a user to register', () => {
    cy.visit('/register');
    cy.get('input[formControlName="name"]').type('Test User');
    cy.get('input[formControlName="email"]').type('testuser@example.com');
    cy.get('input[formControlName="password"]').type('Password123!');
    cy.get('input[formControlName="confirmPassword"]').type('Password123!');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/login');
    cy.contains('Registration successful').should('be.visible');
  });

  it('should allow a user to login', () => {
    cy.visit('/login');
    cy.get('input[formControlName="email"]').type('testuser@example.com');
    cy.get('input[formControlName="password"]').type('Password123!');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });

  it('should show an error message for invalid credentials', () => {
    cy.visit('/login');
    cy.get('input[formControlName="email"]').type('testuser@example.com');
    cy.get('input[formControlName="password"]').type('WrongPassword');
    cy.get('button[type="submit"]').click();
    cy.contains('Invalid username or password').should('be.visible');
  });

  it('should allow a user to reset password', () => {
    cy.visit('/password-reset');
    cy.get('input[formControlName="email"]').type('testuser@example.com');
    cy.get('button[type="submit"]').click();
    cy.contains('Password reset email sent').should('be.visible');
  });
});