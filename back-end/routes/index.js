var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var mongoUrl = "mongodb://localhost:27017/ecommerce";
var Account = require('../models/account');
mongoose.connect(mongoUrl);
var bcrypt = require('bcrypt-nodejs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/addAccount', function(req, res, next){
	
	var accountToAdd = new Account({
		username: req.body.username,
		password: bcrypt.hashSync(req.body.password),
		email: req.body.email
	});

	accountToAdd.save();
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
				res.json({
					success: "goodPass"
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

module.exports = router;
