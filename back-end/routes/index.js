var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var mongoUrl = "mongodb://localhost:27017/ecommerce";
var Account = require('../models/account');
mongoose.connect(mongoUrl);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/addAccount', function(req, res, next){
	
	var accountToAdd = new Account({
		username: req.body.username,
		password: req.body.password,
		email: req.body.email
	});

	accountToAdd.save();
	res.json({
		message: "\u2713 added",
		username: username
	});
});

module.exports = router;
