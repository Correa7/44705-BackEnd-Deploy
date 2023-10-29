const ChatModel = require ('../models/chat.model.js');

class ChatClass{

    async findLeaned(){
        const messages = await ChatModel.find({}).lean().exec();
        return messages
    }

    async create(msg){
        const newMessage = await ChatModel.create(msg)
        return newMessage;
    }
    async findOne (data){
        const chat = await ChatModel.findOne({user:data});
        return chat;
    }
    async updateOne(id, data){
        const chat = await ChatModel.updateOne({_id: id},{
           user: data.user,
           message: data.message
        })
        return chat
    }

}
const chatModel = new ChatClass()
module.exports = chatModel 
