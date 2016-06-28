// Import needed modules
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');;
const uuid = require('node-uuid');
const appData = require('./data.json');

// Get key used to sign the JWTs
const JWT_KEY = process.env.JWT_KEY || 'ballersecretkey';
// Get issuer for JWTs
const JWT_ISSUER = process.env.JWT_ISSUER || 'awesomeApi.com';

// Create app data (mimics a DB)
const userData = appData.users;
const exclamationData = appData.exclamations;

function getUser(username) {
  const user = userData.find(u => u.username === username);
  return Object.assign({}, user);
}

// Create default port
const PORT = process.env.PORT || 3000;

// Create a new server
const server = express();

// Configure server
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(session({
  secret: process.env.SESSION_SECRET || 'awesomecookiesecret',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    url: 'mongodb://localhost/vue2-auth',
  }),
}));
server.use(flash());
server.use(express.static('public'));
server.use(passport.initialize());
server.use(passport.session());
server.set('views', './views');
server.set('view engine', 'pug');

// Configure Passport
passport.use(new LocalStrategy(
  (username, password, done) => {
    const user = getUser(username);

    if (!user || user.password !== password) {
      return done(null, false, { message: 'Username and password combination is wrong' });
    }

    delete user.password;

    return done(null, user);
  }
));

// Serialize user in session
passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(username, done) {
  const user = getUser(username);

  done(null, user);
});

// Create custom middleware functions
function hasScope(scope) {
  return (req, res, next) => {
    const { scopes } = req.user;

    if (!scopes.includes(scope)) {
      req.flash('error', 'The username and password are not valid.');
      return res.redirect('/');
    }

    next();
  };
}

function isAuthenticated(req, res, next) {
  if (!req.user) {
    req.flash('error', 'You must be logged in.');
    return res.redirect('/');
  }

  next();
}

// Create home route
server.get('/', (req, res) => {
  if (res.user) {
    return res.redirect('/dashboard');
  }

  res.render('index');
});

server.get('/dashboard',
  isAuthenticated,
  (req, res) => {
    res.render('dashboard');
  }
);

// Create auth routes
const authRoutes = express.Router();

authRoutes.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/',
    successRedirect: '/dashboard',
    failureFlash: true,
  })
);

server.use('/auth', authRoutes);

// Create API routes
const apiRoutes = express.Router();

apiRoutes.use(passport.authenticate('local'));

apiRoutes.get('/me', (req, res) => {
  res.json({ user: req.user });
});

// Get all of a user's exclamations
apiRoutes.get('/exclamations',
  hasScope('read'),
  (req, res) => {
    const { username } = req.user;
    const exclamations = exclamationData.filter(exc => exc.user === username);

    res.json({ exclamations });
  }
);

// Add an exclamation
apiRoutes.post('/exclamations',
  hasScope('add'),
  (req, res) => {
    const { username } = req.user;
    const { text } = req.body;
    const exclamation = {
      id: uuid.v4(),
      text: text,
      user: username,
    };

    exclamationData.push(exclamation);

    res.status(201).json({ exclamation });
  }
);

// Edit an exclamation
apiRoutes.put('/exclamations/:id',
  hasScope('edit'),
  (req, res) => {
    const { id } = req.params;
    const { username } = req.user;
    const { text } = req.body;
    const exclamation = exclamationData.find(exc => exc.id === id);

    if (!exclamation || exclamation.user !== username) {
      return res.status(403).json({ "message": "You can't edit that exclamation." });
    }

    exclamation.text = text;

    res.json({ exclamation });
  }
);

// Delete an exclamation
apiRoutes.delete('/exclamations/:id',
  hasScope('delete'),
  (req, res) => {
    const { id } = req.params;
    const { username } = req.user;
    const exclamationIndex = exclamationData.findIndex(exc => exc.id === id);
    const exclamation = exclamationData[exclamationIndex];

    if (!exclamation || exclamation.user !== username) {
      return res.status(403).json({ "message": "You can't delete that exclamation." });
    }

    exclamationData.splice(exclamationIndex, 1);

    res.sendStatus(204);
  }
);

server.use('/api', apiRoutes);

// Start the server
server.listen(PORT, () => {
  console.log(`The API is listening on port ${PORT}`);
});
