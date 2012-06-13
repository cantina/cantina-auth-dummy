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

    app.use(plugin, {
      consumerKey: '884d36536702bfca872feb5b4e43ff3a',
      consumerSecret: 'd416fae3609ecdd578548071253273c0',
      callbackURL: 'http://localhost:3000/auth/freedomworks/callback',
      authURL: '/login',
      verify: function(token, tokenSecret, profile, done) {
        done(null, profile);
      }
    });

    app.router.get('/', function() {
      this.res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
      if (this.req.isAuthenticated()) {
        this.res.end('<body>Welcome, <a href="http://connect.freedomworks.org/user/' + this.req.user.id + '">' + this.req.user.displayName + '</a>!</body>');
      }
      else {
        this.res.end('<body><a href="/login">click here to login via FreedomWorks</a></body>');
      }
    });

    app.start(function() {
      browser = new Zombie({
        debug: false,
        runScripts: false,
        site: 'http://localhost:9090'
      });
      done();
    });
  });

  it('should authenticate against the freedomworks server', function(done) {
    browser.visit('/', function(err, browser, status) {
      assert.ifError(err, 'Error visiting "/"');
      assert.equal(status, 200, 'Non-200 response');
      browser.clickLink('a', function(err, browser, status) {
        // TODO: There is an error seemingly related to google plusone.
        // In order to programatically test we may need to create a more
        // simplified, machine-friendly, login page or something.
        assert.ifError(err);
        assert.equal(status, 200, 'Non-200 response');
        done();
      });
    });
  });

});
