var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bcrypt = require('bcryptjs');

var mongodb = require('mongodb');
var mongoose = require('mongoose');
var db = mongoose.connection;


var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

/** Router */
var indexRouter = require('./routes/index');
var authenRouter = require('./routes/authen');
var usersRouter = require('./routes/users');
var testRouter = require('./routes/test');
var blogRouter = require('./routes/blog');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


// Sesstion First before passport
app.use(session({
    secret: '123456',
    resave: false,
    saveUninitialized: true,
    //cookie: { secure: true }
}));
app.use(passport.initialize());
app.use(passport.session());


// Use Route
app.get("*", function (req, res, next) {
    res.locals.user = req.user || null;
    next();
});

app.use('/', indexRouter);
app.use('/authen', authenRouter);
app.use('/users', usersRouter);
app.use('/blog', blogRouter);
// app.use('/test', testRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});


module.exports = app;
