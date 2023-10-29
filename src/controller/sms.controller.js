const twilio = require ('twilio')
const {twilioAuthToken, twilioSID, twilioNumber, userCellNumber} = require('../config/env.config')

const twilioClient = twilio(twilioSID, twilioAuthToken)
const SMSOptions = {
    body: "Esto es un mensaje SMS de prueba usando Twilio desde  CoderHouse - C_44705",
    from: twilioNumber,
    to:  userCellNumber
}

const sendSMS = async (req,res)=>{
    try{
        console.log("Enviando SMS usando Twilio account");
   
        const result = await twilioClient.messages.create(SMSOptions)
        res.status(200).send({ message: "Success", payload: result })
    }
    catch(error){
        console.log(error)
        res.status(500).send(error)
    }
}


module.exports = {sendSMS}
