// This file is processed and loaded automatically before your test files.

import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR requests in Command Log
Cypress.on('window:before:load', (win) => {
  const originalFetch = win.fetch;
  win.fetch = function (...args) {
    return originalFetch.apply(this, args);
  };
});
