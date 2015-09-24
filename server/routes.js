var Utils   = require('./utils/helpers.js');
var userController = require('./controllers/userController.js');
var gameController = require('./controllers/gameController.js');

module.exports= function (app){

	app.get('/users/logout', function(req, res) {
	  req.logout();
	  res.redirect('/')
	})

	app.post('/users', function (req, res){
	  Utils.createUser(req, res);
	})

	app.get('/users/*', function (req, res){
	  res.send('get one user')
	})

	app.put('/users/*',function (req, res){
	  res.send('update a user')
	})

	app.delete('/users/*', function (req, res){
	  res.send('delete a user')
	})

	app.get('/users/*/games', function(req, res){
	  res.send('get the games for a specific user')
	}) 

	//GamePosts Routes
	app.get('/gameposts', function(req, res){
	  Utils.getAllGameposts(req, res);
	})

	app.post('/gameposts', function (req, res){
	  Utils.createGamepost(req, res);
	})
}

	


