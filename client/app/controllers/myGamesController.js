(function(){
	angular.module('imgame.myGames', [])
	  .controller('MyGamesController', MyGamesController);

  function MyGamesController($scope, $window, $location, $route, Auth, GamePost, Profile, Invitations,Review){

    /* Modal functions */
    $scope.showHostedEventModal = function(date){
      $scope.gameToShowDetails = date.data;
      $scope.getGamepostPictures($scope.gameToShowDetails);
      $('#game-details').openModal();
    }

    $scope.close = function(selector) {
      $(selector).closeModal();
    }

    /* Service calling functions */
    var getMyGames = function(s,e,t,callback){ //find less hacky solution
      return GamePost.myHostedGames()
        .then(function(games){
          $scope.myGames = games;
          var events = $scope.myGames.map(function(game) {
            console.log("game: ", game)
            var newEvent = {};
            newEvent.title = game.game;
            newEvent.start = moment(game.game_datetime);
            newEvent.data = game;
            return newEvent;
          });
          callback(events);
        });
    };

    $scope.getReviews = function() {
      return Profile.getReviews()
        .then(function(data){
          return $scope.existingReviews = data;
        })
    };

    $scope.getRecentGames = function(){
        return $scope.getReviews()
        .then(function(reviews){
          return Profile.getRecentGames()
        })
        .then(function(games){
          games.forEach(function(game){
            game.user_id = game.user_id ? game.user_id : game.host_id;
            $scope.existingReviews.forEach(function(review){
              if (review.gameposts_id === game.gamepost_id && review.reviewer_id === game.user_id) {
                game.reviewed = true;
              }
            })
          })                     
          $scope.recentGames = games;
        })
    };

    $scope.openRateModal = function(game) {
      console.log('game modal: ', game)
      // game.host_name=true;
      if (game.host_name) {
        game.playerPics.unshift({
          picture: game.host_pic,
          user_id: game.host_id,
          username: game.host_name
        });
      }
      game.playerPics.forEach(function(player){
        player.skip = true;
        player.showed_up
        player.rating = 3;
      })
      $scope.currentRateGame = game;
    };

    $scope.sendReviews = function (players){
      var gamepostId = $scope.currentRateGame.gamepost_id;
      var reviews = [];
      for (var i = 0; i < players.length; i++){
        var player = {}
        if (!players[i].skip) {
          player.reviewee_id = players[i].user_id
          player.gameposts_id = gamepostId;
          player.rating = players[i].rating;
          player.showed_up = players[i].showed_up;
          reviews.push(player)
        }
      }
      if (reviews.length > 0) {
        Review.createReview(reviews)
          .then(function(reviews){
            $scope.currentRateGame.reviewed = true;
            console.log("reviews from profile controller : ", reviews)                
          });        
      }
    };



    var getMyProfile = function(){
      Profile.getProfile().then(function(profile){
        $scope.myProfile = profile;
      });
    };

    var getMyRequests = function(s,e,t,callback){
      return GamePost.myRequests()
        .then(function(requests){
          if (requests === 'request does not exist'){
            $scope.myRequests = [];
          } else {
            $scope.myRequests = requests;
          }
          var events = $scope.myRequests.filter(function(request){
            return request.status === 'accepted'
          }).map(function(request){
            console.log('request: ', request)
            var newEvent = {};
            newEvent.title = request.game;
            newEvent.start = moment(request.game_datetime);
            newEvent.data = request;
            return newEvent;
          });
          callback(events);
        });
    };

    var getMyInvitations = function(){
      Invitations.all()
        .then(function(invitations){
          console.log("invitation", invitations)
          if (typeof invitations === "string") {
            $scope.myInvitations = [];       
          } else {
            $scope.myInvitations = invitations;
          }
        });
    }

    $("#agenda").click(function(){
      console.log('$("#agenda").text', $("#agenda").text())
      if ($("#agenda").text() === "Calendar View") {
        $("#agenda").text("Agenda View");        
      } else {
        $("#agenda").text("Calendar View");
      }
      $("#calendar").toggle();
      $("#agendaList").toggle();
    })

    $("#agendaList").hide();

    $scope.uiConfig = {
      calendar:{
        height: 530,
        editable: false,
        header:{
          left: 'month basicWeek basicDay',
          center: 'title',
          right: 'today prev,next'
        },
        eventClick: $scope.showHostedEventModal
      }
    };

    $scope.init = function() {
      Auth.requireAuth();
      getMyGames(null,null,null,function(){}); //find less hacky solution
      getMyRequests(null,null,null,function(){});
      getMyProfile();
      getMyInvitations();
      $scope.getReviews();
      $scope.getRecentGames();
      /* Scope variables */
      $scope.eventSources = [getMyGames, getMyRequests];
      $scope.gameToShowDetails = null;
      $scope.gameToCancel = null;
      $scope.gameToApprove = null;
      $scope.invitationToReview = null;
    };
    
    $scope.init();

    $scope.getGamepostPictures = function(game){
      var gamePostId = game.gamepost_id ? game.gamepost_id : game.id;
      return GamePost.getPictures(gamePostId)
        .then(function(data){
          $scope.gameToShowDetails.playersPictures = data;
          return data;
        })
    }

    $scope.setGameToCancel = function(game){
      $scope.gameToCancel = game;
      $scope.close('#game-details');
    }

    $scope.cancelGame = function() {
      return GamePost.deleteGame($scope.gameToCancel)
        .then(function(){
          $scope.close('#cancel-modal');
          $scope.gameToCancel = null;
          $scope.gameToShowDetails = null;
          $scope.init();
        });
    }

    $scope.setRequestToCancel = function(request) {
      $scope.requestToCancel = request;
      $scope.close('#game-details');
    }

    $scope.cancelRequest = function(request) {
      return GamePost.requestCancel(request)
      .then(function() {
        $scope.close('#cancelRequestModal');
        $scope.requestToCancel = null;
        $scope.gameToShowDetails = null;
        $scope.init();
      });
    }

    $scope.getGamepostRequest = function(game){
      return GamePost.gamepostRequest(game.id)
        .then(function(requests){
          $scope.gameToApprove = game;
          $scope.requests = requests;
        })
    };

    $scope.setInvitationToReview = function(invitation){
      $scope.invitationToReview = invitation;
    }

    $scope.requestConfirm = function(str, req) {
      req.status = str;
      return GamePost.requestConfirm(req)
        .then(function(data){
          $scope.init();
        })
    };

  };

})();
