const TicketModel = require ('../models/ticket.model.js');

class TicketClass{ 

    async create(newTicket){
        const newTk = await TicketModel.create(newTicket)
        return newTk
    }
async getAll(){
        const newTk = await TicketModel.find({})
        return newTk
    }
async deletePurchase(){
        const newTk = await TicketModel.deleteMany({}) 
        return newTk
    }

}
const ticketModel = new TicketClass()
module.exports = ticketModel  
