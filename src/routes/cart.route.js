const express = require('express');
const { isAdmin,isUserPrimium,goToLogin } = require("../middlewares/auth.middleware");

const {
    getAll,
    newCart,
    getCartById,
    addPorductToCart,
    deleteCart,
    deleteProductFromCart,
    updateQuantity,
    updateCart,
    purchase,
    getPurchase,
    deletePurchase,
    getCartError 
} = require('../controller/cart.controller');

const router = new express.Router(); 

router.use(express.json());
router.use(express.urlencoded({extended:true}));

router.get("/",goToLogin, isAdmin, getAll);     
router.get("/:cid", getCartById);
router.post("/",newCart);
router.post("/:cid/product/:pid", addPorductToCart);
router.delete("/:cid", deleteCart);
router.delete("/:cid/product/:pid", deleteProductFromCart);
router.put("/:cid/product/:pid",goToLogin, updateQuantity);
router.put("/:cid",goToLogin, updateCart);
router.get('/:cid/purchase',purchase);  
router.get('/:cid/purchases',goToLogin, isAdmin, getPurchase);
router.delete('/:cid/purchases', goToLogin,isAdmin, deletePurchase);
router.get('*', getCartError);

module.exports = router;


