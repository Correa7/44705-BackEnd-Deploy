const express = require('express');
const passport = require('passport');
const { goToLogin,isAdmin } = require("../middlewares/auth.middleware");
const{ getUser,
  getUserById,
  rolUserById,
  postUser,
  delUserById,
  delUsers,
  putUserById,
  userDocuments,
  deleteDocuments } = require ('../controller/users.controller');
  const {usersUploader} = require('../utils/multer')

const router = new express.Router();
router.use(express.json());
router.use(express.urlencoded({extended:true}));
     
router.get('/',goToLogin, isAdmin, getUser); 
router.get('/:uid',goToLogin, isAdmin, getUserById);
router.post('/', passport.authenticate('register-passport',{failureRedirect:'/session/failed-register'}),postUser);
router.delete('/:uid',goToLogin, isAdmin, delUserById);
router.delete('/',goToLogin, isAdmin, delUsers);
router.put('/:uid',goToLogin, isAdmin, putUserById); 
router.put('/premium/:uid',rolUserById );
router.post('/:uid/documents',goToLogin, usersUploader(), userDocuments); 
router.delete('/:uid/documents',goToLogin, deleteDocuments);  

 
module.exports = router;


