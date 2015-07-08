var User = require('../Models/users.js');
var mongoose = require('mongoose');
var db = mongoose.connection;
var passport = require('passport');
var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){
    passport.use('signup', new LocalStrategy({
        // allows us to pass back the entire request to the callback
        passReqToCallback : true 
    },
    function(req, username, password, done) {
        console.log('Enter findorcreateUser');
                // find a user in Mongo with provided username
                findOrCreateUser = function(){

                    User.findOne({'username' :  username },
                        function(err, user) {
                    // In case of any error, return using the done 
                    //method
                    if (err){
                        console.log('Error in SignUp: '+err);
                        return done(err);
                    }
                    // already exists
                    if (user) {
                        console.log('User already exists with username: '+username);
                        return done(null, false, req.flash('message',
                            'User Already Exists'));
                    } 
                    else {
                        // if there is no user with that email
                        console.log('create the user');
                        var newUser = new User();//{

                        // set the user's local credentials
                        newUser.username = username;
                        newUser.password = password;
                    //});
                        // save the user
                        newUser.save(function(err) {
                            if (err){
                                console.log('Error in Saving user:'+err);  
                                throw err;  
                            }
                            console.log('User Registration succesful');    
                            return done(null, newUser);
                        });
                    }
                });
};
            // Delay the execution of findOrCreateUser and execute the 
            //method
            // in the next tick of the event loop
            process.nextTick(findOrCreateUser);
        })
);
var createHash = function(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10),null)
}
}