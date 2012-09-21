var app = require('cantina'),
    assert = require('assert'),
    Zombie = require('zombie');

describe('Authentication', function() {
  var browser, port = 9090;

  before(function(done) {
    app.load(function(err) {
      if (err) return done(err);

      require(app.plugins.http);
      require(app.plugins.middleware);
      require('cantina-redis');
      require('cantina-session');
      require('cantina-auth');
      require('../');

      app.conf.set('http:port', port);
      app.conf.set('http:silent', true);

      app.on('auth:serialize', function(user) {
        return user;
      });
      app.on('auth:deserialize', function(id) {
        return id;
      });
      app.on('auth-dummy:verify', function(profile) {
        profile.uid = 'test';
        return profile;
      });

      app.init(function(err) {
        // Add index route.
        app.middleware.get('/', function(req, res) {
          res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
          if (req.isAuthenticated()) {
            assert.equal(req.user.uid, 'test');
            res.end('<body>Welcome, ' + req.user.displayName + '!</body>');
          }
          else {
            res.end('<body><a href="/login">click here to login</a></body>');
          }
        });

        // Create zombie browser.
        browser = new Zombie({
          debug: false,
          runScripts: false,
          site: 'http://localhost:' + port
        });

        done();
      });
    });
  });

  it('should authenticate', function(done) {
    browser.visit('/')
      .then(function() {
        assert.ok(browser.html().search(/click here to login/));
      })
      .then(function() {
        return browser.clickLink('a');
      })
      .then(function() {
        assert.ok(browser.html().search(/Welcome, [A-Z][a-z]+ [A-Z][a-z]+!/));
      })
      .then(function() {
        return browser.clickLink('a');
      })
      .then(function() {
        assert.ok(browser.html().search(/click here to login/));
      })
      .finally(done);
  });

});
