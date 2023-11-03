
const cartService = require('../services/carts.service');
const ProductService = require('../services/products.service.js');
const TicketService = require('../services/tickets.service.js');
const ticketService = new  TicketService(); 
const productService = new ProductService();
const {stripePublishableKey, stripeSecretKey} = require('../config/env.config.js')
const stripe = require('stripe')(stripeSecretKey);

const getAll = async (req, res)=> {
    try {
        let carts = await cartService.getAll()
        res.status(200).json({ 
            status: "success",
            message: 'Carts list',
            payload: carts
        })
    } catch (error) {
        res.status(400).json({
            status: "error",
            error: error.message
        })
    }
}
const newCart = async (req, res)=> {
    try {
        let newCart = await cartService.addCart()
        res.status(201).json({
            status: "success",
            message: 'Cart created successfuly',
            payload: newCart
        })
    } catch (error) {
        res.status(400).json({
            status: "error",
            error: error.message
        })
    }
}
const getCartById = async (req, res) =>{
    try {
        const cid = req.params.cid;
        const cart = await cartService.getCartById(cid);
        res.status(200).json({
            status: "success",
            message: `Cart with id:${cid}`,
            payload: cart
        })

    } catch (error) {
        res.status(400).json({
            status: "error",
            error: error.message
        })
    }
}
const addPorductToCart = async (req, res) => { 
    try {
        let user = req.session.user.email
        const pid = req.params.pid;
        const cid = req.params.cid;
        await cartService.addProductToCart(pid, cid, user) 
        const cart = await cartService.getCartById(cid);
        res.status(201).json({
            status: "success",
            message: `Product with id:${pid} was added successfully to cart with id ${cid}`,
            payload: cart
        })

    } catch (error) {
        res.status(400).json({
            status: "error",
            error: error.message
        })

    }
}
const deleteCart = async (req, res)=> {
    try {
        const cid = req.params.cid;
        const cart = await cartService.deleteCart(cid);
        res.status(200).json({
            status: "success",
            message: `The cart with id: ${cid} was deleted succesfully!`,
            payload: cart
        })
    } catch (error) {
        res.status(400).json({
            status: "error",
            error: error.message
        })

    }
}
const deleteProductFromCart = async (req, res)=> { 
    try {
        const pid = req.params.pid;
        const cid = req.params.cid;
        await cartService.deleteProductFromCart(pid, cid)
        const cart = await cartService.getCartById(cid);
        console.log(cart)
        res.status(201).json({
            status: "success",
            message: `Product with id:${pid} was deleted successfully from cart with id ${cid}`,
            payload: cart
        })

    } catch (error) {
        res.status(400).json({
            status: "error",
            error: error.message
        })

    }
}
const updateQuantity = async (req, res)=> {
    try {
        const pid = req.params.pid;
        const cid = req.params.cid;
        await cartService.updateCart(cid, pid, req.body);
        const cart = await cartService.getCartById(cid);
        res.status(201).json({
            status: "success",
            message: `Cart with id ${cid} was uploaded successfuly`,
            payload: cart
        })
    } catch (error) {
        res.status(400).json({
            status: "error",
            error: error.message
        })
    }
}
const updateCart = async (req, res)=> {
    try {
        const cid = req.params.cid;
        await cartService.updateCart(cid, null, req.body);
        const cart = await cartService.getCartById(cid);
        res.status(201).json({
            status: "success",
            message: `Cart with id ${cid} was uploaded successfuly`,
            payload: cart
        })
    } catch (error) {
        res.status(400).json({
            status: "error",
            error: error.message
        })
    }
}
const purchase = async (req, res)=> {
    try {
     
        const cid = req.params.cid
        const user = req.session.user.email
        let amount = 0
        let totalquantity = 0
        const cart = await cartService.getCartById(cid);  
        const prodsInCart = cart.products;
        const prods = prodsInCart.map((item) => {
          const { idProduct, quantity } = item;
          const { title, thumbnail, category, price, id } = idProduct;
          const prices =  price.toFixed(2)
          amount+= quantity*price
          totalquantity += quantity
          return {
            prices,
            title,
            thumbnail,
            category,
            quantity,
            id
          };
        });  
        const newTicket = await cartService.purchase(cid, user)
        await cartService.updateProductsCart(cid, newTicket.prodOutStock ) 
        await ticketService.updateStock(newTicket.prodStock)
        
        const newTk={
            id: newTicket.ticket._id,
            amount: newTicket.ticket.amount.toFixed(2), 
            purchaser:newTicket.ticket.purchaser
        }

        let data= {
            style:'purchase.css',
            title:'Your Ticket',
            products: prods, 
            newTk:newTk,
            amount:Math.floor(amount),
            totalquantity,
            stripePublishableKey
        }
        data[req.session.user.rol]=req.session.user
        return res.status(200).render('purchased',data)
    } catch (error) {
        return res.status(500).render('error404',{
            style:'error404.css',
            title:'Error 404',
            error:error.message
           })
    }
}
const getPurchase = async (req, res)=> {
    try {
        const ticket = await cartService.getPurchase()
        return res.status(200).json(ticket)
    } catch (error) {
        return res.status(500).render('error', { error: error.message })
    }
}
const deletePurchase = async (req, res)=> {
    try {
        const ticket = await cartService.deletePurchase()
        return res.status(200).json(ticket)
    } catch (error) {
        return res.status(500).render('error', { error: error.message })
    }
}
const stripeBuy = (req,res)=>{
    const {amount}= req.query
    let data= {
        style:'successpay.css',
        title:'Purchase',
        stripePublishableKey
    }
    data[req.session.user.rol]=req.session.user

    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
      })
      .then(customer => stripe.charges.create({
        amount:amount+'00',
        description: 'Ticket CoderHouse 44705',
        currency: 'usd',
        customer: customer.id 
      }))
      .then(charge =>res.status(200).render('successpay', data));
   
}
const getCartError =  (req,res)=> {
    res.render('error404',{
        style:'error404.css',
        title:'Error 404'
       })
}

module.exports = {
    getAll,
    newCart,
    getCartById,
    addPorductToCart,
    deleteCart,
    deleteProductFromCart,
    updateQuantity,
    updateCart,
    purchase, 
    getPurchase,
    deletePurchase,
    stripeBuy,
    getCartError 
}


