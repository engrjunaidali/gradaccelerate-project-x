describe('Todo app', () => {
  //   it('should load the welcome message', () => {
  //     cy.visit('http://localhost:3333/') // Visit your app's homepage
  //     cy.contains('Welcome') // Assert that "Welcome" is displayed
  //   })

  //   it('should login todo page', () => {
  //     cy.visit('http://localhost:3333/auth/jwt/login') // Visit your app's homepage
  //     cy.get('input[name="email"]').type('coji@mailinator.com') // Type in email
  //     cy.get('input[name="password"]').type('Pa$$w0rd!') // Type in password
  //     cy.get('button[type="submit"]').click() // Submit the form
  //     cy.url().should('include', '/todos') // Verify the user is redirected to the dashboard
  //     cy.contains('Todos') // Assert that "Your Todos" is displayed
  //   })

  it('should allow a user to create a new todo', () => {
    cy.visit('http://localhost:3333/todos') // Open the homepage of the app

    cy.get('input[name="email"]').type('coji@mailinator.com') // Type in email
    cy.get('input[name="password"]').type('Pa$$w0rd!') // Type in password
    cy.get('button[type="submit"]').click() // Submit the form

    cy.wait(2500) // Wait for sign in to complete

    cy.visit('http://localhost:3333/todos')

    // open todo form
    // cy.get('button').contains('svg.lucide-plus').click()
    cy.get('[data-testid="toggle-todo-form"]').click()

    cy.wait(2000) // Wait for sign in to complete

    cy.get('input[placeholder="Todo title..."]').type('Learn Cypress')
    cy.get('textarea[placeholder="Todo content..."]').type('Write E2E tests for the todo app')

    // Handle Status Select (first select)
    cy.get('[role="combobox"]').first().click()
    cy.get('[role="option"]').contains('Pending').click()

    // Handle Priority Select (second select)
    cy.get('[role="combobox"]').last().click()
    cy.get('[role="option"]').contains('High Priority').click()

    cy.get('input[placeholder="Labels (comma-separated)..."]').type('testing,cypress')

    cy.get('button[type="submit"]').click() // Click the submit button
    cy.contains('Learn Cypress') // Check if the todo appears in the list

    cy.wait(2000) // loading

    // editing the created todo
    cy.visit('http://localhost:3333/todos')
    cy.get('button[title="Edit todo"]').first().click()
    cy.get('input[placeholder="Todo title..."]').type(' Updated')
    cy.get('button[type="submit"]').click() // Click the submit button

    cy.wait(2000) // loading

    // delete the created todo
    cy.get('button[title="Delete todo"]').first().click()
    cy.contains('Learn Cypress Updated').should('not.exist')
  })
})
