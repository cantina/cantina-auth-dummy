var assert = require('assert'),
    Zombie = require('zombie'),
    cantina = require('cantina'),
    auth = require('cantina-auth'),
    plugin = require('../').plugin;

describe('Authentication', function() {
  var app, browser;

  before(function(done) {
    app = cantina.createApp({
      amino: false,
      port: 9090,
      silent: true
    });

    app.use(auth.plugin, {
      serializeUser: function(user, done) {
        done(null, user);
      },
      deserializeUser: function(obj, done) {
        done(null, obj);
      }
    });

    app.use(plugin, {authURL: '/login'});

    app.router.get('/', function() {
      this.res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
      if (this.req.isAuthenticated()) {
        this.res.end('<body>Welcome, ' + this.req.user.displayName + '!</body>');
      }
      else {
        this.res.end('<body><a href="/login">click here to login</a></body>');
      }
    });

    app.router.get('/logout', function() {
      this.req.logout();
      this.res.redirect('/');
    });

    app.start(function() {
      browser = new Zombie({
        debug: false,
        runScripts: false,
        site: 'http://localhost:9090'
      });
      browser.on('error', function(error) {
        console.error(error);
      });
      done();
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
