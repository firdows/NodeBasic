function enSureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/authen/login');
    }
}




module.exports = {
    enSureAuthenticated
}