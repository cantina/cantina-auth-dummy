/**
 * Cantina Auth Dummy
 * ------------------
 *
 * Dummy authentication plugin for Cantina.
 *
 * @module cantina
 * @submodule auth-dummy
 * @main auth-dummy
 */

// Modules dependencies.
var utils = require('cantina-utils');

// Export sub-modules.
utils.lazy(exports, __dirname, {
  plugin: './plugin'
});
