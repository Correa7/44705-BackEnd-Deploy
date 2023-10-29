const express = require('express');
const cookieParser = require('cookie-parser');
const router = new express.Router();
const {sendEmail,sendMailWhitAttachments,sendResetPass,forgotPass,resetForm,resetPass } = require('../controller/mail.controller');

router.use(cookieParser())
router.use(express.json()); 
router.use(express.urlencoded({ extended: true }));

router.get('/', sendEmail);
router.get('/attachments', sendMailWhitAttachments);
 
router.get('/forgot-password', forgotPass);
router.post('/reset-info',sendResetPass );
router.get('/reset-form/', resetForm); 
router.post('/reset-password', resetPass);  

module.exports = router;
