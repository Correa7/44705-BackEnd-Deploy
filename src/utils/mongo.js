const mongoose= require('mongoose')
const {dbName} = require('../config/env.config')
class ManagerMongo {

    constructor (url){ 
        this.url = url
    } 
  
        connect(){
            return mongoose.connect(this.url+dbName, {useUnifiedTopology:true, useNewUrlParser:true})
            .then(connect =>{ console.log ('conexion exitosa')})
            .catch(err=>{console.log(err)})
        }
    
}

module.exports = ManagerMongo 