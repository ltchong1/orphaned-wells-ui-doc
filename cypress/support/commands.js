/// <reference types="cypress" />
// ***********************************************
// For comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// cypress/support/commands.js
import '@testing-library/cypress/add-commands'
Cypress.Commands.add('loginByGoogleApi', () => {
    cy.log('Logging in to Google')
    let request_body = {
      grant_type: 'refresh_token',
      client_id: Cypress.env('googleClientId'),
      client_secret: Cypress.env('googleClientSecret'),
      refresh_token: Cypress.env('googleRefreshToken'),
    }
    cy.request({
      method: 'POST',
      url: 'https://www.googleapis.com/oauth2/v4/token',
      body: request_body,
    }).then(({ body }) => {
      const { access_token, id_token } = body
      window.localStorage.setItem('access_token', access_token)
      window.localStorage.setItem('id_token', id_token)
      cy.request({
        method: 'POST',
        url: Cypress.env('backendURL')+'/check_auth',
        body: JSON.stringify(id_token),
        headers: { Authorization: `Bearer ${id_token}` },
      }).then(({ body }) => {

        window.localStorage.setItem("user_email", body.email)
        window.localStorage.setItem("user_hd", body.hd)
        window.localStorage.setItem("role", ""+body.role)
        window.localStorage.setItem("user_name", body.name)
        window.localStorage.setItem("user_picture", body.picture)
        window.localStorage.setItem("user_info", JSON.stringify(body))
        cy.visit('/')
      })
    })
  })