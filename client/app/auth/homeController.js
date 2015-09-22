(function(){
 angular.module('imgame.home', [])
 	.controller('HomeController', HomeController);

 	function HomeController($scope){
 		$scope.home = "Hello, World";
 	};

})();