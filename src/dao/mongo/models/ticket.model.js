const mongoose = require('mongoose')
const uuid4= require('uuid4') 


const date = new Date(Date.now());

const ticketSchema = new mongoose.Schema({
    code:{
        type: String,
        default: uuid4(),
 
    },
    purchase_datetime:{
        type: String,
        default: date.toString()
    },
    amount:{
        type:Number, 
        unique:false,
        required:true,
    },
    purchaser:{
        type:String,
      
    }
},{ versionKey: false })

const TicketModel = mongoose.model('ticket', ticketSchema)

module.exports= TicketModel