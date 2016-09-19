var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var mongoUrl = "mongodb://localhost:27017/ecommerce";
var Account = require('../models/account');
var bcrypt = require('bcrypt-nodejs');
var randToken = require('rand-token').uid;


var config = require('../config/config')
var stripe = require('stripe')(
	'config.secretTestKey'
);

mongoose.connect(mongoUrl);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/addAccount', function(req, res, next){
	var token = randToken(32);

	var accountToAdd = new Account({
		username: req.body.username,
		password: bcrypt.hashSync(req.body.password),
		email: req.body.email,
		token: token
	});

	accountToAdd.save(function(error, documentAdded){
		if(error) {
			res.json({
				message: "errorAdding"
			});
		}
		else {
			res.json({
				message: "added",
				token: token
			})
		}
	});
	res.json({
		message: "added",
		username: req.body.username
	});
});

router.post('/login', function(req, res, next){

	Account.findOne({
		username: req.body.username,	
	}, function(error, document){
		if(document == null) {
			// no match
			res.json({failure: "badUser"});
		}
		else {
			// run comparesync, first param is english pass, second is the
			var loginResult = bcrypt.compareSync(req.body.password, document.password);
			if(loginResult){
				// the password is correct
				var newToken = randToken(32);
				// Account.update({username: document.username}, {token: token});
				Account.update({ username: document.username}, { token: newToken}).exec()
				res.json({
					success: "goodPass",
					token: newToken
				});
			}
			else {
				res.json({
					failure: "badPass"
				});
			}
		}
	})
})

router.get('/getUserData', function(req, res, next){
	var userToken = req.query.token;
	if(userToken == undefined){
		res.json({failure: "noToken"});
	}
	else {
		Account.findOne({
			token: userToken
		}, function(error, document){
			if(document == null){
				res.json({failure: 'badToken'});
			}
			else {
				res.json({
					success: true,
					username: document.username,
					powderType: document.powderType,
					flavor: document.flavor,
					frequency: document.frequency,
					token: document.token
				});
			}
		})
	}
});

router.post('/addOption', function(req, res, next){
	Account.findOne({
		// cartList
	})
	// res.json({
	// 	success: true
	// })
});

router.post('/checkout', function(req, res, next){
	console.log(req.body.username)
	Account.update({ username: req.body.username}, { 
		powderType: req.body.powderType,
		flavor: req.body.flavor,
		size: req.body.size,
	}).exec()

	
})


router.post('/stripe', function(req, res, next){
	stripe.charges.create({
		amount: req.body.amount,
		currency: 'usd',
		source: req.body.stripeToken,
		description: 'charge for ' + req.body.email,
	}).then(function(charge){
		res.json({
			success: "paid"
		});
	}, function(err){
		res.json({
			failure: "failedPayment"
		});
	});

})

router.post('/logout', function(req, res, next){
	
})

module.exports = router;
