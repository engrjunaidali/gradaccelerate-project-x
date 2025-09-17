describe('Todos API Integration Tests', () => {

  // Login before each test
  beforeEach(() => {
    cy.visit('http://localhost:3333/todos')
    cy.get('input[name="email"]').type('coji@mailinator.com')
    cy.get('input[name="password"]').type('Pa$$w0rd!')
    cy.get('button[type="submit"]').click()
    cy.wait(2500)
    cy.visit('http://localhost:3333/todos')
    cy.wait(2000)
  })

  describe('Using Fixtures for API Mocking', () => {

    it('should display todos from the API using fixture', () => {
      cy.intercept('GET', '/api/todos', { fixture: 'todos.json' }).as('getTodos');

      cy.visit('http://localhost:3333/todos');
      cy.wait('@getTodos');

      cy.contains('Learn Cypress').should('be.visible')
      cy.contains('Write API Tests').should('be.visible')
      cy.contains('Deploy Application').should('be.visible')
    })

    it('should handle successful API response', () => {
      cy.intercept('GET', '/api/todos', {
        statusCode: 200,
        body: {
          todos: [
            {
              id: 1,
              title: 'Test Todo',
              content: 'This is a test todo',
              status: 'pending',
              priority: 'medium',
              labels: ['test'],
              imageUrl: '',
              userId: 1,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ]
        }
      }).as('getSuccessfulTodos');

      cy.visit('http://localhost:3333/todos');
      cy.wait('@getSuccessfulTodos');

      cy.contains('Test Todo').should('be.visible')
    })

  })

  describe('Timeout Error Handling', () => {

    it('should handle timeout error with proper status code', () => {
      cy.intercept('GET', '/api/todos', {
        statusCode: 408,
        body: {
          error: 'Request Timeout',
          message: 'The request took too long to complete. Please try again.',
          code: 'TIMEOUT_ERROR'
        }
      }).as('getTimeoutError');

      cy.visit('http://localhost:3333/todos');
      cy.wait('@getTimeoutError').then((interception) => {
        expect(interception.response.statusCode).to.equal(408)
        expect(interception.response.body).to.have.property('code', 'TIMEOUT_ERROR')
      });
    })

  })
})
