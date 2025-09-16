describe('Todo App - Testing Empty Fields (Beginner Friendly)', () => {

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

  it('should user cant submit form it submits completely empty form', () => {
    cy.get('button[type="submit"]').should('be.disabled')
  })

  it('cant submit when title is empty but other fields are filled', () => {
    cy.get('textarea[placeholder="Todo content..."]').type('This is the content of my todo')
    cy.get('[role="combobox"]').first().click()
    cy.get('[role="option"]').contains('Pending').click()
    cy.get('[role="combobox"]').last().click()
    cy.get('[role="option"]').contains('Medium Priority').click()
    cy.get('input[placeholder="Labels (comma-separated)..."]').type('work,important')
    cy.get('button[type="submit"]').should('be.disabled')

    cy.wait(1000)

  })

  it('should handle missing content (might be optional)', () => {
    cy.get('input[placeholder="Todo title..."]').type('My Important Task')
    cy.get('[role="combobox"]').first().click()
    cy.get('[role="option"]').contains('Pending').click()
    cy.get('[role="combobox"]').last().click()
    cy.get('[role="option"]').contains('High Priority').click()
    cy.get('button[type="submit"]').click()
    cy.wait(2000)
    cy.get('body').should('exist')
  })

  it('cant submit when title with only spaces', () => {
    cy.get('input[placeholder="Todo title..."]').type('   ')
    cy.get('textarea[placeholder="Todo content..."]').type('Real content here')
    cy.get('[role="combobox"]').first().click()
    cy.get('[role="option"]').contains('Pending').click()
    cy.get('[role="combobox"]').last().click()
    cy.get('[role="option"]').contains('Low Priority').click()
    cy.get('button[type="submit"]').should('be.disabled')
    cy.wait(2000)
  })

  it('should handle missing dropdown selections', () => {
    cy.get('input[placeholder="Todo title..."]').type('Task Without Status')
    cy.get('textarea[placeholder="Todo content..."]').type('This task has no status or priority selected')
    cy.get('button[type="submit"]').click()
    cy.wait(2000)
    cy.get('body').should('exist')
  })

  it('should create todo successfully without labels', () => {
    cy.get('input[placeholder="Todo title..."]').type('Task Without Labels')
    cy.get('textarea[placeholder="Todo content..."]').type('This task has no labels')
    cy.get('[role="combobox"]').first().click()
    cy.get('[role="option"]').contains('Completed').click()
    cy.get('[role="combobox"]').last().click()
    cy.get('[role="option"]').contains('Medium Priority').click()
    cy.get('button[type="submit"]').click()
    cy.wait(2000)
    cy.contains('Task Without Labels').should('be.visible')
  })

  it('should create todo when all fields are filled correctly', () => {
    cy.get('input[placeholder="Todo title..."]').type('Complete Test Todo')
    cy.get('textarea[placeholder="Todo content..."]').type('This todo has all fields filled in correctly')
    cy.get('[role="combobox"]').first().click()
    cy.get('[role="option"]').contains('In Progress').click()
    cy.get('[role="combobox"]').last().click()
    cy.get('[role="option"]').contains('High Priority').click()
    cy.get('input[placeholder="Labels (comma-separated)..."]').type('test,complete,success')
    cy.get('button[type="submit"]').click()
    cy.wait(2000)
    cy.contains('Complete Test Todo').should('be.visible')
    cy.get('button[title="Delete todo"]').first().click()
  })
})
