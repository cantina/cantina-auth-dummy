/**
 * FreedomWorks authentication provider plugin.
 *
 * @module cantina
 * @submodule auth-freedomworks
 */

// Module dependencies.
var DummyStrategy = require('passport-dummy').Strategy
  , idgen = require('idgen')
  , namegen = require('namegen')

module.exports = {
  name: 'auth-dummy',

  defaults: {
    authURL: '/login'
  },

  init: function(app, done) {
    var conf = app.conf.get('auth-dummy');

    app.passport.use(new DummyStrategy(function(cb) {
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
      if (app.verifyDummy) {
        app.verifyDummy(profile, cb);
      }
      else {
        cb(null, profile);
      }
    }));

    if (conf.authURL) {
      app.middleware.add(conf.authURL, app.passport.authenticate('dummy'));
      app.middleware.add(conf.authURL, function(req, res) {
        res.redirect('/');
      });
    }

    done();
  }
};
