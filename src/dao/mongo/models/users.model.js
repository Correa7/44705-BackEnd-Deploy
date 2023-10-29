const mongoose= require('mongoose')
const userPaginate = require('mongoose-paginate-v2')

// Modificar el modelo de User para que cuente con una nueva propiedad “documents” 
// el cual será un array que contenga los objetos con las siguientes propiedades
//      name: String (Nombre del documento).
//      reference: String (link al documento).
// Identificación, Comprobante de domicilio, Comprobante de estado de cuenta
// No es necesario crear un nuevo modelo de Mongoose para éste.
// Además, agregar una propiedad al usuario llamada “last_connection”, 
// la cual deberá modificarse cada vez que el usuario realice un proceso de login y logout


const userSchema= new mongoose.Schema({
    firstName:{
        type:String,
        unique:false,
        required:true
    }, 
    lastName:{
        type:String,
        unique:false,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    age:{
        type:Number,
        unique:false,
        required:true,
        default:18
    },
    password:{
        type: String, 
        max: 100,
    },
    rol:{
        type:String,
        enum:['User','Admin','Premium'],
        default:'User'
    },
    cart: {
        type: String,
        required: false
      },
    last_connection:{ 
        type: String,
        required: false
      },
    documents: [{
        name: { 
            type: String,
            required: false 
           },
        reference: {
          type: String,
          required: false
           },
        _id: false 
       }] 
},{ versionKey: false })

const userModel = mongoose.model('User', userSchema)
module.exports = userModel


