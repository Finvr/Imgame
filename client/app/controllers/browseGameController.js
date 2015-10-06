(function() {
	angular.module('imgame.browseGames', [])
		.controller('BrowseGameController', BrowseGameController);

	function BrowseGameController($rootScope, $scope,  BrowseGames, Auth, $location, GamePost) {
		$scope.games = [];
		$scope.requestMessage = {comments: ''};
		$scope.submitError = null;
		$scope.gamesArray = GamePost.gamesArray;
		$scope.distance_choices = {
			"Within 1 mile": 1,
			"Within 5 miles": 5,
			"Within 10 miles": 10,
			"More than 10 miles": Infinity
		}

		Auth.requireAuth('browse');

		$scope.startTimeFilter = null;
		$scope.endTimeFilter= null;

		$scope.$watchGroup(['$scope.startTimeFilter', '$scope.endTimeFilter'], function(used){
        if (used) {
          $scope.used = true;
        } else {
          $scope.used = false;
        } 
    }, true);

		$scope.$on("currentLocation", function(event, data){
			for (var i = 0; i < $scope.games.length; i ++){
				$scope.games[i].distance = $scope.games[i].H ? distance(data.lat, data.lng, $scope.games[i].H, $scope.games[i].L ) : null;
			}
			$scope.$apply();
		});

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

    BrowseGames.getGames()
			.then(function(resp) {
				console.log("BrowseGameController inside getGsmes", resp);
				$scope.games = resp;
				Auth.getCurrentLocation();
				$scope.getMyRequests();
			});

    $scope.hasPendingRequest = function(gameId) {
    	if($scope.myRequests) {
	    	for (var i = 0; i < $scope.myRequests.length; i++) {
	    		if ($scope.myRequests[i].gamepost_id === gameId) {
	    			return true;
	    		}
	    	}
	    	return false;
	    }
    }

    $scope.getRequestInfo = function(gameId) {
    	if($scope.myRequests) {
	    	for (var i = 0; i < $scope.myRequests.length; i++) {
	    		if ($scope.myRequests[i].gamepost_id === gameId) {
	    			console.log("status is ",  $scope.myRequests[i].status);
	    			$scope.reqStatus = $scope.myRequests[i].status;
	    			$scope.reqComments = $scope.myRequests[i].comments;
	    		}
	    	}
	    }
    }


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

		$scope.dateFilter = function(gameTime) {
			gameTime = Date.parse(gameTime);
			startTime = Date.parse($scope.startDateFilter);
			endTime = Date.parse($scope.endDateFilter);
			if (!$scope.startDateFilter || gameTime > startTime) {
				if (!$scope.endDateFilter || gameTime < endTime) {
					return true;				
				}
			} else {
				return false;
			}
		}

		$scope.timeFilter = function(time){

			var start= (document.getElementById('time').value)
			var startMS = (Number(start.slice(0,2)) * 3600000) + (Number(start.slice(3,5)) * 6000)
			var end= (document.getElementById('time2').value)
			var endMS= (Number(end.slice(0,2)) * 3600000) + (Number(end.slice(3,5)) * 6000)
			//12am - 12pm
			if(Number(time.toString().slice(11,13)) < 18 &&
				 Number(time.toString().slice(11,13)) > 6 ){
				  //calculate time in milliseconds that has passed for the day
				  var startTime= Number(time.toString().slice(11,13))*3600000+ Number(time.toString().slice(14,16))* 6000 - 21600000
			}

		  //time is between 12 and 6pm
			if(Number(time.toString().slice(11,13)) >= 18){
			     //calculate time in milliseconds that has passed for the day
			     var startTime= Number(time.toString().slice(11,13))*3600000+ Number(time.toString().slice(14,16))* 6000 - 21600000
			}
			//time is between 6pm and 12pm
			if(Number(time.toString().slice(11,13)) <= 6){
			     //calculate time in milliseconds that has passed for the day
			     var startTime= Number(time.toString().slice(11,13))*3600000+ Number(time.toString().slice(14,16))* 6000 + 43200000
			}


      if(!startMS && !endMS){return true}
	    if ((startMS <= startTime) && (endMS >= startTime )) {return true}
		  if ((startMS==0) && (endMS >= startTime)){return true}
		  if((endMS==0) && startMS <= startTime ){return true}
      else{return false}
			
	  };

		$scope.openGame = function(game) {
			$scope.submitError = null;
			$scope.requestMessage = {comments: ''};
			$scope.game = game;
		};

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

		$scope.close = function() {
			$("#openRequest").closeModal();
		}
	}
})();