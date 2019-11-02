const express    = require('express');
const isLoggedIn = require('../lib/auth');
const router = express.Router();
const pool = require('../database');

router.get('/' , async (req, res) => {

const resp = await pool.query('CALL SPWEBSELECTACTIVEPROMOTIONSINFO()');
console.log(resp[0]);
res.render('index', {promView:resp[0]});

});





module.exports= router;