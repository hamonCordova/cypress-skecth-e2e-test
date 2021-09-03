it('successfully signs up using confirmation code sent via email', () => {
  const faker = require('faker')
  const emailAddress = `${faker.datatype.uuid()}@${Cypress.env('MAILOSAUR_SERVER_ID')}.mailosaur.net`
  const password = Cypress.env('USER_PASSWORD')

  cy.fillSignupFormAndSubmit(emailAddress, password)

  cy.intercept('GET', '**/notes').as('getNotes')

  cy.mailosaurGetMessage(Cypress.env('MAILOSAUR_SERVER_ID'), {
    sentTo: emailAddress
  }).then(message => {
    const confirmationCode = message.html.body.match(/\d{6}/)[0]
    cy.get('#confirmationCode').type(`${confirmationCode}{enter}`)

    cy.wait('@getNotes')
    cy.contains('h1', 'Your Notes').should('be.visible')
  })
})
