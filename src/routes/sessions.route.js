const express = require("express");
const passport = require("passport");
const { goToLogin, isUser } = require("../middlewares/auth.middleware");
const {sessionGetRegister,
  sessionPostRegister,
  sessionGetLogin,
  sessionPostLogin,
  sessionGetProfile,
  sessionGetLogout,
  sessionGetFailedRegister,
  getApiSession,
  sessionGetError  } = require ('../controller/sessions.controller');

const router = new express.Router(); 

router.use(express.json());
router.use(express.urlencoded({extended:true}));
 
router.get('/register', sessionGetRegister);
router.post('/register',passport.authenticate("register-passport", {failureRedirect: "/sessions/failed-register",}),sessionPostRegister);
router.get("/login", sessionGetLogin);
router.post("/login",passport.authenticate("login-passport", {failureRedirect: "/session/register",}),sessionPostLogin);
router.get('/current', isUser, getApiSession);
router.get("/profile",goToLogin, sessionGetProfile);
router.get("/logout", sessionGetLogout);
router.get("/failed-register",sessionGetFailedRegister);
router.get('*', sessionGetError );  

module.exports = router;  
