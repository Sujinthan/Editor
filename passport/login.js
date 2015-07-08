var LocalStrategy = require('passport-local').Strategy;
var User = require('../Models/users.js');
var bcrypt = require('bcrypt-nodejs');

module.exports = function(passport){
    passport.use('login', new LocalStrategy({
         passReqToCallback : true
     },
        function(req, username, password, done){
            User.findOne({'username' : username},
                function(err, user){
                    if(err)
                        return done(err);
                    if(!user){
                        console.log('User Not Found with username: '+username);
                        return done(null, false, req.flash('message', 'User Not Found.'));
                }
                    if (!isValidPassword(user, password)){
                        console.log(user.password);
                        return done (null, false, req.flash('message', 'Invalid Password'));
                }
                return done(null, user);
            }
        );
    })
    );
    var isValidPassword = function(user, password){
        var result = bcrypt.compareSync(password, user.password);
        if (result) {
         console.log("Password correct");
        } else {
        console.log("Password wrong");
        }
        return result;
    }
}