(function() {
  angular.module('imgame.service')
  .factory('BrowseGames', BrowseGames);

  function BrowseGames($http){
		function getGames(){
			return $http({
        method: 'GET',
        url: '/gameposts'
      })
      .then(function(resp) {
      	console.log("resp",resp.data);
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
				return resp.data
			})
			.catch(function(err){
				console.log("Error from sendRequest http request: ", err)
			})
		}
		  	
  	return {
  		getGames: getGames,
  		sendRequest: sendRequest
  	};
}
})();