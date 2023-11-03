const UserService = require('../services/users.service');
const Service = new UserService()
const UserAdminDTO = require('../dao/DTO/users.admin.dto');
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

const getUser = async (req,res)=>{
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
const getUserById = async (req, res) => {
    try {
        const uid = req.params.uid;
        const user= await  Service.getById(uid)
        return user? 
        res.status(200).json({
            status: 'success', 
            msg: 'User Get by ID',
            data:user,
        }):
        res.status(200).json({
            status: 'error',
            msg: 'User not found',                                                             
            data: user,
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
const postUser = (req, res) => {
    res.redirect('/session/login')
} 
const rolUserById = async (req,res)=>{
    try{
        let _id = req.params.uid
        const user = await  Service.getById(_id)
        if(!user){
            res.status(400).send(`User with id: ${uid} Not found or non-existent :(`)
        }
        else{
            let address = user.documents.some(e => e.name === 'address')
            let account= user.documents.some(e => e.name === 'accountStatus')
            let identification = user.documents.some(e => e.name === 'identification')
            if(address && account && identification){
                
                user.rol= 'Premium' 
                await user.save() 
                return res.status(201).json({
                status: 'success',
                message: 'User update rol: Premium',
                payload: user
                });s
            }
            else{
                user.rol= 'User' 
                await user.save() 
                return res.status(400).send({
                    message:'You must have the following documents uploaded to be Premium: address, identification, account status', 
                    Rol: user.rol,
                    documents: user.documents,
                })
            }

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
const delUserById =  async (req, res) => {
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
const delUsers = async (req,res)=>{
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
const putUserById = async (req, res) => { 
    try {
        const uid = req.params.uid;
        const data= req.body
        await Service.updateOne(uid,data)
        return res.status(201).json({
            status: 'success',
            msg: 'User update',
            data:data,
        });
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
const userDocuments = async (req,res) => {
    try{
        const uid = req.params.uid;
        const user= await  Service.getById(uid)
        if(!user){
            res.status(400).send(`User with id: ${uid} Not found or non-existent :(`)
        }
        const sentDocuments=[]
        const file =req.files
        for(const e in file){
            if(file[e][0].fieldname === 'imageProfile'){
                continue
            }
            else{
                let name=file[e][0].fieldname
                let reference=file[e][0].path
                sentDocuments.push({name:name,reference:reference})
                
                if(user.documents.some(e=>e.name === name)){
                    continue
                }
                else{
                    user.documents.push({name:name,reference:reference})
                }
            }
        }
         await user.save()
         console.log(user)
        return res.status(200).send({message:'Route :api/users/:uid/document post method', payload: user.documents})
    }
    catch(e){
        console.log(e);
        return res.status(500).json({
            status: 'error',
            msg: 'something went wrong :(',
            data: {},
        });
    }

}
const deleteDocuments = async (req,res) => {
    try{
        const uid = req.params.uid;
        const user= await  Service.getById(uid)
        if(!user){
            res.status(400).send(`User with id: ${uid} Not found or non-existent :(`)
        }
        
        user.documents= []
        await user.save()
        return res.status(200).send({message:'Route :api/user/:uid/document delete method', payload:user})
    }
    catch(e){
        console.log(e);
        return res.status(500).json({
            status: 'error',
            msg: 'something went wrong :(',
            data: {},
        });
    }

}
 
module.exports = {
    getUser,
    getUserById,
    postUser,
    delUserById,
    delUsers,
    putUserById,
    rolUserById,
    adminRolUserById,
    userDocuments,
    deleteDocuments 
}
