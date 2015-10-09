(function(){
	angular.module('imgame.service')
	.factory('Review', function Review($http){
		function createReview(review){
			return $http({
        method: 'POST',
        url: '/gameposts/'+review.gamepost_id+ '/reviews',
        data: review
      }).then(function(resp){
      	console.log("response from review service: ", resp)
        return resp.data;
      });
		}
			return {
				createReview: createReview
			}
	  });


})();