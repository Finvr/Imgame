(function(){

  angular.module('imgame.service')
  .factory('GamePost', GamePost);

  function GamePost($http) {
  	function create(gameInfo){
			return $http({
        method: 'POST',
        url: '/gameposts',
        data: gameInfo
      })
      .then(function(resp) {
        return resp.data;
      })
      .catch(function(err) {
        console.log("Create game Error: ", err);
        return err.data;
      });
  	};

    function myRequests(){
      return $http({
          method: 'GET',
          url: '/me/requests'
      })
      .then(function(requests){
        return requests.data;
      });
    };

    function myHostedGames(){
      return $http({
        method: 'GET',
        url: '/me/gameposts'
      })
      .then(function(gamePosts){
        return gamePosts.data;
      });
    };

    function gamepostRequest(gamepostId) {
      return $http({
        method: 'GET',
        url: '/gameposts/' + gamepostId + '/requests'
      })
      .then(function(requests){
        console.log("gamepostRequest resp: ", requests)
        return requests.data;
      })
    };

    function requestConfirm(request) {
      return $http({
        method: "PUT",
        url: "/requests/" + request.id,
        data: request
      })
      .then(function(resp) {
        console.log("requestConfirm service resp: ", resp);
        return resp.data;
      })
      .catch(function(err) {
        console.log("requestConfirm service Error: ", err);
        return err.data;
      });
    }

    function requestCancel(request) {
       console.log("request in service", request);
      return $http({
        method: "DELETE",
        url: "/requests/" + request.id,
        data: JSON.stringify(request)
      })
      .then(function(resp) {
        console.log("delete request: ", request);
        console.log("resp", resp);
        return resp.data;
      })
      .catch(function(err) {
        console.log("requestConfirm service Error: ", err);
        return err.data;
      });
    }

    function deleteGame(game){
      console.log("game", game);
      return $http({
        method: "DELETE",
        url: "/gameposts/"+ game.id
      })
      .then(function(resp) {
        console.log("deleteresp", resp);
        return resp.data;
      })
      .catch(function(err) {
        return err.data;
      })
    }
  	
  	return {
  		create: create,
      myHostedGames: myHostedGames,
      myRequests: myRequests,
      gamepostRequest: gamepostRequest,
      requestConfirm: requestConfirm,
      requestCancel: requestCancel,
      deleteGame: deleteGame
  	};
  };

})();
