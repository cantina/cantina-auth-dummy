cantina-auth-dummy
==================

Dummy authentication strategy for Cantina.

Dependencies
------------
- **auth** - Authentication support provided by [cantina-auth](https://github.com/cantina/cantina-auth)

Adds Middleware
---------------
- Dummy authentication middleware under the `authURL` route.

Configuration
-------------
- **authURL** - A URL to trigger the dummy authentication.

**Defaults**
```js
{
  'auth-dummy': {
    authURL: '/login'
  }
}
```

Usage
-----
Your application MUST listen for the authentication events:
- `auth:serialize`
- `auth:deserialize`

And optionally:
- `auth-dummy:verify`

Example
-------
```js
var app = require('cantina');

app.load(function(err) {
  if (err) return console.error(err);

  require(app.plugins.http);
  require(app.plugins.middleware);
  require('cantina-redis');
  require('cantina-session');
  require('cantina-auth');
  require('cantina-auth-dummy');

  app.on('auth:serialize', function(user) {
    return user;
  });
  app.on('auth:deserialize', function(obj) {
    return obj;
  });
  app.on('auth-dummy:verify', function(profile) {
    profile.uid = 'dummy';
    return profile;
  });

  app.init(function(err) {
    if (err) return console.error(err);

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
  });
});
```

- - -

### Developed by [Terra Eclipse](http://www.terraeclipse.com)
Terra Eclipse, Inc. is a nationally recognized political technology and
strategy firm located in Aptos, CA and Washington, D.C.

- - -

### License: MIT
Copyright (C) 2012 Terra Eclipse, Inc. ([http://www.terraeclipse.com](http://www.terraeclipse.com))

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is furnished
to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
