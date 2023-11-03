const UserModel = require ('../models/users.model.js'); 
 

class UserClass{
    async find(){
        const users = await UserModel.find({})
        return users
    } 
    async findOne(_id) {
        const user = await UserModel.findOne({ _id: _id });
        return user;
      }
      async findOneEmail(email) {
        const user = await UserModel.findOne({email:email});
        return user;
      }
      async createOne(data) {
        const user = await UserModel.create(data);
        return user;
      } 
      async deletedOne(_id) {
        const deleted = await UserModel.deleteOne({ _id: _id });
        return deleted;
      }
      async createMany(data) {
        const result = await UserModel.insertMany(data);
        return result;
      }
      async updateOne(_id,data) {
        let user ={
          firstName:data.firstName,
          lastName:data.lastName,
          email:data.email,
          age:data.age,
          password:data.password,
          rol:data.rol,
          documents:data.documents,
          last_connection: data.last_connection
      }
        const userUpDate = await UserModel.updateOne({ _id: _id }, user);
        return userUpDate;
      }
}
const userModel = new UserClass()
module.exports = userModel  
