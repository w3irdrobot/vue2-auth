// Import needed modules
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const JwtStrategy = require('passport-jwt');
const jwt = require('jsonwebtoken');

// Get key used to sign the JWTs
const JWT_KEY = process.env.JWT_KEY || 'ballersecretkey';
// Get issuer for JWTs
const JWT_ISSUER = process.env.JWT_ISSUER || 'awesomeApi.com';

// Create app data (mimics a DB)
const userData = {
  rachel: {
    password: 'green',
    scopes: ['read', 'edit', 'delete'],
  },
  ross: {
    password: 'geller',
    scopes: ['read'],
  },
};

// Create default port
const PORT = process.env.PORT || 3000;

// Create a new server
const server = express();

// Configure server
server.use(bodyParser.json());
server.use(express.static('public'));
server.use(passport.initialize());

// Configure Passport
passport.use(new LocalStrategy(
  { session: false },
  (username, password, done) => {
    const user = userData[username];
    if (!user || user.password !== password) {
      return done('Username and password combination is wrong');
    }

    return done(null, user);
  }
));

// Create API routes
const apiRoutes = express.Router();

apiRoutes.post('/login',
  passport.authenticate('local', { session: false }),
  (req, res) => {
    jwt.sign(req.user, JWT_KEY, {
      algorithm: 'HS256',
      expiresIn: '14d',
      issuer: JWT_ISSUER
    }, (error, token) => {
      if (error) return res.status(500).json({ err });

      res.json({ token });
    });
  }
);

server.use('/api', apiRoutes);

// Start the server
server.listen(PORT, () => {
  console.log(`The API is listening on port ${PORT}`);
});
