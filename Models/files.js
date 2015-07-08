var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = mongoose.connection;

var FileSchema = new Schema({
	userID:{type: String},
	//names:{type: String},
	file:[{type: Schema.Types.Mixed}]

},{collection: 'Files'});

module.exports = mongoose.model('Files', FileSchema);