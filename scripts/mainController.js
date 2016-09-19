var ecommerceApp = angular.module('ecommerceApp', ['ngRoute', 'ngCookies']);
ecommerceApp.controller('mainController', function($scope, $http, $location, $cookies, $timeout){
	var apiPath = "http://52.42.192.215:3000";
	$scope.selected;
	$scope.cartArray = [];
	console.log($scope.cartArray);
	// $scope.username;
	// $scope.loggenIn;
	// $scope.signedInAs;
	checkToken();

	var testSecretKey = 'sk_test_4AAQUIJPsnrUPYJkWL5eHqJQ';
	var testPublishableKey = 'pk_test_2B8DuadWMIvzdFgCQLm5v58S';
	var liveSecretKey = 'sk_live_4dBWaL2t0MJMf7IQEkGgxCcE';
	var livePublishableKey = 'pk_live_fCCA4B9upLlFwdjR4EZRwEHn';

	if($location.path() == '/checkout') {
		$scope.type = $cookies.get('cartpowderType');
		$scope.flavor = $cookies.get('cartflavor');
		$scope.size = $cookies.get('cartsize');

		if($cookies.get('firstName')){
			console.log('test')
			$scope.formFirstName = $cookies.get('firstName');
			$scope.formLastName = $cookies.get('lastName');
			$scope.formAddressA = $cookies.get('addressA');
			$scope.formAddressB = $cookies.get('addressB');
			$scope.formCity = $cookies.get('city');
			$scope.formState = $cookies.get('state');
			$scope.formZip = $cookies.get('zip');
			console.log($scope.formZip)
		}
		else {
			$('#modal').modal()
		}
	}

	$scope.submitShipping = function(){
		$cookies.put('firstName', $scope.formFirstName);
		$cookies.put('lastName', $scope.formLastName);
		$cookies.put('addressA', $scope.formAddressA);
		$cookies.put('addressB', $scope.formAddressB);
		$cookies.put('city', $scope.formCity);
		$cookies.put('state', $scope.formState);
		$cookies.put('zip', $scope.formZip);
	}

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

	  $scope.payOrder = function(userOptions) {

    };


	$scope.checkout = function(){
        $scope.errorMessage = "";
        var handler = StripeCheckout.configure({
            key: 'pk_test_2B8DuadWMIvzdFgCQLm5v58S',
            image: 'images/logo.png',
            locale: 'auto',
            token: function(token) {
                console.log("The token Id is: ");
                console.log(token.id);

                $http.post(apiUrl + '/stripe', {
                    amount: $scope.total * 100,
                    stripeToken: token.id,
                    token: $cookies.get('token')
                        //This will pass amount, stripeToken, and token to /payment
                }).then(function successCallback(response) {
                    console.log(response.data);
                    if (response.data.success) {
                        // Say thank you
                        $location.path('/receipt');

                        // clear those cooks
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

                    } else {
                        $scope.errorMessage = response.data.failure;
                        //same on the checkout page
                    }
                }, function errorCallback(response) {});
            }
        });
        handler.open({
            name: 'Protein Source',
            description: 'Become a Living God',
            amount: $scope.total * 100
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

	$scope.triggerSignUp = function() {
		console.log(angular.element('#sign-up-btn'))
	    $timeout(function() {
	        angular.element('#sign-up-btn').trigger('click');
	    }, 100);
	};


	$scope.logout = function(){
		$cookies.remove('token');
		$scope.signedInAs = null;
		$scope.loggedIn = false;
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