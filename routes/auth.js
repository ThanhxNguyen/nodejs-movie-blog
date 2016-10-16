var express = require('express');
var router = express.Router();
var passport = require('passport');

//show login form
router.get('/login', function (req, res, next) {
    res.render('auth/login', {title: 'Login Page', message: req.flash('loginMessage')});
});

router.get('/logout', function (req, res, next) {
    //logout passport (destroy session)
    req.logout();
    res.redirect('/');
});

router.post('/login',
    passport.authenticate('signin', {
        failureRedirect : '/auth/login',
        failureFlash : true // allow flash messages
    }),
    function (req, res) {
        res.redirect(req.session.redirectTo || '/');
    });

//show sign up form
router.get('/register', function (req, res, next) {
    res.render('auth/register', {title: 'Signup Page', message: req.flash('registerMessage')});
});

router.post('/register',
    passport.authenticate('signup', {
        failureRedirect : '/auth/register',
        failureFlash : true // allow flash messages
    }),
    function (req, res) {
        res.redirect(req.session.redirectTo || '/');
    }
);

module.exports = router;
