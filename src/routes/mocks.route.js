const express = require('express');
const {isAdmin,isAdminPrimium} = require('../middlewares/auth.middleware');
const {mockProducts,mockUsers,mockGetError} = require('../controller/mocks.controller');
const router = new express.Router();

router.use(express.json()); 
router.use(express.urlencoded({ extended: true }));

router.get('/products',isAdminPrimium, mockProducts);
router.get('/users',isAdmin, mockUsers); 
router.get('*', mockGetError);

module.exports = router;