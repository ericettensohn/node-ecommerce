var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var accountSchema = new Schema({
	username: {type: String, required: true},
	password: {type: String, required: true},
	email: {type: String, required: true},
	token: String,
	tokenExp: Date,
	cart: String,
	powderType: String,
	flavor: String,
	size: String
});

module.exports = mongoose.model('Account', accountSchema);