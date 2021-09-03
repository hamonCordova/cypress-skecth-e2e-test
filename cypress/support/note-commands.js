Cypress.Commands.add('createNote', (description, attachFile = false, attachmentFilePath = 'example.json') => {

    cy.intercept('POST', '**/notes').as('insertNote')
    cy.intercept('GET', '**/notes').as('getNotes')

    cy.login()
    cy.visit('/')

    cy.contains(' new note', {matchCase: false}).click();

    if (attachFile) {
        cy.get('#file').attachFile(attachmentFilePath)
    }

    cy.get('#content').type(description);
    cy.get('button[type=submit]').click();

    cy.wait('@insertNote').then(res => {
        expect(res.response.body.noteId).to.exist
    })

    cy.wait('@getNotes')

    cy.contains('h1', 'Your Notes').should('be.visible')
    cy.contains('.list-group-item', description).should('exist')

})

Cypress.Commands.add('updateNoteByDescription', (currentDescription, newDescription, attachFile = false, attachmentFilePath = 'example.json') => {

    cy.intercept('GET', '**/notes').as('getNotes')
    cy.intercept('GET', '**/notes/**').as('getNote')
    cy.intercept('PUT', '**/notes/**').as('updateNote')

    cy.login()
    cy.visit('/')

    cy.contains('.list-group-item', currentDescription).should('exist').click();

    cy.wait('@getNote').then(res => {
        expect(res.response.body.noteId).to.exist;
        expect(res.response.body.content).to.be.equals(currentDescription)
    })

    cy.get('#content').should('have.value', currentDescription);

    if (attachFile) {
        cy.get('#file').attachFile(attachmentFilePath)
    }

    cy.get('#content').clear().type(newDescription);
    cy.get('button[type=submit]').click();

    cy.wait('@updateNote').its('response.statusCode').should('eq', 200);

    cy.wait('@getNotes')

    cy.contains('h1', 'Your Notes').should('be.visible')
    cy.contains('.list-group-item', currentDescription).should('not.exist')
    cy.contains('.list-group-item', newDescription).should('exist')

})

Cypress.Commands.add('deleteNoteByDescription', (description) => {
    cy.intercept('GET', '**/notes').as('getNotes')
    cy.intercept('DELETE', '**/notes/**').as('deleteNote')

    cy.login()
    cy.visit('/')

    cy.contains('.list-group-item', description).should('exist').click();
    cy.contains('button', 'Delete', {matchCase: false}).should('exist').click();

    cy.wait('@deleteNote').its('response.statusCode').should('eq', 200);

    cy.wait('@getNotes')

    cy.contains('h1', 'Your Notes').should('be.visible')
    cy.contains('.list-group-item', description).should('not.exist')
});


Cypress.Commands.add('insertRandomNote', () => {
    const faker = require('faker')
    return cy.insertNote(faker.lorem.words(4))
})
