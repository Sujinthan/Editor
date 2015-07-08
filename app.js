var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Parse = require('parse').Parse;
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var routes = require('./routes');
var expressSession = require('express-session');
var users = require('./routes/user');
var flash = require('connect-flash');
var parse = require('Parse');
var app = express();
var User = require('./Models/users.js')

// view engine setup
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(flash());
app.use(logger('dev'));
app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession({
    secret: 'Cortana',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

/*Database Connectons*/
Parse.initialize('iLpYywtOlyXRU4BJir9wT3s0PHuVByTmaHimlGFe', 'nC2BboXInP4decut8Ts49i1zScpKqrnU1wJnSZIV')

var initPassport = require('./passport/init');
initPassport(passport);

var routes = require('./routes/index')(passport);
app.use('/', routes);

//mongoose.set('debug', true);
/// catch 404 and forwarding to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    err.message;
    next(err);
});


// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
};


// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});
/*
conn.once('open', function(){
    console.log("connection Open");
})

*/
module.exports = app;

