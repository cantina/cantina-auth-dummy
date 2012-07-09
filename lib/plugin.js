/**
 * FreedomWorks authentication provider plugin.
 *
 * @module cantina
 * @submodule auth-freedomworks
 */

// Module dependencies.
var utils = require('cantina-utils')
  , DummyStrategy = require('passport-dummy').Strategy
  , idgen = require('idgen')
  , namegen = require('namegen')
  ;

// Expose this service's package info.
utils.pkginfo(module);

/**
 * @method attach
 * @param optons {Object} Plugin options.
 */
module.exports.attach = function(options) {
  this.passport.use(new DummyStrategy(function(done) {
    var name = namegen();
    var profile = {
      id: idgen(),
      username: name.first + name.last + idgen(3, '123456789'),
      displayName: name.first + ' ' + name.last,
      name: {
        familyName: name.last,
        givenName: name.first
      }
    };
    done(null, profile);
  }));

  if (options.authURL) {
    this.middleware(options.authURL, [
      this.passport.authenticate('dummy'),
      function(req, res) {
        res.redirect('/');
      }
    ]);
  }
};
