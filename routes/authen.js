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
passport.use(new LocalStrategy((username,password,done)=>{
    User.getUserByName(username,(err,user)=>{
        if(err) throw error;
        console.log('GET User');
        console.log(user);
        //res.redirect('/');
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
    failureRedirect: '/authen/register',
    failureFlash: false
}), function (req, res, next) {
    res.redirect('/');
});


/** Register */
router.get('/register', function (req, res, next) {
    res.render('authen/register', { title: 'Register' });
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
        res.render('authen/register', { title: 'Register', errors: errors });
    } else {
        var data = req.body;
        // data.password = bcryptjs.genSaltSync(data.password);

        var newUser = new User(data);
        User.createUser(newUser, function (err, user) {
            if (err) throw err;
        });
        res.location("/");
        res.redirect("/");
    }
    //console.log(req.body.email);
    // res.redirect('/');
});

module.exports = router;
