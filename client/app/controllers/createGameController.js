(function(){
 angular.module('imgame.createGame', [])
 	.controller('CreateGameController', CreateGameController);

 	function CreateGameController($scope, $window, $location, GamePost, Auth){
 		$scope.game = {};
    $scope.gamesArray = GamePost.gamesArray;
    
    Auth.requireAuth();

    // set today as the ealiest day user can select
    $scope.now = new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000).toISOString().split('T')[0];

    //controller should not know anything about the DOM, this makes our tests fail
    //document.getElementById('game-datetime').setAttribute('min', $scope.now + "T00:00:00");

    $scope.createGame = function(game){
      game = { 
        "game_location": $scope.game.location, //start set in template
        "game": $scope.game.name,
        "gamepost_description": $scope.game.description,
        "player_count": $scope.game.numPlayers,
        "game_datetime": $scope.game.datetime, 
        "business": $scope.game.business, //start set in googleMapsDirective
        "lat": $scope.game.lat, 
        "lng": $scope.game.lng, 
      };
      GamePost.create(game)
        .then(function(data){
          $location.path("/my-games")
          // if user is not authrized, data = "User is not logged in!"
          console.log("create gamepost: ", data)
        })
      };
  };
   
})();