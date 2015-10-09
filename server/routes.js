var userController    = require('./controllers/userController.js'),
    gameController    = require('./controllers/gamePostsController.js'),
    requestController = require('./controllers/requestController.js'),
    notesController   = require('./controllers/notificationsController.js'),
    reviewsController = require('./controllers/reviewsController.js')
    passport          = require('passport');

var express = require('express');
var router = express.Router();

var checkAuth = userController.checkAuth;

//Passport routes
router.get('/auth/facebook', 
	passport.authenticate('facebook'));

router.get('/auth/facebook/callback', 
	passport.authenticate('facebook', {failureRedirect: '/'}), 
	function(req, res) {
    res.redirect('/#/my-games')
  });

//User routes
//Logout
router.get('/me/logout', 
  // checkAuth, 
  userController.logout
);
//Authenticate
router.get('/me', 
  checkAuth, 
  userController.loggedIn
);
//Get all gameposts hosted by 'me'
router.get('/me/gameposts', 
  checkAuth, 
  gameController.getUserGamePosts
); 
//Get all requests created by 'me'
router.get('/me/requests', 
  checkAuth, 
  requestController.getUserRequests
);
//Get the logged-in user's profile
router.get('/me/profile',
  checkAuth,
  userController.getMyProfile
);
//Update the user's profile
router.put('/me/profile',
  checkAuth,
  userController.updateProfile
);
//Get a user's profile
router.get('/users/:id',
  checkAuth,
  userController.getProfile
);

//GamePosts Routes
//Get all gameposts
router.get('/gameposts', 
  gameController.getAllGameposts
);
//Create a new gamepost (host a game)
router.post('/gameposts', 
  checkAuth, 
  gameController.createGamepost
);
//Cancel a gamepost
router.delete('/gameposts/:id',
  checkAuth, 
  gameController.deleteGamePost,
  requestController.declineAll,
  notesController.cancelledGame
);

//Get all requests for a gamepost
router.get('/gameposts/:id/requests', 
  checkAuth, 
  requestController.getGamePostRequests
);

//Get all pictures for a gamepost
router.get('/gameposts/:id/pictures', 
  checkAuth, 
  requestController.getRequestersPictures
);

//Submit a request to join a specific gamepost
router.post('/gameposts/:id/requests', 
  checkAuth, 
  notesController.newReq,
  requestController.createRequest
);

//Requests routes
//Cancel a request
router.delete('/requests/:id', 
  checkAuth, 
  requestController.deleteRequest
);

//Update the status of a request
router.put('/requests/:id', 
  checkAuth, 
  requestController.changeStatus,
  notesController.acceptedReq
);

//Notifications routes
//Get notifications
router.get('/me/notifications',
  checkAuth,
  notesController.getNotifications
);

//Set notifications to viewed
router.post('/me/notifications',
  checkAuth,
  notesController.updateNotifications
);

//create a review on a user
router.post('/gameposts/:id/reviews',
  checkAuth,
  reviewsController.findOrCreateReview
);

module.exports = router;