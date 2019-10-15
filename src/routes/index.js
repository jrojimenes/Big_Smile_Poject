const express    = require('express');
const isLoggedIn = require('../lib/auth');
const router = express.Router();


router.get('/' ,(req, res) => {
res.render('index');
});


router.get('/contactUs',(req, res) =>{
    res.render('contactUs');
});

module.exports= router;