var cantina = require('cantina')
  , auth = require('cantina-auth')
  , app = cantina.createApp({amino: false})
  ;

app.use(auth.plugin, {
  serializeUser: function(user, done) {
    done(null, user);
  },
  deserializeUser: function(obj, done) {
    done(null, obj);
  }
});

app.use(require('../').plugin, {
  consumerKey: '884d36536702bfca872feb5b4e43ff3a',
  consumerSecret: 'd416fae3609ecdd578548071253273c0',
  callbackURL: 'http://localhost:3000/auth/freedomworks/callback',
  authURL: '/',
  verify: function(token, tokenSecret, profile, done) {
    done(null, profile);
  }
});

app.router.get('/', function() {
  this.res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
  this.res.end('Welcome, ' + this.req.user.displayName + '!');
});

app.start(3000);
console.log('Test app started on port ' + 3000);
