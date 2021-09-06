describe('Authenticated Scnearios', () => {

  beforeEach(() => {
    cy.intercept('POST', '**/prod/billing').as('paymentRequest')
    cy.intercept('GET', '**/notes').as('getNotes')
  })

  describe('CRUD Note', () => {

    const faker = require('faker')
    const noteDescription = faker.lorem.words(4)
    const nextDescription = faker.lorem.words(4)

    it('Insert note', () => {
      cy.createNote(noteDescription)
    })

    it('Update note', () => {
      cy.updateNoteByDescription(noteDescription, nextDescription, true)
    })

    it('Delete note', () => {
      cy.deleteNoteByDescription(nextDescription)
    })

  })

  describe('Payment Section', () => {

    it('should does a payment request', () => {

      cy.fillSettingsFormAndSubmit()

      cy.wait('@getNotes')
      cy.wait('@paymentRequest').then(res => {
        expect(res.state).to.equal('Complete')
      })
    })

  })

  describe('Logout', () => {
    it('should logout successfully', {tags: '@desktop-and-tablet'}, () => {
      cy.login()
      cy.visit('/')

      cy.wait('@getNotes')

      if(Cypress.config('viewportWidth') < Cypress.env('viewportWidthBreakpoint')) {
        cy.get('.navbar-toggle.collapsed').should('be.visible').click()
      }

      /* ==== Generated with Cypress Studio ==== */
      cy.get('.nav > :nth-child(2) > a').click()
      cy.get('#email').should('be.visible')
      cy.get('#password').should('be.visible')
      /* ==== End Cypress Studio ==== */
    })
  })
})


