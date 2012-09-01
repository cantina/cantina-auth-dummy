var assert = require('assert'),
    Zombie = require('zombie'),
    cantina = require('cantina');

describe('Authentication', function() {
  var app, browser, port = 9090;

  before(function(done) {
    var authHelpers = {
      name: "authHelpers",
      version: "0.0.1",
      init: function(app, done) {
        app.serializeUser = function(user, cb) {
          cb(null, user);
        };
        app.deserializeUser = function(obj, cb) {
          cb(null, obj);
        };
        app.verifyDummy = function(profile, db) {
          profile.uid = 'test';
          cb(null, profile);
        };
        done();
      }
    };

    var plugins = [
      'http',
      'middleware',
      'cantina-redis',
      'cantina-session',
      authHelpers,
      'cantina-auth',
      '../'
    ];

    var conf = {
      http: {port: port, silent: true}
    };

    // Create app.
    app = cantina.createApp(plugins, conf, function(err, app) {
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
        site: 'http://localhost:9090'
      });

      done();
    });
  });

  after(function(done) {
    app.http.close(done);
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
