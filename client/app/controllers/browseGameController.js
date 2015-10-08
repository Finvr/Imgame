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
	    			if ($scope.reqStatus === 'declined') {
	    				$scope.reqStatus = 'canceled';
	    			}
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
			var gameTime = Date.parse(gameTime);
			var startTime = Date.parse($scope.startDateFilter);
			var endTime = Date.parse($scope.endDateFilter) +  1000 * 60 * 60 * 24;
			if (!$scope.startDateFilter || gameTime > startTime - 1) {
				if (!$scope.endDateFilter || gameTime < endTime + 1) {
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
			if(Number(time.toString().slice(11,13))==0){
				//time is 6pm
				startTime = 64800000 + Number(time.toString().slice(14,16))* 6000
			}

			else if(Number(time.toString().slice(11,13))==1){
				//time is 7pm
				startTime = 68400000 + Number(time.toString().slice(14,16))* 6000
			}

			else if(Number(time.toString().slice(11,13))==2){
				//time is 8pm
				startTime = 72000000 + Number(time.toString().slice(14,16))* 6000
			}

			else if(Number(time.toString().slice(11,13))==3){
				//time is 9pm
				startTime = 75600000 + Number(time.toString().slice(14,16))* 6000
			}

			else if(Number(time.toString().slice(11,13))==4){
				//time is 10pm
				startTime = 79200000 + Number(time.toString().slice(14,16))* 6000
			}

			else if(Number(time.toString().slice(11,13))==5){
				//time is 11pm
				startTime = 82800000 + Number(time.toString().slice(14,16))* 6000
			}

			else if(Number(time.toString().slice(11,13))==6){
				//time is 12am
				startTime = Number(time.toString().slice(14,16))* 6000
			}

			else if(Number(time.toString().slice(11,13))==7){
				//time is 1am
				startTime = 3600000 + Number(time.toString().slice(14,16))* 6000
			}

			else if(Number(time.toString().slice(11,13))==8){
				//time is 2am
				startTime = 7200000 + Number(time.toString().slice(14,16))* 6000
			}

			else if(Number(time.toString().slice(11,13))==9){
				//time is 3am
				startTime = 10800000 + Number(time.toString().slice(14,16))* 6000
			}

			else if(Number(time.toString().slice(11,13))==10){
				//time is 4am
				startTime = 14400000 + Number(time.toString().slice(14,16))* 6000
			}

			else if(Number(time.toString().slice(11,13))==11){
				//time is 5am
				startTime = 18000000 + Number(time.toString().slice(14,16))* 6000
			}

			else if(Number(time.toString().slice(11,13))==12){
				//time is 6am
				startTime = 21600000 + Number(time.toString().slice(14,16))* 6000
			}

			else if(Number(time.toString().slice(11,13))==13){
				//time is 7am
				startTime = 25200000 + Number(time.toString().slice(14,16))* 6000
			}

			else if(Number(time.toString().slice(11,13))==14){
				//time is 8am
				startTime = 28800000 + Number(time.toString().slice(14,16))* 6000
			}

			else if(Number(time.toString().slice(11,13))==15){
				//time is 9am
				startTime = 32400000 + Number(time.toString().slice(14,16))* 6000
			}

			else if(Number(time.toString().slice(11,13))==16){
				//time is 10am
				startTime = 36000000 + Number(time.toString().slice(14,16))* 6000
			}

			else if(Number(time.toString().slice(11,13))==17){
				//time is 11am
				startTime = 39600000 + Number(time.toString().slice(14,16))* 6000
			}

			else if(Number(time.toString().slice(11,13))==18){
				//time is 12pm
				startTime = 43200000 + Number(time.toString().slice(14,16))* 6000
			}

			else if(Number(time.toString().slice(11,13))==19){
				//time is 1pm
				startTime = 46800000 + Number(time.toString().slice(14,16))* 6000
			}

			else if(Number(time.toString().slice(11,13))==20){
				//time is 2pm
				startTime = 50400000 + Number(time.toString().slice(14,16))* 6000
			}

			else if(Number(time.toString().slice(11,13))==21){
				//time is 3pm
				startTime = 54000000 + Number(time.toString().slice(14,16))* 6000
			}

			else if(Number(time.toString().slice(11,13))==22){
				//time is 4pm
				startTime = 57600000 + Number(time.toString().slice(14,16))* 6000
			}

			else if(Number(time.toString().slice(11,13))==23){
				//time is 5pm
				startTime = 61200000 + Number(time.toString().slice(14,16))* 6000
			}

			else if(Number(time.toString().slice(11,13))==24){
				//time is 6pm
				startTime = 64800000 + Number(time.toString().slice(14,16))* 6000
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