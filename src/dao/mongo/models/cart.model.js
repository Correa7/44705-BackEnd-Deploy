const mongoose= require('mongoose')
const cartPaginate = require('mongoose-paginate-v2')


const CartSchema = new mongoose.Schema({  
  products: [{
    idProduct: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'products'  
       },
    quantity: {
      type: Number 
       }, 
    _id: false 
   }] 
    
  },{ versionKey: false });
  CartSchema.pre('getCart', function(){ 
    this.populate('docs.products')
  })
  
const CartModel= mongoose.model('cart', CartSchema)
module.exports = CartModel 