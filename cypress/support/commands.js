import './note-commands'
import './settings-commands'

Cypress.Commands.add('fillSignupFormAndSubmit', (email, password) => {
  cy.visit('/signup')
  cy.get('#email').type(email)
  cy.get('#password').type(password, {log: false})
  cy.get('#confirmPassword').type(password, {log: false})
  cy.contains('button', 'Signup').click()
  cy.get('#confirmationCode').should('be.visible')
})

Cypress.Commands.add('login', (
  email = Cypress.env('USER_EMAIL'),
  password = Cypress.env('USER_PASSWORD'),
  {cacheSession = true} = {}
) => {

  const login = () => {
    cy.visit('/login')
    cy.get('#email').type(email)
    cy.get('#password').type(password)
    cy.contains('button', 'LOGIN', {matchCase: false}).click()

    cy.contains('h1', 'Your Notes').should('be.visible')
  }

  if (cacheSession) {
    cy.session([email, password], login)
  } else {
    login()
  }

})


