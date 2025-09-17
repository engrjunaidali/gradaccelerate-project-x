describe('Todo app', () => {

  beforeEach(() => {
    cy.visit('http://localhost:3333/todos')
    cy.get('input[name="email"]').type('coji@mailinator.com')
    cy.get('input[name="password"]').type('Pa$$w0rd!')
    cy.get('button[type="submit"]').click()
    cy.wait(2500)

    cy.visit('http://localhost:3333/todos')
    cy.get('[data-testid="toggle-todo-form"]').click()
    cy.wait(2000)
  })

  it('should allow a user to create a new todo', () => {

    cy.get('input[placeholder="Todo title..."]').type('Learn Cypress')
    cy.get('textarea[placeholder="Todo content..."]').type('Write E2E tests for the todo app')

    // Handle Status Select (first select)
    cy.get('[role="combobox"]').first().click()
    cy.get('[role="option"]').contains('Pending').click()

    // Handle Priority Select (second select)
    cy.get('[role="combobox"]').last().click()
    cy.get('[role="option"]').contains('High Priority').click()

    cy.get('input[placeholder="Labels (comma-separated)..."]').type('testing,cypress')

    cy.get('button[type="submit"]').click()
    cy.contains('Learn Cypress')
  })

  it('should allow a user to create a new todo', () => {

    cy.visit('http://localhost:3333/todos')
    cy.get('button[title="Edit todo"]').first().click()
    cy.get('input[placeholder="Todo title..."]').type(' Updated')
    cy.get('button[type="submit"]').click()

  })

  it('should allow a user to create a new todo', () => {

    cy.get('button[title="Delete todo"]').first().click()
    cy.contains('Learn Cypress Updated').should('not.exist')
  })
})
