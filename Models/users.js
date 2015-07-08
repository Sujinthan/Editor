var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
	username:{type: String, required: true},
	password:{type: String, required: true},
    //files:{type: Schema.Types.Mixed, required: false}
}, {collection: 'Logins'});

UserSchema.pre('save', function(next) {
    var user = this;

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        mongoose.set('debug', true);
        if (err) 
            return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) 
                return callback(err, hash);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
        
    });
});
module.exports = mongoose.model('Users', UserSchema);
