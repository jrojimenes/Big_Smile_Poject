const express                     = require('express');
const router                      = express.Router();
const passport                    = require('passport');
const {isLoggedIn, isNotLoggedIn} = require('../../lib/auth');
const pool                        = require('../../database');

router.get('/signup', isLoggedIn, async (req,res) => {
const result = await pool.query('CALL SPWEBRETURNPROFILES()');
let infoManage = {
    listProfiles: result[0],
    listUsers   : result[1]
}; 
res.render('admin/signup', {infoManage: infoManage});

});


router.post('/signup', isLoggedIn ,passport.authenticate('local.signup', {
  successRedirect: '/signup',
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
router.get('/profile', isLoggedIn, (req,res) => {

    res.render('admin/profile');
});


router.get('/logout', (req, res) => {

    req.logOut();
    res.redirect('/signin');

});

module.exports = router;