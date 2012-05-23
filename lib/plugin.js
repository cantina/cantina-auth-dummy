/**
 * FreedomWorks authentication provider plugin.
 */

url = require('url');

// Expose this service's package info.
require('pkginfo')(module);
var FreedomWorksStrategy = require('passport-freedomworks').Strategy;

exports.attach = function(options) {
  var app = this;
  app.passport.use(new FreedomWorksStrategy(options, options.verify));
  options.successRedirect = options.successRedirect || '/';
  options.failureRedirect = options.failureRedirect || '/';

  if (options.authURL) {
    app.http.before.push(function(req, res, next) {
      if (url.parse(req.url).pathname === options.authURL && !req.isAuthenticated()) {
        return app.passport.authenticate('freedomworks').call(this, req, res, next);
      }
      res.emit('next');
    });
  }
  app.http.before.push(function(req, res, next) {
    if (url.parse(req.url).pathname === url.parse(options.callbackURL).pathname) {
      return app.passport.authenticate('freedomworks', options).call(this, req, res, next);
    }
    res.emit('next');
  });
};
