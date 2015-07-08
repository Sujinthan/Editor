var mongoose = require('mongoose');
var express = require('express');
var router = express();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var param = require('express-params');
var Parse = require('parse').Parse;
var http = require('http');
var spawn = require('child_process').spawn;
var JVM = require('node-jvm');
var Promise = require('bluebird');
var name;
var userID;
var tempcurrent;

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

module.exports = function (passport) {
    //GET login page. 
    router.get('/', function (req, res) {
        res.render('index', { title: 'Signin' });

    });

    router.get('/signin', function (req, res) {
        res.render('signin', { title: 'Login' });
    });

    router.get('/signup', function (req, res) {
        res.render('signup', { title: 'Sign Up' })
    });

    /*
     Parse Login 
     */
    router.post('/login', function (req, res) {
        var tempname = req.body.username;
        var username = tempname.toLowerCase();
        var password = req.body.password;
        //var login = Promise.promisify(Parse.User.logIn);
        var promerror = Promise.reject("error");
        var Files = Parse.Object.extend("File");
        var query = new Parse.Query(Files);
        var doc = { "java": {}, "python": {}, "csharp": {} };
        var name, url;
        var currentuser;
        var temp;
        Parse.User.logIn(username, password).then(function (user) {
            return query.find();
        }).then(function (results) {
            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                var javafile = object.get('java');
                if (javafile != null) {
                    temp = javafile.name();
                    name = temp.split("-").pop();
                    url = javafile.url();
                    doc['java'][name] = url;
                }
                var pythonfile = object.get('python');
                if (pythonfile != null) {
                    temp = pythonfile.name();
                    name = temp.split("-").pop();
                    url = pythonfile.url();
                    doc['python'][name] = url;
                }
                var csharpfile = object.get('csharp');
                if (csharpfile != null) {
                    temp = csharpfile.name();
                    name = temp.split("-").pop();
                    url = csharpfile.url();
                    doc['csharp'][name] = url;
                }
            }
        }).then(function () {
            res.render('filename', { title: 'File Name', doc: JSON.stringify(doc) });
        }, function (error) {
            res.render('logins', { Message: "Username and/or password don't match" });
        });
    });

    router.post('/relogin', function (req, res) {
        var tempname = req.body.username;
        var username = tempname.toLowerCase();
        var password = req.body.password;
        var login = Promise.promisify(Parse.User.logIn);
        var promerror = Promise.reject("error");
        var Files = Parse.Object.extend("File");
        var query = new Parse.Query(Files);
        var doc = { "java": {}, "python": {}, "csharp": {} };
        var name, url;
        Parse.User.logIn(username, password).then(function (user) {
            return query.find();
        }).then(function (results) {
            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                var javafile = object.get('java');
                if (javafile != null) {
                    temp = javafile.name();
                    name = temp.split("-").pop();
                    url = javafile.url();
                    doc['java'][name] = url;
                }
                var pythonfile = object.get('python');
                if (pythonfile != null) {
                    temp = pythonfile.name();
                    name = temp.split("-").pop();
                    url = pythonfile.url();
                    doc['python'][name] = url;
                }
                var csharpfile = object.get('csharp');
                if (csharpfile != null) {
                    temp = csharpfile.name();
                    name = temp.split("-").pop();
                    url = csharpfile.url();
                    doc['csharp'][name] = url;
                }
            }
        }).then(function () {
            res.render('filename', { title: 'File Name', doc: JSON.stringify(doc) });
        }, function (error) {
            res.render('logins', { Message: "Username and/or password don't match" });
        });
    });

    router.post('/newuser', function (req, res) {
        var tempname = req.body.username;
        var username = tempname.toLowerCase();
        var password = req.body.password;
        var user = new Parse.User();
        var doc = {};
        user.set("username", username);
        user.set("password", password);
        user.signUp(null, {
            success: function (user) {
                res.render('filename', { title: 'File Name', doc: JSON.stringify(doc) });
            },
            error: function (user, error) {
                res.render('logins', { Message: 'Username already exist' });
            }
        });
    });

    router.get('/filename', function (req, res) {

        res.render('filename', { title: "Filename" });
    });

    router.get('/signout', function (req, res) {
        Parse.User.logOut();
        req.logout();
        res.redirect('/');
    });

    router.post('/editor', function (req, res) {
        name = req.body.newname;
        res.render('Editor', { title: "" + name + ".java" });
    });

    router.post('/getcode', function (req, res) {
        var usercode = req.body.codes;
        newname = req.body.names;
        var lang = req.body.lang;
        var bytes = [];
        var doc = { "java": {}, "python": {}, "csharp": {} };
        for (var i = 0 ; i < usercode.length; i++) {
            bytes.push(usercode.charCodeAt(i));
        };
        var parseFile = new Parse.File(newname, bytes);
        parseFile.save().then(function () {
            var FileClass = Parse.Object.extend("File");
            var query = new Parse.Query(FileClass);
            query.find(function (results) {
                for (var x = 0; x < results.length; x++) {
                    var object = results[x];
                    var codefilename = object.get(lang);
                    if (codefilename != null) {
                        temp = codefilename.name();
                        name = temp.split("-").pop();
                        if (name == newname) {
                            object.set(lang, parseFile);
                            object.save();
                        }
                    }

                    var javafile = object.get('java');
                    if (javafile != null) {
                        temp = javafile.name();
                        name = temp.split("-").pop();
                        url = javafile.url();
                        doc['java'][name] = url;
                    }
                    var pythonfile = object.get('python');
                    if (pythonfile != null) {
                        temp = pythonfile.name();
                        name = temp.split("-").pop();
                        url = pythonfile.url();
                        doc['python'][name] = url;
                    }
                    var csharpfile = object.get('csharp');
                    if (csharpfile != null) {
                        temp = csharpfile.name();
                        name = temp.split("-").pop();
                        url = csharpfile.url();
                        doc['csharp'][name] = url;
                    }
                }
            }).then(function () {
                res.send(doc);
            });
        });
    });

    router.post('/newfile', function (req, res) {
        var usercodes = req.body.code;
        var newnames = req.body.name;
        var lang = req.body.lang;
        var bytes = [];
        var doc = { "java": {}, "python": {}, "csharp": {} };
        for (var i = 0 ; i < usercodes.length; i++) {
            bytes.push(usercodes.charCodeAt(i));
        };
        var parseFile = new Parse.File(newnames, bytes);
        parseFile.save();
        var FileClass = Parse.Object.extend("File");
        var custom_acl = new Parse.ACL();
        custom_acl.setWriteAccess(Parse.User.current(), true);
        custom_acl.setReadAccess(Parse.User.current(), true);
        custom_acl.setPublicReadAccess(false);
        var newFile = new FileClass();
        newFile.setACL(custom_acl);
        newFile.set("user", Parse.User.current());
        newFile.set(lang, parseFile);
        newFile.save({ user: Parse.User.current(), javaFile: parseFile }).then(function () {
            var newFileClass = Parse.Object.extend("File");
            var query = new Parse.Query(newFileClass);
            query.equalTo('user', Parse.User.current());
            query.find(function (results) {
                for (var i = 0; i < results.length; i++) {
                    var object = results[i];
                    var javafile = object.get('java');
                    if (javafile != null) {
                        temp = javafile.name();
                        name = temp.split("-").pop();
                        url = javafile.url();
                        doc['java'][name] = url;
                    }
                    var pythonfile = object.get('python');
                    if (pythonfile != null) {
                        temp = pythonfile.name();
                        name = temp.split("-").pop();
                        url = pythonfile.url();
                        doc['python'][name] = url;
                    }
                    var csharpfile = object.get('csharp');
                    if (csharpfile != null) {
                        temp = csharpfile.name();
                        name = temp.split("-").pop();
                        url = csharpfile.url();
                        doc['csharp'][name] = url;
                    }
                }
            }).then(function () {
                res.send(doc);
            });
        }, function (error) {
            console.log(error);
        });

    });

    return router;
}