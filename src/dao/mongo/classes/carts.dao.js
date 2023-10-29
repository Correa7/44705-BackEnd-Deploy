const CartModel = require("../models/cart.model");
const uuid4= require('uuid4')

class CartClass{ 

    async find(){
        let carts = await CartModel.find({})
        return carts
    }
    async create(cart){
        let newCart = await CartModel.create(cart)
        return newCart
    }
    async findPopulatedOne(id){
        let cart = await CartModel.findOne({_id: id}).populate('products.idProduct') 
        return cart
    }
    async updateOne(id){
        await CartModel.updateOne({_id: id}, {products: []});
    }
    async updateProducts(id, products){
        await CartModel.updateOne({_id: id}, {products});
    }
    async findOne(id){
        let cart = await CartModel.findOne({_id: id});
        return cart;
    }
    async delete (id){
       let cart= await CartModel.deleteOne({_id:id})
        return cart
    } 
}

const cartModel = new CartClass();
module.exports = cartModel