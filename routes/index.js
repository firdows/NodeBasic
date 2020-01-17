var express = require('express');
var router = express.Router();



function enSureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/authen/login');
  }
}


/* GET home page. */
router.get('/', enSureAuthenticated, function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/test', function (req, res, next) {
  res.send("TEST TEST");
  //res.render('test', { title: 'Express' });
});

module.exports = router;
