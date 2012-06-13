/**
 * FreedomWorks authentication provider plugin.
 *
 * @module cantina
 * @submodule auth-freedomworks
 */

// Module dependencies.
var utils = require('cantina-utils'),
    FreedomWorksStrategy = require('passport-freedomworks').Strategy;

// Expose this service's package info.
utils.pkginfo(module);

/**
 * @method attach
 * @param optons {Object} Plugin options.
 */
module.exports.attach = function(options) {
  this.passport.use(new FreedomWorksStrategy(options, options.verify));
  this.utils.defaults(options, {
    successRedirect: '/',
    failureRedirect: '/'
  });

  if (options.authURL) {
    this.middleware(options.authURL, this.passport.authenticate('freedomworks'));
  }
  this.middleware(options.callbackURL, this.passport.authenticate('freedomworks', options));
};
