const express = require('express');
const { goToLogin, isUserPrimium,isAdminPrimium } = require("../middlewares/auth.middleware");
const {
    productsView,
    cartView,
    chatView,
    RealTimeProductsView,
    getViewsError
} = require('../controller/views.controller');

const router = express.Router();

router.get('/products', productsView);
router.get('/cart', goToLogin, isUserPrimium, cartView);
router.get("/chat", goToLogin, isUserPrimium, chatView);
router.get("/realTimeProducts", goToLogin, isAdminPrimium, RealTimeProductsView); 
router.get('*', getViewsError); 


module.exports = router; 