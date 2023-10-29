const express = require('express');
const router = new express.Router();
const { sendSMS } = require('../controller/sms.controller');

router.get('/', sendSMS);

module.exports = router;
