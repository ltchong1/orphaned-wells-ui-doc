describe('End to end testing', () => {
  beforeEach(() => {
    cy.loginByGoogleApi()
  })

  it('tests that each page loads correctly', () => {
    cy.visit('/');
    cy.wait(1000);
    cy.screenshot('loaded homepage')
    
    // test that correct user is logged in
    // cy.findByRole('button', {
    //   name: /michael p/i
    // }).should('be.visible')

    // test that privileges are working
    cy.findByRole('button', {
      name: /new project/i
    }).should('be.visible')
    cy.findByRole('tab', {
      name: /users/i
    }).should('be.visible')

    cy.screenshot('homepage')

    // navigate to project page
    cy.findByRole('rowheader', {
      name: /test project 1/i
    }).click()

    // test that project page loaded correctly
    cy.findByRole('button', {
      name: /test project 1/i
    }).should('be.visible')
    cy.findByRole('columnheader', {
      name: /record name/i
    }).should('be.visible')

    cy.screenshot('project page')

    // click record
    cy.get('.MuiTableRow-root').eq(1).click();
    
    // test that record page loaded correctly
    cy.findByRole('columnheader', {
      name: /field/i
    }).should('be.visible')

    cy.screenshot('record page')
  })

  it('tests create new project', () => {
    
  })

  it('tests delete project', () => {
    
  })

  it('tests export data', () => {
    
  })

  it('tests edit field', () => {
    
  })

})