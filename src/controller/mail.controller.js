const nodemailer = require('nodemailer')
const {secret,gmailAccount, gmailAppPass} = require('../config/env.config')
const jwt = require('jsonwebtoken');
const userModel = require('../dao/mongo/models/users.model')
const{createHash,isValidPass } = require ('../utils/bcrypt')


const transporter = nodemailer.createTransport({
    service:'gmail',
    port: 587,
    auth: {
        user:gmailAccount,
        pass:gmailAppPass 
    } 
})
// verificar conexion con gmail
transporter.verify(function (error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take our messages');
    } 
});

const mailOptions = {
    from: 'Coder Test - ' + gmailAccount,
    to: gmailAccount,
    subject: "Correo de prueba coderhouse - programacion backend",
    html: "<div><h1>Esto es un Test de envio de correos con Nodemailer!</h1></div>",
    attachments: []
}

const mailOptionsWithAttachments =  {
    from: 'Coder Test c_44705 - ' + gmailAccount,
    to: gmailAccount,
    subject: "Correo de prueba coderhouse - programacion backend  - attachments",
    html: `
            <div>
                <h1 style="color:green">Esto es un Test de envio de correos con Nodemailer!</h1>
                <p>Ahora usando imagenes: </p>
                <img src="cid:R"/>
                <img src="https://www.infobae.com/new-resizer/gY4FAo2c_hf_a0GeDoxOXPdureU=/arc-anglerfish-arc2-prod-infobae/public/CI5NWIC2B5BELN5T222GHNVJZE.jpg"/>
            </div>
    `,
    attachments: [
        {
            fileName: 'Reb',
            path:'src/public/images/R.jpg',
            cid: 'R'
        }
    ] 

}
 const sendEmail = (req,res)=>{
     try{
        console.log('Send Mail')
        const result = transporter.sendMail(mailOptions, (error,info)=> {
            if (error){
                res.status(400).send({message:'Error!!', payload:error})
            }
            console.log('Message send: %s', info.messageId);
            res.send({ message: "Success!!", payload: info })
        })

    }catch(error){
        console.log(error)
        res.status(500).send({ error: error, message: "No se pudo enviar el email desde:" + gmailAccount });
    }
 }
const sendMailWhitAttachments = (req,res)=>{
    try{
        let result = transporter.sendMail(mailOptionsWithAttachments, (error, info) => {
            if (error) {
                console.log(error);
                res.status(400).send({ message: "Error", payload: error })
            }
            res.send({ message: "Success!!", payload: info })
        })
    }
    catch(error){
        console.log(error)
        res.status(500).send({ error: error, message: "Could not send email from: " + gmailAccount });
    }
}
const forgotPass = (req,res)=>{ 
    res.render('resetSendMail',{
        style: "recovery.css",
        title: "Recovery Pass Form"  
    }) 
  
} 
const sendResetPass = async (req,res)=>{
    try{ 
        let userEmail = req.body.email
        console.log(userEmail)
        const user = await userModel.findOne({email:userEmail})
        console.log(user)
        if(!user){
            return res.status(401).render('resetSendMail',{
                style: "recovery.css",
                title: "Recovery Pass Form",
                message:'Non-existent email, please enter a valid email'  
            })
        }
        
        const token = jwt.sign({id:user.id}, secret, {expiresIn:'1h'})
        console.log(token)

        const emailRecoveryOptions ={
            from: 'Coder Test c_44705 - ' + gmailAccount,
            to: userEmail,
            subject: "Correo de recuperacion de contraseña - Clase 37",
            html: `
                    <div class="container">
                        <h3>Hello</h3>
                        <h3>We have sent you this email in response to your request to reset your password on company name.</h3><br>
                        <h3>To reset your password, please follow the link below:</h3>
                        <br>
                        <br>
                        <a class="btn btn-outline-primary mt-2 ms-2 me-2" href="https://44705-backend-deploy-production.up.railway.app/api/email/reset-form/?token=${token}">Click here to Reset your Password</a>
                        <br>
                        <br>
                        <br>
                    </div>
                    
            `
        }
        let result = transporter.sendMail(emailRecoveryOptions, (error, info) => {
            if (error) {
                console.log(error);
                res.status(400).send({ message: "Error", payload: error })
            }
            res.status(200).render("resetInfo", {
                style: "resetInfo.css",
                title: "Info",
                message: `Hi!  ${userEmail}  : check your Email to reset your password.`,
                message2:`Remember the Email link will expire in 1 hour!!!`
              });
            
        })
    } 
    catch(error){
        console.log(error)
        res.status(500).send({ error: error, message: "Could not send email from: " + gmailAccount });
    }
}

const resetForm = async (req,res)=>{
    try{
        res.status(200).render("resetPass", {
            style: "resetPass.css",
            title: "Info",
          });

    }
    catch(error){
        console.log(error)
        res.status(500).send({ error: error, message: "Could not send email from: " + gmailAccount });
    }
    
}
const resetPass = async (req,res)=>{
    try{
        let {email,password, token} = req.body
        const user = await userModel.findOne({email:email})
        if(isValidPass(password, user.password)){
           return res.status(401).render("resetPass", {
                style: "resetPass.css",
                title: "Info",
                message:'Enter a different password than the one you had!',
                token:token
              });
        }
        jwt.verify(token, secret, async(error, user)=>{
            if(error){
                return res.status(500).send({ error: error, message: "Could not reset user password" });
            }
            else{
                const user = await userModel.findOne({email:email})
                let data = { 
                    firstName: user.fileName, 
                    lastName: user.lastName,
                    email: user.email, 
                    age:user.age,
                    password:createHash(password),
                    rol:user.rol }
                await userModel.updateOne( { _id: user._id },data)
                return res.status(200).render("login", {
                    style: "login.css",
                    title: "Login",
                    message:'Use your new Password to log in!'
                  });
            }
        })
    }
    catch(error){
        console.log(error)
        res.status(500).send({ error: error, message: "Could not reset user password" });
    }
} 



module.exports = {
    sendEmail,
    sendMailWhitAttachments,
    forgotPass,
    sendResetPass,
    resetForm,
    resetPass 
}