var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
var User = require('../models/User');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

/** Login */
router.get('/login', function (req, res, next) {
    res.render('authen/login', { title: '::Login::' });
});


/** Register */
router.get('/register', function (req, res, next) {
    res.render('authen/register', { title: 'Register' });
});
router.post('/register', [
    check('email', 'กรุณกรอก Email').not().isEmpty(),
    check('username', 'กรุณกรอก username').not().isEmpty(),
    check('password', 'กรุณกรอก password').not().isEmpty(),
    check('confirm_password', 'กรุณกรอก confirm password').not().isEmpty(),
], function (req, res, next) {
    const result = validationResult(req);
    var errors = result.errors;
    console.log(result);
    if (!result.isEmpty()) {
        res.render('authen/register', { title: 'Register', errors: errors });
    }else{
        var newUser = new User(req.body);
        User.createUser(newUser,function(err,user){
            if(err) throw err;
        });
        res.location("/");
        res.redirect("/");
    }
    //console.log(req.body.email);
   // res.redirect('/');
});

module.exports = router;
