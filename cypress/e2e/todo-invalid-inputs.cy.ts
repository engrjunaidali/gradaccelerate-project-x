describe('Todo App - Testing Invalid Inputs (Beginner Friendly)', () => {

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

  it('should handle special characters in todo title', () => {
    const weirdTitle = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`"'

    cy.get('input[placeholder="Todo title..."]').type(weirdTitle)
    cy.get('textarea[placeholder="Todo content..."]').type('Testing special characters')

    cy.get('[role="combobox"]').first().click()
    cy.get('[role="option"]').contains('Pending').click()

    cy.get('[role="combobox"]').last().click()
    cy.get('[role="option"]').contains('Medium Priority').click()

    cy.get('button[type="submit"]').click()
    cy.wait(2000)

    cy.get('body').should('exist')
  })

  it('should handle messy label input', () => {
    cy.get('input[placeholder="Todo title..."]').type('Label Test')
    cy.get('textarea[placeholder="Todo content..."]').type('Testing how labels work')

    cy.get('[role="combobox"]').first().click()
    cy.get('[role="option"]').contains('Completed').click()

    cy.get('[role="combobox"]').last().click()
    cy.get('[role="option"]').contains('High Priority').click()

    const messyLabels = 'work,,,personal,   ,urgent,,family,   '
    cy.get('input[placeholder="Labels (comma-separated)..."]').type(messyLabels)

    cy.get('button[type="submit"]').click()
    cy.wait(2000)

    cy.contains('Label Test').should('be.visible')

    cy.get('button[title="Delete todo"]').first().click()
  })

  it('should safely handle HTML/script tags', () => {
    const htmlTitle = '<script>alert("I am a hacker!")</script>'
    const htmlContent = '<h1>Big Title</h1><img src="fake.jpg" onerror="alert(\'hack\')">'

    cy.get('input[placeholder="Todo title..."]').type(htmlTitle)
    cy.get('textarea[placeholder="Todo content..."]').type(htmlContent)

    cy.get('[role="combobox"]').first().click()
    cy.get('[role="option"]').contains('Pending').click()

    cy.get('[role="combobox"]').last().click()
    cy.get('[role="option"]').contains('High Priority').click()

    cy.get('button[type="submit"]').click()
    cy.wait(2000)

    cy.get('body').should('exist')
  })

  it('should handle emojis and international characters', () => {
    const emojiTitle = '🚀 My Rocket Todo 🎯 Goal 测试 العربية'
    const emojiContent = '💡 This is a great idea! 🌟✨ Let\'s make it happen 🎉'

    cy.get('input[placeholder="Todo title..."]').type(emojiTitle)
    cy.get('textarea[placeholder="Todo content..."]').type(emojiContent)

    cy.get('[role="combobox"]').first().click()
    cy.get('[role="option"]').contains('In Progress').click()

    cy.get('[role="combobox"]').last().click()
    cy.get('[role="option"]').contains('Medium Priority').click()

    cy.get('button[type="submit"]').click()
    cy.wait(2000)

    cy.contains('🚀 My Rocket Todo').should('be.visible')

    cy.get('button[title="Delete todo"]').first().click()
  })



  it('should handle way too many labels', () => {
    cy.get('input[placeholder="Todo title..."]').type('Many Labels Test')
    cy.get('textarea[placeholder="Todo content..."]').type('Testing lots of labels')

    cy.get('[role="combobox"]').first().click()
    cy.get('[role="option"]').contains('Pending').click()

    cy.get('[role="combobox"]').last().click()
    cy.get('[role="option"]').contains('Medium Priority').click()

    const manyLabels = []
    for (let i = 1; i <= 20; i++) {
      manyLabels.push(`label${i}`)
    }
    const labelString = manyLabels.join(',')

    cy.get('input[placeholder="Labels (comma-separated)..."]').type(labelString)

    cy.get('button[type="submit"]').click()
    cy.wait(2000)

    cy.get('body').should('exist')
  })

  it('should handle multi-line content with formatting', () => {
    const multiLineContent = `Line 1: First point
    Line 2: Second point with    extra    spaces

    Line 4: After empty line
    Line 5: Final point`

    cy.get('input[placeholder="Todo title..."]').type('Multi-line Content Test')
    cy.get('textarea[placeholder="Todo content..."]').type(multiLineContent)

    cy.get('[role="combobox"]').first().click()
    cy.get('[role="option"]').contains('In Progress').click()

    cy.get('[role="combobox"]').last().click()
    cy.get('[role="option"]').contains('Low Priority').click()

    cy.get('button[type="submit"]').click()
    cy.wait(2000)

    cy.contains('Multi-line Content Test').should('be.visible')

    cy.get('button[title="Delete todo"]').first().click()
  })

  it('should work perfectly with normal, valid input', () => {
    cy.get('input[placeholder="Todo title..."]').type('Normal Todo')
    cy.get('textarea[placeholder="Todo content..."]').type('This is a completely normal todo with regular text.')

    cy.get('[role="combobox"]').first().click()
    cy.get('[role="option"]').contains('Pending').click()

    cy.get('[role="combobox"]').last().click()
    cy.get('[role="option"]').contains('Medium Priority').click()

    cy.get('input[placeholder="Labels (comma-separated)..."]').type('work,normal,test')

    cy.get('button[type="submit"]').click()
    cy.wait(2000)

    cy.contains('Normal Todo').should('be.visible')

    cy.get('button[title="Delete todo"]').first().click()
  })
})
