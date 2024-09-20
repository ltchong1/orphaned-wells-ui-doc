describe('End to end testing', () => {
  beforeEach(() => {
    cy.loginByGoogleApi()
  })

  it('loads homepage', () => {
    cy.visit('/');
    cy.wait(1000);
    cy.screenshot('loaded homepage')
    cy.findByRole('img', {
      name: /logo/i
    })
    cy.findByRole('tab', {
      name: /projects/i
    })
    cy.findByRole('tab', {
      name: /records/i
    })
    cy.screenshot('successfully loaded homepage')
  })
})