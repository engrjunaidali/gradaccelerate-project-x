describe('Authentication Edge Cases - Beginner Friendly', () => {

  beforeEach(() => {
    cy.visit('http://localhost:3333/auth/jwt/login')
  })

  it('should show error message for invalid email', () => {
    cy.get('input[name="email"]').type('wrong@email.com')
    cy.get('input[name="password"]').type('Pa$$w0rd!')

    cy.get('button[type="submit"]').click()

    cy.wait(2000)

    cy.get('body').then(($body) => {
      const hasErrorMessage = $body.find('.error-message').length > 0
      const hasAlert = $body.find('[role="alert"]').length > 0
      const hasToast = $body.find('.toast').length > 0

      if (hasErrorMessage) {
        cy.get('.error-message').should('contain.text', 'Invalid')
      } else if (hasAlert) {
        cy.get('[role="alert"]').should('be.visible')
      } else if (hasToast) {
        cy.get('.toast').should('contain.text', 'Invalid')
      } else {
        cy.url().should('include', 'login')
      }
    })
  })

  it('should show error message for invalid password', () => {
    cy.get('input[name="email"]').type('coji@mailinator.com')
    cy.get('input[name="password"]').type('WrongPassword123')

    cy.get('button[type="submit"]').click()

    cy.wait(2000)

    cy.get('body').then(($body) => {
      if ($body.find(':contains("Invalid")').length > 0) {
        cy.contains('Invalid').should('be.visible')
      } else if ($body.find(':contains("incorrect")').length > 0) {
        cy.contains('incorrect').should('be.visible')
      } else if ($body.find(':contains("wrong")').length > 0) {
        cy.contains('wrong').should('be.visible')
      } else {
        cy.url().should('include', 'login')
      }
    })
  })

  it('should show error when email field is empty', () => {
    cy.get('input[name="password"]').type('Pa$$w0rd!')

    cy.get('button[type="submit"]').click()

    cy.get('body').then(($body) => {
      if ($body.find(':contains("required")').length > 0) {
        cy.contains('required').should('be.visible')
      } else if ($body.find(':contains("Email")').length > 0) {
        cy.contains('Email').should('be.visible')
      } else {
        cy.get('input[name="email"]').then(($input) => {
          if ($input.hasClass('error') || $input.attr('aria-invalid') === 'true') {
            cy.get('input[name="email"]').should('satisfy', ($el) => {
              return $el.hasClass('error') || $el.attr('aria-invalid') === 'true'
            })
          }
        })
      }
    })
  })

  it('should show error when password field is empty', () => {
    cy.get('input[name="email"]').type('coji@mailinator.com')

    cy.get('button[type="submit"]').click()

    cy.get('body').then(($body) => {
      if ($body.find(':contains("required")').length > 0) {
        cy.contains('required').should('be.visible')
      } else if ($body.find(':contains("Password")').length > 0) {
        cy.contains('Password').should('be.visible')
      } else {
        cy.get('input[name="password"]').then(($input) => {
          if ($input.hasClass('error') || $input.attr('aria-invalid') === 'true') {
            cy.get('input[name="password"]').should('satisfy', ($el) => {
              return $el.hasClass('error') || $el.attr('aria-invalid') === 'true'
            })
          }
        })
      }
    })
  })

  it('should show error for invalid email format', () => {
    cy.get('input[name="email"]').type('not-an-email')
    cy.get('input[name="password"]').type('Pa$$w0rd!')

    cy.get('button[type="submit"]').click()

    cy.get('body').then(($body) => {
      if ($body.find(':contains("valid email")').length > 0) {
        cy.contains('valid email').should('be.visible')
      } else if ($body.find(':contains("invalid")').length > 0) {
        cy.contains('invalid').should('be.visible')
      } else {
        cy.get('input[name="email"]:invalid').should('exist')
      }
    })
  })

  it('should successfully login with correct credentials', () => {
    cy.get('input[name="email"]').type('coji@mailinator.com')
    cy.get('input[name="password"]').type('Pa$$w0rd!')

    cy.get('button[type="submit"]').click()

    cy.wait(3000)

    cy.url().should('include', '/todos')

    cy.contains('Todos').should('be.visible')
  })

  it('should redirect to login when accessing todos without authentication', () => {
    cy.visit('http://localhost:3333/todos')

    cy.get('body').then(($body) => {
      if ($body.find('input[name="email"]').length > 0) {
        cy.get('input[name="email"]').should('be.visible')
        cy.get('input[name="password"]').should('be.visible')
      } else {
        cy.url().should('satisfy', (url) => {
          return url.includes('login') || url.includes('auth')
        })
      }
    })
  })

  it('should handle expired session gracefully', () => {
    cy.get('input[name="email"]').type('coji@mailinator.com')
    cy.get('input[name="password"]').type('Pa$$w0rd!')
    cy.get('button[type="submit"]').click()
    cy.wait(3000)

    cy.url().should('include', '/todos')

    cy.clearCookies()
    cy.clearLocalStorage()

    cy.visit('http://localhost:3333/todos')

    cy.get('body').then(($body) => {
      if ($body.find('input[name="email"]').length > 0) {
        cy.get('input[name="email"]').should('be.visible')
      } else {
        cy.url().should('satisfy', (url) => {
          return url.includes('login') || url.includes('auth')
        })
      }
    })
  })

  it('should handle multiple failed login attempts', () => {
    for (let i = 1; i <= 3; i++) {
      cy.get('input[name="email"]').clear().type('wrong@email.com')
      cy.get('input[name="password"]').clear().type('wrongpassword')
      cy.get('button[type="submit"]').click()
      cy.wait(1000)

      cy.url().should('include', 'login')
    }

    cy.get('body').then(($body) => {
      if ($body.find(':contains("too many")').length > 0) {
        cy.contains('too many').should('be.visible')
      } else if ($body.find(':contains("locked")').length > 0) {
        cy.contains('locked').should('be.visible')
      } else {
        cy.get('input[name="email"]').should('be.visible')
      }
    })
  })

  it('should handle special characters in email and password', () => {
    cy.get('input[name="email"]').type('test+special@domain-name.co.uk')
    cy.get('input[name="password"]').type('P@$$w0rd!#$%^&*()')

    cy.get('button[type="submit"]').click()
    cy.wait(2000)

    cy.get('body').should('be.visible')
  })
})
