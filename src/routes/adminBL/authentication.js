const express                     = require('express');
const router                      = express.Router();
const passport                    = require('passport');
const {isLoggedIn, isNotLoggedIn} = require('../../lib/auth');

router.get('/signup', isLoggedIn,(req,res) => {
res.render('admin/signup');

});


router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true
}));

router.get('/signin', (req,res) => {
    res.render('admin/signIn');
});


router.post('/signin', (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next);

});

///isNotLoggedIn to protect views
router.get('/profile', isLoggedIn,(req,res) => {
    res.render('admin/profile');

});


router.get('/logout', (req, res) => {

    req.logOut();
    res.redirect('/signin');

});

module.exports = router;