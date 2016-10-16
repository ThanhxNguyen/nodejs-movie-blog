var isUserLoggedin = function (req, res, next) {

    //check passport session if user is logged in
    if(req.isAuthenticated()) {
        return next();
    }

    //redirect to login form if user is not logged in
    res.redirect('/auth/login');
}

module.exports = {
    isUserLoggedin: isUserLoggedin
}
