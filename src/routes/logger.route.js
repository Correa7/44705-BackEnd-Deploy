const express = require('express');
const getLogger = require('../controller/logger.controller');
const { goToLogin,isAdmin} = require("../middlewares/auth.middleware");

const router = new express.Router();

router.get('/', goToLogin,isAdmin, getLogger);

module.exports = router; 