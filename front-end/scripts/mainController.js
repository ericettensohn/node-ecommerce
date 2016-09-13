var ecommerceApp = angular.module('ecommerceApp', ['ngRoute', 'ngCookies']);
ecommerceApp.controller('mainController', function($scope, $http, $location, $cookies){

	var apiPath = "http://localhost:3000";

	$scope.register = function(){
		$http.post(apiPath + '/addAccount', {
			username: $scope.username,
			password: $scope.password,
			password2: $scope.password2,
			email: $scope.email
		}).then(function successCallback(response){
			console.log('\u2713' + response.data.message + ' ' + response.data.username);
			if(response.data.message == 'added') {
				// $location.path('/options');
				$scope.regSuccessful = true;
			}
		}, function errorCallback(response){
			console.log(response)
		});
	}

	$scope.login = function(){

		$http.post(apiPath + '/login', {
			username: $scope.username,
			password: $scope.password
		}).then(function successCallback(response){


			if (response.data.failure == 'badUser'){
				$scope.badUser = true;
			}
			else if (response.data.failure == 'badPass'){
				$scope.badPass = true;
			}
			else if (response.data.success == 'goodPass'){
				
			}

		}, function errorCallback(response){
			console.log(response.data.failure)
			
		});
	}

});



ecommerceApp.config(function($routeProvider){
	$routeProvider.when('/', {
		templateUrl: 'views/main.html',
		controller: 'mainController'
	})
	.when('/login', {
		templateUrl: 'views/login.html',
		controller: 'mainController'
	})
	.when('/register', {
		templateUrl: 'views/register.html',
		controller: 'mainController'
	});
});