(function() {
  angular.module('imgame.service')
  .factory('BrowseGames', BrowseGames);

  function BrowseGames($http){
		function getGames(){
			return $http({
        method: 'GET',
        url: '/gameposts'
      })
      .then(function(resp) { /* TODO: make this fix less hacky */
      	resp.data = resp.data.map(function(item) {
      		item.accepted_players = String(Number(item.accepted_players) + 1);
      		return item;
      	});
        return resp.data;
      });
		};

		function sendRequest(message, gamepostsId){
			return $http({
				method: 'POST',
				url: '/gameposts/' + gamepostsId + "/requests",
				data: message
			})
			.then(function(resp){
				return resp.data;
			})
			.catch(function(err){
				console.log("Error from sendRequest http request: ", err)
			})
		};
		  	
  	return {
  		getGames: getGames,
  		sendRequest: sendRequest
  	};
 	};

})();