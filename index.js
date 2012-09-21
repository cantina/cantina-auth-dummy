/**
 * FreedomWorks authentication provider plugin.
 *
 * @module cantina
 * @submodule auth-freedomworks
 */

// Module dependencies.
var app = require('cantina')
  , DummyStrategy = require('passport-dummy').Strategy
  , idgen = require('idgen')
  , namegen = require('namegen')

app.conf.add({
  'auth-dummy': {
    authURL: '/login'
  }
});

app.on('init', function() {
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
    app.invoke('auth-dummy:verify', profile, cb);
  }));

  if (app.authURL) {
    app.middleware.add(conf.authURL, app.passport.authenticate('dummy'));
    app.middleware.add(conf.authURL, function(req, res) {
      res.redirect('/');
    });
  }
});

app.on('ready', function() {
  // Provide default verfify callback.
  if (!app.listeners('auth-dummy:verfiy').length) {
    app.on('auth-dummy:verfiy', function(profile) {
      return profile;
    });
  }
});
