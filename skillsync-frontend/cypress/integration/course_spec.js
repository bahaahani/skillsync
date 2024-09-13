describe('Course Management', () => {
  beforeEach(() => {
    // Login before each test
    cy.login('testuser@example.com', 'Password123!');
  });

  it('should display the course catalog', () => {
    cy.visit('/courses');
    cy.get('.course-card').should('have.length.greaterThan', 0);
  });

  it('should allow a user to enroll in a course', () => {
    cy.visit('/courses');
    cy.get('.course-card').first().click();
    cy.get('button').contains('Enroll').click();
    cy.contains('Successfully enrolled').should('be.visible');
  });

  it('should display course content after enrollment', () => {
    cy.visit('/dashboard');
    cy.get('.enrolled-course').first().click();
    cy.get('.course-content').should('be.visible');
  });

  it('should allow a user to submit a course rating', () => {
    cy.visit('/dashboard');
    cy.get('.enrolled-course').first().click();
    cy.get('.rating-input').click();
    cy.get('button').contains('Submit Rating').click();
    cy.contains('Rating submitted successfully').should('be.visible');
  });
});