// import 'jest';
// import "cypress"

describe('End to end testing', () => {
  it('passes', () => {
    cy.visit('/');
    cy.wait(1000);
    cy.get('#login-button').click();
    cy.wait(50000)
  })
})