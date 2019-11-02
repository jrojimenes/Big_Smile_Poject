const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const helpers = require('./helpers');
const pool = require('../database');

//////////////////////////////////////////////////////Method for signIn

passport.use('local.signin', new localStrategy({
    
    usernameField: 'nickName',
    passwordField: 'password',
    passReqToCallback: true

  }, async (req, nickName, password, done) => {
    const rows = await pool.query('CALL SPWEBRETURNUSERINFO(?,?)', [0, nickName]);
    const objectResponse = rows[0];
    if (objectResponse.length > 0) {
      const user = objectResponse[0];
      const validPassword = await helpers.matchPassword(password, user.fcUserPsw)
      if (validPassword) {
          //null-error/ user for persist/ message 
        done(null, user, req.flash('success', 'Welcome ' + user.fcUserNickName));
      } else {
        done(null, false, req.flash('errormessage', 'Incorrect Password'));
      }
    } else {
      return done(null, false, req.flash('errormessage', 'The Username does not exists.'));
    }
  }));  


//////////////////////////////////////////////////////Method for signUp
passport.use('local.signup', new localStrategy({
   
    usernameField: 'nickName',
    passwordField: 'password',
    passReqToCallback: true

}, async (req, nickName, password, done) => {

    const {usrname, usrsecondname, usrlastname, mail, phone, profileId } = req.body;
    let newUsr = {
    PCUSERNAME       : usrname,
    PCUSERSECONDNAME : usrsecondname,
    PUSERLASTNAME    : usrlastname,
    PCMAIL           : mail,
    PIPHONENUMBER    : phone,
    PIPROFILEID      : profileId,
    PCNICKNAME       : nickName,
    PCUSERPSW        : await helpers.encryptPsw(password)
    };

   const result = await pool.query('CALL SPWEBCREATEUSER(?, ?, ?, ?, ?, ?, ?, ?)',[    newUsr.PCUSERNAME, 
                                                                                       newUsr.PCUSERSECONDNAME, 
                                                                                       newUsr.PUSERLASTNAME,
                                                                                       newUsr.PCMAIL,
                                                                                       newUsr.PIPHONENUMBER,
                                                                                       newUsr.PIPROFILEID,
                                                                                       newUsr.PCNICKNAME,
                                                                                       newUsr.PCUSERPSW
                                                                                  ]);
   if(!result.insertId == 0){                                                                                     
   newUsr.fiIdUser = result.insertId;
   return done(null, newUsr, req.flash('success', 'El usuario se registro correctamente'));
   }
else{
 done(null,false,req.flash('errormessage','Ocurrió un error al insertar el nuevo usuario.'));
}

}));

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

passport.serializeUser((user, done) => {
    done(null, user.fiIdUser);
});

passport.deserializeUser( async (fiIdUser, done) =>{
try{
  const rows = await pool.query('CALL SPWEBRETURNUSERINFO(?,?)', [fiIdUser,null]);
  const user = rows[0][0];
   return done(null, user);
}
catch(ex){
   console.log(ex.message);
}
});