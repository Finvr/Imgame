(function(){

  angular.module("imgame", [
  		'imgame.home',
  		'ngRoute',
  	])
  	.config(config);

  	function config($routeProvider, $httpProvider) {
			$routeProvider
			.when('/', {
        templateUrl: 'app/auth/homeTemplate.html',
        controller: 'HomeController'
      })
  	};
})();