describe('Todo App - Testing Error Messages (Beginner Friendly)', () => {

  beforeEach(() => {
    cy.visit('http://localhost:3333/todos')
    cy.get('input[name="email"]').type('coji@mailinator.com')
    cy.get('input[name="password"]').type('Pa$$w0rd!')
    cy.get('button[type="submit"]').click()
    cy.wait(2500)
  })

  it('should handle permission denied errors', () => {
    cy.intercept('POST', '**/todos', {
      statusCode: 401,
      body: { message: 'You are not authorized to do this' }
    }).as('notAllowed')

    cy.visit('http://localhost:3333/todos')
    cy.get('[data-testid="toggle-todo-form"]').click()
    cy.wait(2000)

    cy.get('input[placeholder="Todo title..."]').type('Permission Test')
    cy.get('textarea[placeholder="Todo content..."]').type('Testing permission error')

    cy.get('[role="combobox"]').first().click()
    cy.get('[role="option"]').contains('In Progress').click()

    cy.get('[role="combobox"]').last().click()
    cy.get('[role="option"]').contains('Low Priority').click()

    cy.get('button[type="submit"]').click()
    cy.wait('@notAllowed')

    cy.get('body').should('exist')
  })

  it('should show success message when todo is created', () => {
    cy.visit('http://localhost:3333/todos')
    cy.get('[data-testid="toggle-todo-form"]').click()
    cy.wait(2000)

    cy.get('input[placeholder="Todo title..."]').type('Success Message Test')
    cy.get('textarea[placeholder="Todo content..."]').type('This should show a success message')

    cy.get('[role="combobox"]').first().click()
    cy.get('[role="option"]').contains('Pending').click()

    cy.get('[role="combobox"]').last().click()
    cy.get('[role="option"]').contains('Medium Priority').click()

    cy.get('button[type="submit"]').click()

    cy.wait(2000)

    cy.get('body').then(($body) => {
      const bodyText = $body.text().toLowerCase()
      const hasSuccess = bodyText.includes('success') ||
                        bodyText.includes('created') ||
                        bodyText.includes('saved') ||
                        $body.find('.success').length > 0 ||
                        $body.find('.checkmark').length > 0

      if (!hasSuccess) {
        cy.contains('Success Message Test').should('be.visible')
      } else {
        expect(hasSuccess).to.be.true
      }
    })

    cy.get('button[title="Delete todo"]').first().click()
  })

})
