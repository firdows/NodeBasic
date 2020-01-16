var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
var User = require('../models/User');
//var bcryptjs = require('bcryptjs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

/** Login */
router.get('/login', function (req, res, next) {
    res.render('authen/login', { title: '::Login::' });
});
router.post('/login', function (req, res, next) {
    passport.authenticate('local',function(){
        
    })
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
