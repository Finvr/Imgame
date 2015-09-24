var express = require('express');
var parse = require('body-parser');
var Utils   = require('./utils/helpers.js');
var passport = require('passport');
var FacebookStrategy = require("passport-facebook").Strategy;
var config = require('./oauth.js');
var sessions = require('cookie-session');
var logger = require('morgan');
var app = express();
var userController = require('./controllers/userController.js')
var routes = require('./routes.js');

app.use(sessions({
  name: 'imgame:session',
  secret: process.env.SESSION_SECRET || 'development',
  secure: (!! process.env.SESSION_SECRET),
  signed: true
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(logger('dev'));

passport.serializeUser(function(user, done){
  console.log('passport serializeUser user: ', user)
  done(null, user);
})

passport.deserializeUser(function(userId, done){
  done(null, userId);
})

passport.use(new FacebookStrategy ({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    var user = {username: profile.displayName, facebook_id: profile.id}
    return done(null, user);
    }
));

app.use(parse.urlencoded({extended: true}));
app.use(parse.json());
app
app.use(express.static(__dirname + '/../client'));


//User Routes
app.get('/auth/facebook', 
  passport.authenticate('facebook'));

app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', {failureRedirect: '/'}), 
  function (req, res) {
    userController.createUser(req, res);
  })

app.use(routes, express);

var port = 3000
app.listen(port, function() {
  console.log("Listening to localhost, port #: ", + port);
});
