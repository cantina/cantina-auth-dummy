var cantina = require('cantina'),
    auth = require('cantina-auth'),
    plugin = require('../').plugin;

var app = cantina.createApp({
  amino: false,
  port: 3000
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
    this.res.end('Welcome, <a href="http://connect.freedomworks.org/user/' + this.req.user.id + '">' + this.req.user.displayName + '</a>!');
  }
  else {
    this.res.end('<a href="/login">click here to login via FreedomWorks</a>');
  }
});

app.start();
