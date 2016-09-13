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
			console.log(response.data.message + ' ' + response.data.username);
			if(response.data.message == 'added') {
				$location.path('/options');
			}
		}, function errorCallback(response){
			console.log(response)
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