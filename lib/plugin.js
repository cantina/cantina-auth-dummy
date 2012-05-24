/**
 * FreedomWorks authentication provider plugin.
 */

// Expose this service's package info.
require('pkginfo')(module);
var FreedomWorksStrategy = require('passport-freedomworks').Strategy;

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
