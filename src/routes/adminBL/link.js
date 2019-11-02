const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../../lib/auth');
const pool = require('../../database');
const multer = require("multer");
const path    = require('path');
var   imgName = null;

// Functions for save image files for promotions
const Storage = multer.diskStorage({
  destination: function(req, file, callback) {
      callback(null, imageFilesRoute);
  },
  filename: function(req, file, callback) {
          imgName = Date.now() + "_" + file.originalname;
      callback(null, imgName);
  }
});

var upload = multer({
  storage: Storage
}).array("imgUploader", 1); //Field name and max count

//End functions



router.get('/add', isLoggedIn ,(req,res) => {
  res.render('admin/links/addLinks');
});

router.post('/add', isLoggedIn , async (req,res) =>{
  upload(req, res, async function(err) {
    if (err) {
        //Send message
       req.flash('success', 'Ocurrió un error al adjuntar la imagen ');
    }
    else{

 const {promName, promDesc, promfrom, promTo} = req.body;
 const newPromotion = {
  PCPROMOTIONNAME    : promName,
  PCPROMDESCRIPTION  : promDesc,
  PCPROMOTIONIMAGEURL: imgName,
  PCPROMSTARTDATE    : promfrom,
  PCPROMENDDATE      : promTo,
  PIUSERID           : req.user.fiIdUser
 };
 
const resposnse =      await pool.query('CALL SPWEBCREATEPROMOTIONS(?,?,?,?,?,?)',[
                                                                                  newPromotion.PCPROMOTIONNAME,
                                                                                  newPromotion.PCPROMDESCRIPTION, 
                                                                                  newPromotion.PCPROMOTIONIMAGEURL,
                                                                                  newPromotion.PCPROMSTARTDATE,
                                                                                  newPromotion.PCPROMENDDATE,
                                                                                  newPromotion.PIUSERID
                                                                                ]
                                      );                                      
console.log(resposnse);                                      
//Send message
       req.flash('success', 'Promotion saved successfully');

    }
      //Redirect to other view
      res.render('admin/links/addLinks');
});
});

router.get('/', isLoggedIn, async (req,res) =>{
   const promot = await pool.query('CALL SPWEBSELECTALLPROMOTIONSINFO()');
   //Render the view
   res.render('admin/links/list_links', {promot:promot[0]});
});


router.get('/delete/:id', isLoggedIn ,async (req, res) =>{

  const {id} = req.params;

  await pool.query('DELETE FROM links WHERE ID = ?', [id]);

  req.flash('success', 'link removed seccessfully');

  res.redirect('/links');

});


router.get('/edit/:id', isLoggedIn, async (req, res) =>{
  const {id} = req.params;

try{
  const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]);

  res.render('links/edit', {link: links[0]});
}
catch(ex){
  callback(ex);
}
});


router.post('/edit/:id', isLoggedIn, async (req,res) => {

  const {id} = req.params;
  const {title, description, url} = req.body;

  const newLink = {
    title,
    description,
    url
  };
 await pool.query('UPDATE links SET ? where id = ?', [newLink, id]);

 req.flash('success', 'link updated successfully');

res.redirect('/links');
});



module.exports = router;