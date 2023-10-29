const express = require("express");
const { isAdminPrimium, goToLogin} = require("../middlewares/auth.middleware");
const {
    getWithQuerys,
    getProductById,
    addProduct,
    addManyProducts,
    deleteProduct,
    updateProduct, 
    getProductError 
   } = require ('../controller/products.controller');

const {productsUploader,usersUploader} = require('../utils/multer')

const router = new express.Router();
router.use(express.json());   
router.use(express.urlencoded({ extended: true }));

router.get("/", getWithQuerys);
router.get("/:pid", isAdminPrimium, getProductById);  
router.post("/", addProduct);
router.post("/many",goToLogin,isAdminPrimium, addManyProducts);
router.delete("/:pid",goToLogin,isAdminPrimium, deleteProduct); 
router.put("/:id",goToLogin,isAdminPrimium,updateProduct);
router.get("*", getProductError);

module.exports = router;
