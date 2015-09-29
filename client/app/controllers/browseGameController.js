(function() {
	angular.module('imgame.browseGames', [])
		.controller('BrowseGameController', BrowseGameController);

	function BrowseGameController($scope, BrowseGames, Auth, $location) {
		$scope.games = [];
		$scope.requestMessage = {comments: ''};

		Auth.requireAuth();
		
		BrowseGames.getGames().then(function(resp) {
			console.log("inside getGsmes", resp);
			$scope.games = resp;
		});

		$scope.sendRequest = function(game) {
			BrowseGames.sendRequest($scope.requestMessage, game.id)
				.then(function(){
					$location.path('/my-games');
				})
		}
	}
})();