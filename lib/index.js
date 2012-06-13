/**
 * Cantina Auth FreedomWorks
 * -------------------------
 *
 * FreedomWorks authentication plugin for Cantina.
 *
 * @module cantina
 * @submodule auth-freedomworks
 * @main auth-freedomworks
 */

// Modules dependencies.
var utils = require('cantina-utils');

// Export sub-modules.
utils.lazy(exports, __dirname, {
  plugin: './plugin'
});
