var ecommerceApp = angular.module('ecommerceApp', ['ngRoute', 'ngCookies']);
ecommerceApp.controller('mainController', function($scope, $http, $location, $cookies){
	var apiPath = "http://localhost:3000";
	$scope.selected;
	$scope.cartArray = [];
	console.log($scope.cartArray);
	// $scope.username;
	// $scope.loggenIn;
	// $scope.signedInAs;
	checkToken();




	$scope.register = function(){
		$http.post(apiPath + '/addAccount', {
			username: $scope.username,
			password: $scope.password,
			password2: $scope.password2,
			email: $scope.email
		}).then(function successCallback(response){
			console.log('\u2713' + response.data.message + ' ' + response.data.username);
			if(response.data.message == 'added') {
				$cookies.put('token', response.data.token);
				$cookies.put('username', $scope.username);
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
				$location.path('/flavor');
				$scope.signedInAs = $scope.username;
				$scope.loggedIn = true;
				$cookies.put('token', response.data.token);
				// checkToken();
			}

		}, function errorCallback(response){
			console.log('connection error');
			
		});
	}

	$scope.saveSelected = function(option){

		$cookies.put('cart' + option, $scope.selected)
		$http.post(apiPath + '/addOption', {
			selected: $scope.selected
		})
		.then(function successCallback(response){
			console.log('success')
		}, function errorCallback(response){
			console.log(response)
		});
	}

	$scope.checkout = function(){
		$http.post(apiPath + '/checkout', {
			username: $scope.username,
			powderType: $cookies.get('cartpowderType'),
			flavor: $cookies.get('cartflavor'),
			size: $cookies.get('cartsize')
		}).then(function successCallback(response){
			$cookies.remove('cartpowderType');
			$cookies.remove('cartflavor');
			$cookies.remove('cartsize');
			cartArray = [];
		}, function errorCallback(response){


		});
	}

	$scope.loadCart = function(){
		$scope.cartArray = [];
		var cookieObj = $cookies.getAll();
		console.log(cookieObj)

		if(cookieObj.cartpowderType){
			$scope.cartArray.push(cookieObj.cartpowderType);
		}
		if(cookieObj.cartflavor){
			$scope.cartArray.push(cookieObj.cartflavor)
		}
		if(cookieObj.cartsize){
			$scope.cartArray.push(cookieObj.cartsize);
		}
		console.log($scope.cartArray);

	}

	function checkToken() {
		if($cookies.get('token')) {
			$http.get(apiPath + '/getUserData?token=' + $cookies.get('token'))
			.then(function successCallback(response){
				if(response.data.failure == 'badToken'){
					// $location.path = '/';
				}
				else if(response.data.failure == 'noToken'){
					// $location.path = '/login'
				}
				else if (response.data.success) {
					$scope.username = response.data.username
					$scope.signedInAs = $scope.username;
					$scope.loggedIn = true;
					console.log(response)
				}
			}, function errorCallback(response){
				console.log('checkToken GET failed')
				console.log(response);
			})
		}
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
	})
	.when('/powdertype', {
		templateUrl: 'views/powdertype.html',
		controller: 'mainController'
	})
	.when('/flavor', {
		templateUrl: 'views/flavor.html',
		controller: 'mainController'
	})
	.when('/size', {
		templateUrl: 'views/size.html',
		controller: 'mainController'
	})
	.when('/checkout', {
		templateUrl: 'views/checkout.html',
		controller: 'mainController'
	})
});