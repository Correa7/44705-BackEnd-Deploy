const UserService = require('../services/users.service');
const Service = new UserService()
const cartService = require('../services/carts.service');
const nodemailer = require('nodemailer')
const {secret,gmailAccount, gmailAppPass} = require('../config/env.config')

const transporter = nodemailer.createTransport({
    service:'gmail',
    port: 587,
    auth: {
        user:gmailAccount,
        pass:gmailAppPass 
    }
})

const adminPanelRender = async (req,res)=>{
    try{
        const users = await Service.getAll();
        const active = []
        const inactive = []
        users.map(u => {
            if (u.rol === 'Admin'){
                console.log(`User ${u.email} is Admin, not be deleted `)
            }
            else{ 
                const dateUser = new Date(u.last_connection).valueOf()
                const date = Date.now()
                const hs = 172800000  // 48 hs
                const min = 180000  //3 minutos

                if( hs < (date - dateUser)){
                    let userData = {
                        "email": u.email,
                        "rol": u.rol,
                        "firstName":u.firstName,
                        "lastName" : u.lastName,
                        '_id': u._id
                    }
                    inactive.push(userData)
                }
                else{
                    let userData = {
                        "email": u.email,
                        "rol": u.rol,
                        "firstName":u.firstName,
                        "lastName" : u.lastName,
                        '_id': u._id
                    }
                    active.push(userData)
                }
            }
        })
        res.status(200).render('adminPanel', {
            style:'adminpanel.css',
            title:'Admin Panel',
            message:'Test Admin Panel ok!',
            Admin:req.session.user,
            active: active,
            inactive: inactive
        })
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
          status: 'error',
          msg: 'something went wrong :(',
          data: {},
        });
      }
 
}

const adminGetUsers = async (req,res)=>{
    try{
        const users = await Service.getAll();
        let result= []
        users.map(u =>{
            let userData = {
                "email": u.email,
                "rol": u.rol,
                "documents": JSON.stringify(u.documents),
                "last_connection" : u.last_connection || ''
            }
            result.push(userData)
        })
        console.log(result)

        return res.status(200).json({
            status: 'success',
            msg: 'Users founds',
            data: users,
        })
    }
    catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 'error',
      msg: 'something went wrong :(',
      data: {},
    });
  }
}

const adminRolUserById = async (req,res)=>{
    try{
        let _id = req.params.uid
        const user = await  Service.getById(_id)
        if(user.rol === 'User'){
            user.rol= 'Premium' 
            await Service.updateOne(_id,user) 
            return res.status(201).json({
                status: 'success',
                msg: 'User update rol: Premium',
            }); 
        }else{
            user.rol= 'User'
            await Service.updateOne(_id,user) 
            return res.status(201).json({
                status: 'success',
                msg: 'User update rol: User',
            });
        }
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            status: 'error',
            msg: 'something went wrong :(',
            data: {},
        });
    }
}

const adminDelUserById =  async (req, res) => {
    try {
    const uid = req.params.uid;
    const user = await Service.getById(uid)
    await cartService.deleteCartUser(user.cart)
    await Service.deletedOne(uid)
    return res.status(200).json({
        status: 'success',
        msg: 'User deleted',
        data: {},
    });
    } catch (e) {
    console.log(e);
    return res.status(500).json({
        status: 'error',
        msg: 'something went wrong :(',
        data: {},
    });
    }
}

const adminInactiveUsers = async (req,res)=>{
    try {
        const users = await Service.getAll();
        users.map(async (u) =>{
            console.log(u.email)
            if (u.rol === 'Admin'){
                console.log(`User ${u.email} is Admin, not be deleted `)
            }
            else{

                const dateUser = new Date(u.last_connection).valueOf()
                console.log(dateUser)
                const date = Date.now()
                console.log(date)
                const hs = 172800000 / 48  // 48 hs
                const min = 180000  //3 minutos
            
                if( min < (date - dateUser)){
                    console.log(`User: ${u.email} Inactivo, eliminado.`)

                    await Service.deletedOne(u._id)
                    await cartService.deleteCartUser(u.cart)

                    const deleteCountEmail = {
                        from: 'Coder Test - Delete Account  ' + gmailAccount,
                        to: u.email,
                        subject: "Correo de prueba coderhouse - programacion backend ",
                        html: "<div><h1>Your account has been deleted due to lack of activity!</h1></div>",
                        attachments: []
                    }
                    transporter.sendMail(deleteCountEmail, (error, info) => {
                        if (error) {
                            console.log(error);
                            res.status(400).send({ message: "Error", payload: error })
                        }
                        
                    })
                }
                else{
                    console.log(`User: ${u.email} Activo.`)  
                }
            
            }
        })
        const result = await Service.getAll();
        return res.status(200).json({
            status: 'success',
            msg: 'Users deleted',
            data:result,
        });
        } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: 'error',
            msg: 'something went wrong :(',
            data: {},
        });
        }
}
const getError = (req,res) => {
    res.render("error404", {
      style: "error404.css",
      title: "Error 404",
    });
  }

module.exports = {
    adminPanelRender,
    adminGetUsers,
    adminRolUserById,
    adminDelUserById,
    adminInactiveUsers,
    getError 
}