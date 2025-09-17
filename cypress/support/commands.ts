/// <reference types="cypress" />

// Custom commands for Cypress tests
// You can add your own custom commands here

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      dataCy(value: string): Chainable<JQuery<HTMLElement>>;
      
      /**
       * Custom command to remove webpack dev server overlay.
       * @example cy.removeOverlay()
       */
      removeOverlay(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('dataCy', (value) => {
  return cy.get(`[data-cy="${value}"]`);
});

Cypress.Commands.add('removeOverlay', () => {
  cy.get('body').then(($body) => {
    if ($body.find('#webpack-dev-server-client-overlay').length > 0) {
      cy.get('#webpack-dev-server-client-overlay').invoke('remove');
    }
  });
});

export {};
