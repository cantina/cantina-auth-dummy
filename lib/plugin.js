/**
 * FreedomWorks authentication provider plugin.
 */

url = require('url');

// Expose this service's package info.
require('pkginfo')(module);
var FreedomWorksStrategy = require('passport-freedomworks').Strategy;

module.exports.attach = function(options) {
  this.passport.use(new FreedomWorksStrategy(options, options.verify));
  options.successRedirect = options.successRedirect || '/';
  options.failureRedirect = options.failureRedirect || '/';

  if (options.authURL) {
    this.middleware(options.authURL, this.passport.authenticate('freedomworks'));
  }
  this.middleware(options.callbackURL, this.passport.authenticate('freedomworks', options));
};
