var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
var User = require('../models/User');
//var bcryptjs = require('bcryptjs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function (user, done) {
    done(null, user.id)
});
passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
        done(err, user);
    });
});
passport.use(new LocalStrategy(function (username, password, done) {
    User.getUserByName(username, (err, user) => {
        if (err) throw error;

        // res.location("/");
        // res.redirect('/');
        if (!user) {// ไม่พบ User
            console.log("\x1b[31m", 'Not found user.');
            return done(null, false);
        } else {
            console.log("\x1b[34m", '-- GET User --');
            console.log(user);
            //return done(null, user);
            User.comparePassword(password, user.password, function (err, isMatch) {
                if (err) return err;
                console.log('-- Check Compare --');
                console.log(isMatch);
                if (isMatch) {// รหัสผ่านตรง
                    console.log("\x1b[32m", 'Password Match');
                    return done(null, user);
                } else {
                    console.log("\x1b[31m", 'Password Not Match');
                    return done(null, false);
                }
            });
        }


    });
}));


/** Router */

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

/** Login */
router.get('/login', function (req, res, next) {
    res.render('authen/login', { title: '::Login::' });
});
router.post('/login', passport.authenticate('local', {
    //successRedirect: '/test',
    failureRedirect: '/authen/login',
    failureFlash: false
}), function (req, res) {
    //res.location("/");
    res.redirect('/');
});

/** Logout */
router.get('/logout', function (req, res, next) {
    req.logout();
    res.redirect('/');  
});


/** Register */
router.get('/register', function (req, res, next) {
    var newUser = new User();
    console.log('newUser:');
    console.log(newUser);
    res.render('authen/register', { title: 'Register', value: newUser });
});
router.post('/register', [
    check('email', 'กรุณกรอก Email').not().isEmpty(),
    check('username', 'กรุณกรอก username').not().isEmpty(),
    check('password', 'กรุณกรอก password').not().isEmpty(),
    check('confirm_password', 'กรุณกรอก confirm password').not().isEmpty().custom((value, { req }) => {
        if (req.body.password === value) {
            return true;
        } else {
            return false;
        }
    }).withMessage("Passwords don't match."),
], function (req, res, next) {
    const result = validationResult(req);
    var errors = result.errors;
    console.log(result);
    if (!result.isEmpty()) {
        res.render('authen/register', { title: 'Register', errors: errors, value: req.body });
    } else {
        var data = req.body;
        // data.password = bcryptjs.genSaltSync(data.password);

        var newUser = new User(data);
        User.createUser(newUser, function (err, user) {
            if (err) throw error;
        });
        console.log("--- Register Success ---");
        res.location("/");
        res.redirect("/");
    }
    //console.log(req.body.email);
    // res.redirect('/');
});

module.exports = router;
