var express = require('express');
var router = express.Router();


router.get('/', function (req, res, next) {
    res.render('blog/index', { title: 'Blog' });
});

router.get('/create', function (req, res, next) {
    console.log(res);



    res.render('blog/create', { title: 'Create Blog' });
});

router.post('/create', function (req, res, next) {
    console.log(res);
});

module.exports = router;