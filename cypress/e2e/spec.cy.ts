import '@types/jest';
import "cypress"

describe('End to end testing', () => {
  it('passes', () => {
    cy.visit('/')
  })
})