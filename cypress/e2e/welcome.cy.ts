describe('Welcome page', () => {
  it('should load the welcome message', () => {
    cy.visit('http://localhost:3333/'); // Visit your app's homepage
    cy.contains('Welcome'); // Assert that "Welcome" is displayed
  });
});