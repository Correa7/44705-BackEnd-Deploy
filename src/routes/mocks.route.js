const express = require('express');
const {goToLogin,isAdminPrimium} = require('../middlewares/auth.middleware');
const {mockProducts,mockUsers,mockGetError} = require('../controller/mocks.controller');
const router = new express.Router();

router.use(express.json()); 
router.use(express.urlencoded({ extended: true }));
 
router.get('/products',goToLogin,isAdminPrimium, mockProducts);
router.get('/users',goToLogin, isAdminPrimium, mockUsers); 
router.get('*', mockGetError);

module.exports = router;