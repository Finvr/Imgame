(function() {
	angular.module('imgame.browseGames', [])
		// .filter('startFrom', function() {
	 //    return function(input, start) {
		//     start = parseInt(start, 10);
		//     return input.slice(start);
  //   	}
		// })
		.controller('BrowseGamesController', BrowseGamesController);

	function BrowseGamesController($rootScope, $scope,  BrowseGames, Auth, $location, GamePost) {
		//Scope variable initialization
		$scope.games = [];
		$scope.requestMessage = {comments: ''};
		$scope.submitError = null;
		$scope.gamesArray = GamePost.gamesArray;
		$scope.startTimeFilter = null;
		$scope.endTimeFilter= null;
		$scope.distance_choices = {
			"Within 1 mile": 1,
			"Within 2 miles": 2,
			"Within 3 miles": 3,
			"Within 4 miles": 4,
			"Within 5 miles": 5,
			"Within 10 miles": 10,
			"More than 10 miles": Infinity
		}

		//////////////////////////////////////////////////////////////////
		// initiate the page, get all games and request
		//////////////////////////////////////////////////////////////////
		init();

		function init () {
			//Functions called on controller start
			Auth.requireAuth('browse');
			BrowseGames.getGames()
				.then(function(resp) {
					$scope.newGames = resp.slice();
					$scope.games = resp;
					Auth.getCurrentLocation();
					$scope.getMyRequests();
				});

			$scope.$on("currentLocation", function(event, data){
				for (var i = 0; i < $scope.games.length; i ++){
					$scope.games[i].distance = $scope.games[i].lat ? distance(data.lat, data.lng, $scope.games[i].lat, $scope.games[i].lng ) : null;
				}
				$scope.$apply();
			});

			//Request functions
			$scope.getMyRequests = function(){
	      return GamePost.myRequests()
	        .then(function(requests){
	          if (requests === 'request does not exist'){
	            $scope.myRequests = [];
	            console.log('$scope.myRequests', $scope.myRequests);
	          } else {
	            $scope.myRequests = requests;
	            console.log('$scope.myRequests', $scope.myRequests);
	          }
	        });
	    };
		}
		// init complete

    // requestSent func check if the user has sent a request to the game
    $scope.requestSent = function(gameId) {
    	if($scope.myRequests) {
	    	for (var i = 0; i < $scope.myRequests.length; i++) {
	    		if ($scope.myRequests[i].gamepost_id === gameId) {
	    			return true;
	    		}
	    	}
	    	return false;
	    }
    }

    // if request has already sent, show details of the request
    $scope.getRequestInfo = function(gameId) {
    	if($scope.myRequests) {
	    	for (var i = 0; i < $scope.myRequests.length; i++) {
	    		if ($scope.myRequests[i].gamepost_id === gameId) {
	    			$scope.reqStatus = $scope.myRequests[i].status;
	    			if ($scope.reqStatus === 'declined') {
	    				$scope.reqStatus = 'canceled';
	    			}
	    			$scope.reqComments = $scope.myRequests[i].comments;
	    		}
	    	}
	    }
    }

		// Pagination 
		// $scope.pageSize = 8;
		// $scope.currentPage = $scope.currentPage || 1;
		// $scope.displayPage = function(page) {
		// 	$scope.currentPage = page;
		// }

		/////////////////////
		//// filters 
		/////////////////////

		// Distance functions
		function distance(lat1, lon1, lat2, lon2) {
			var radlat1 = Math.PI * lat1/180
			var radlat2 = Math.PI * lat2/180
			var radlon1 = Math.PI * lon1/180
			var radlon2 = Math.PI * lon2/180
			var theta = lon1-lon2
			var radtheta = Math.PI * theta/180
			var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
			dist = Math.acos(dist)
			dist = dist * 180/Math.PI
			dist = dist * 60 * 1.1515
			return Math.round(dist*10)/10;
		}

		$scope.disFilter = function(dis) { 
			var disSelect = $scope.distance ? $scope.distance_choices[$scope.distance] : null;
			if (dis && disSelect) {
				return dis < disSelect;
			} else {
				return true;				
			}
		}

		// name filter
		$scope.nameFilter = function(name) {
			console.log("name", name)
			if (!$scope.searchText || (name && name.toUpperCase().includes($scope.searchText.toUpperCase()))) {
				return true;
			} else {
				return false;
			}
		}

		//Date and time functions
		$scope.dateFilter = function(gameDate) {
			var gameDate = Date.parse(gameDate);
			var startTime = Date.parse($scope.startDateFilter);
			var endTime = Date.parse($scope.endDateFilter) +  1000 * 60 * 60 * 24;
			if (!$scope.startDateFilter || gameDate > startTime - 1) {
				if (!$scope.endDateFilter || gameDate < endTime + 1) {
					return true;				
				}
			} else {
				return false;
			}
		}

		$scope.timeFilter = function(time){
			var time = new Date(time).toString().split(" ")[4].split(":").slice(0,2);
			var startTime= (document.getElementById('startTime').value) && (document.getElementById('startTime').value).toString().split(":");
			var endTime = (document.getElementById('endTime').value) && (document.getElementById('endTime').value).toString().split(":");

			if (!startTime || Number(startTime[0]) <= Number(time[0])) {
				if (!endTime || Number(endTime[0]) >= Number(time[0])) {
					return true;
				}
			} else {
				return false;
			}	
	  };

	  ///////////////////////
	  // modal related func
	  ///////////////////////

	  //Modal functions
		$scope.openGame = function(game) {
			$scope.submitError = null;
			$scope.requestMessage = {comments: ''};
			$scope.game = game;
			$scope.getGamepostPictures(game);
		};

		// get pictures when modal is open
		$scope.getGamepostPictures = function(game){
      var gamePostId = game.gamepost_id ? game.gamepost_id : game.id;
      return GamePost.getPictures(gamePostId)
        .then(function(data){
          $scope.game.playersPictures = data;
          return data;
        })
    }

    // send request to sever when send is clicked in modal
    $scope.sendRequest = function(game) {
			BrowseGames.sendRequest($scope.requestMessage, game.id)
				.then(function(data){
					console.log("data", data)
					if (typeof data === 'string' && data.includes('already been submmited')) {
						$scope.submitError = "You have already submitted your request!";
					} else {
						$("#openRequest").closeModal();
						$location.path('/my-games');
					}
				})
		}

		// modal close func
		$scope.close = function() {
			$("#openRequest").closeModal();
		}

	}
})();