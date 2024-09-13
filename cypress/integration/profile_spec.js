describe('User Profile', () => {
  beforeEach(() => {
    // Login before each test
    cy.login('testuser@example.com', 'Password123!');
  });

  it('should allow a user to update their profile', () => {
    cy.visit('/profile');
    cy.get('input[formControlName="name"]').clear().type('Updated Name');
    cy.get('button').contains('Save Changes').click();
    cy.contains('Profile updated successfully').should('be.visible');
  });

  it('should allow a user to upload a profile picture', () => {
    cy.visit('/profile');
    cy.get('input[type="file"]').attachFile('test-image.jpg');
    cy.contains('Profile picture uploaded successfully').should('be.visible');
  });

  it('should allow a user to enable two-factor authentication', () => {
    cy.visit('/two-factor-settings');
    cy.get('button').contains('Enable Two-Factor Authentication').click();
    cy.get('input[formControlName="code"]').type('123456');
    cy.get('button').contains('Verify and Enable').click();
    cy.contains('Two-factor authentication has been successfully enabled').should('be.visible');
  });
});