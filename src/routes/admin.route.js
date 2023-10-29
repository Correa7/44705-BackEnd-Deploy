const express = require('express');
const { isAdmin,goToLogin } = require("../middlewares/auth.middleware");
const {adminPanelRender,adminGetUsers, adminRolUserById,adminInactiveUsers, adminDelUserById,getError} = require('../controller/admin.controller')
const router = new express.Router();

router.use(express.json());
router.use(express.urlencoded({extended:true}));


router.get('/', goToLogin,isAdmin, adminPanelRender);
router.get('/panel', goToLogin,isAdmin,adminGetUsers);
router.put('/panel/:uid', goToLogin,isAdmin, adminRolUserById);
router.delete('/panel/:uid',goToLogin,isAdmin,adminDelUserById);
router.delete('/panel',goToLogin,isAdmin,adminInactiveUsers);
router.get('*',goToLogin,isAdmin,getError);

module.exports = router;