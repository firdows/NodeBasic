var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');


router.get('/', function (req, res, next) {
    res.render('blog/index', { title: 'Blog' });
});

router.get('/create', function (req, res, next) {
    //res.send(req.url);
    //console.log(res);
    res.render('blog/create', { title: 'Create Blog' });
});

router.post('/create', [
    check('title', 'กรุณาป้อนชื่อ').not().isEmpty(),
    check('detail', 'เนื้อหา').not().isEmpty(),
    check('author', 'ผู้แต่ง').not().isEmpty(),
],
    function (req, res, next) {
        //console.log(res);
        const result = validationResult(req);
        var errors = result.errors;
        if (!result.isEmpty()) {
            //console.log(errors);
            //return 
            res.render('blog/create', { title: 'Create Blog', errors: errors });
        }
        console.log(req.body);
    });

module.exports = router;