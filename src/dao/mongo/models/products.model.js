const mongoose= require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2');

const ProductSchema = new mongoose.Schema({
    title:{
        type:String,
        unique:false,
        required:true,

    },
    description:{
        type:String,
        unique:false,
        required:true,
    },
    price:{
        type:Number,
        unique:false, 
        required:true,
    },
    thumbnail:{
        type:String,
        default:"https://via.placeholder.com/180x180", 
        unique:false,
        
    },
    code:{
        type:String,
        unique:false,
        required:true,
    },
    stock:{
        type:Number,
        unique:false,
        required:true,
    },
    category:{
        type:String,
        unique:false,
        required:true,
    },
    status:{
        type:Boolean,
        default:true
    },
    owner: {
        type:String,
        default:'admin@admin.com.ar'
    } 
},{ versionKey: false });
ProductSchema.plugin(mongoosePaginate);

const ProductModel = mongoose.model('products', ProductSchema)
module.exports = ProductModel