
const cartService = require('../services/carts.service');
const ProductService = require('../services/products.service.js');
const TicketService = require('../services/tickets.service.js');
const ticketService = new  TicketService(); 
const productService = new ProductService();

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
        const user= req.session.user.email
        const newTicket = await cartService.purchase(cid, user)
        await cartService.updateProductsCart(cid, newTicket.prodOutStock )
        await ticketService.updateStock(newTicket.prodStock)
        const newTk={
            id: newTicket.ticket._id,
            amount: newTicket.ticket.amount, 
            purchaser:newTicket.ticket.purchaser
        }
        let data= {
            style:'purchase.css',
            title:'purchase',
            newTk:newTk
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
    getCartError 
}





// const Cart= require('../dao/mongo/models/cart.model')
// const CartService = require('../dao/mongo/services/cart.services')
// const cartService = new CartService()
// const UserService = require('../dao/mongo/services/users.services')
// const userService = new UserService()
// const ProductService = require('../dao/mongo/services/products.services')
// const productService = new ProductService()
// const TicketService = require('../dao/mongo/services/ticket.services')
// const ticketService = new TicketService()

 
// const getCart = (req,res)=> {
//     cartService.getCarts()
//     .then(pr=>{
//         res.status(200).send(
//             {
//                 status:'success',
//                 msg:'cart Find',
//                 data:pr
//             }
//         )
//     })
//     .catch(err=>{
//         res.status(500).send(
//             console.log('Error loading product')
//         )
//     })  
     
// }
// const postCart = (req,res)=> {
//     let data = req.body
//     cartService.postCart(data)
//     .then(pr=>{
//         res.status(201).send({
//             msg:'Cart create successfully',
//             data:data
//         })
//     })
//     .catch(err=>{
//         res.status(500).send(
//             console.log('Error create Cart')
//         )
//     })
// }
// const getCartById = (req,res)=> {
//     const cId = req.params.cId
//     cartService.getCartById(cId)
//     .then(pr=>{
//         res.status(200).send(
//             {
//                 status:'success',
//                 msg:'cart Find',
//                 data:pr
//             }
//         )
//     })
//     .catch(err=>{
//         res.status(500).send(
//             console.log('Error get Cart')
//         )
//     })  
// }
// const postCartProductsById = (req,res)=>{
//     const cId = req.params.cId
//     const pId = req.params.pId
//     cartService.getCartById(cId)
//     .then(pr=>{
//         let arr= pr.products
//         let prIndex=arr.findIndex(pr=> pr.product._id.toString() === pId)
//         if (prIndex != -1) {
//                 arr[prIndex].quantity++
//                 let prodnew=[]
//                 for (let prop of arr){
//                     prodnew.push({product:prop.product._id.toString(),quantity:prop.quantity})
//                 }
//                 pr.products = prodnew
//                 cartService.updateCart(cId,pr)
//                 .then(pr=>{
//                     res.status(200).send(
//                         {
//                             status:'success',
//                             msg:'Product added to cart',
//                             data:pr
//                         }
//                     )
//                 })
//                 .catch(err=>{
//                     res.status(500).send({
//                         status: 'error',
//                         msg: 'something went wrong :(',
//                         data: {},
//                     })
//                 })
//         }
//         else{
//             pr.products.push({ product:pId, quantity:1})
//             cartService.updateCart(cId,pr)
//             .then(pr=>{
//                 res.status(200).send(
//                     {
//                         status:'success',
//                         msg:'Product added to cart',
//                         data:pr
//                     }
//                 )
//             })
//             .catch(err=>{
//                 res.status(500).send({
//                     status: 'error',
//                     msg: 'something went wrong :(',
//                     data: {},
//                 })
//             })
//        }
//     })
//     .catch(err=>{
//         res.status(500).send({
//             status: 'error',
//             msg: 'something went wrong :(',
//             data: {},
//         })
//     }) 
// }
// const delCartById = async (req,res)=>{
//     let cId = req.params.cId
//     cartService.delProductsCart(cId)
//     .then(pr=>{
//         res.status(200).send(
//             {
//                 status:'success',
//                 msg:'Empty cart products',
//                 data:pr
//             }
//         )
//     })
//     .catch(err=>{
//         res.status(500).send(
//             console.log('Error empty Cart')
//         )
//     }) 
// }
// const delCartProductById = (req,res)=>{
//     const cId = req.params.cId
//     const pId = req.params.pId
//     cartService.getCartById(cId)
//     .then(pr=>{
//         let arr= pr.products 
//         let prIndex= arr.findIndex(pr=> pr.product._id.toString() === pId)
//         if (prIndex != -1) {
//             if(arr[prIndex].quantity <= 1){
//                 arr.splice(prIndex, 1)
//                 let data=[]
//                 for (let prop of arr){
//                     data.push({product:prop.product._id.toString(),quantity:prop.quantity})
//                 }
//                 pr.products = data
//                 cartService.updateCart(cId,pr)
//                  .then(pr=>{
//                     res.status(200).send(
//                         {
//                             status:'success',
//                             msg:'Product Delete to cart',
//                             data:data
//                         }
//                     )
//                 })
//                 .catch(err=>{
//                     res.status(500).send({
//                         status: 'error',
//                         msg: 'something went wrong :(',
//                         data:{}
//                     })
//                 })
//             }
//             else{
//                 arr[prIndex].quantity-=1
//                 pr.products = arr
//                 cartService.updateCart(cId,pr)
//                  .then(pr=>{
//                     res.status(200).send(
//                         {
//                             status:'success',
//                             msg:'Product Delete to cart',
//                             data:arr
//                         }
//                     )
//                 })
//                 .catch(err=>{
//                     res.status(500).send({
//                         status: 'error',
//                         msg: 'something went wrong :(',
//                         data: {},
//                     })
//                 })
//             }
               
//         }
//         else{
//                 res.status(200).send(
//                     {
//                         status:'success',
//                         msg:'Product not found or dont exist',
//                         data:pr
//                     }
//                 )  
//        }
//     })
//     .catch(err=>{
//         res.status(500).send({
//             status: 'error',
//             msg: 'something went wrong :(',
//             data: {},
//         })
//     }) 
// }
// const putCartById = (req,res)=>{
//     let cId = req.params.cId
//     let data = req.body
//     Cart.findOne({_id:cId})
//     .then(pr=>{
//         let arr = data
//         pr.products=arr
//         Cart.updateOne({_id:cId},pr)
//                 .then(pr=>{
//                     res.status(200).send(
//                         {
//                             status:'success',
//                             msg:'Products update',
//                             data:pr
//                         }
//                     )
//                 })
//                 .catch(err=>{
//                     res.status(500).send({
//                         status: 'error',
//                         msg: 'something went wrong :(',
//                         data: {},
//                     })
//                 })
//     })
//     .catch(err=>{
//         res.status(500).send({
//             status: 'error',
//             msg: 'something went wrong :(',
//             data: {},
//         })
//     }) 
// }
// const putCartProductsById = (req,res)=>{
//     let cId = req.params.cId
//     let pId = req.params.pId
//     let {data} = req.body
//     Cart.findOne({_id:cId})
//     .then(pr=>{
//         let arr= pr.products
//         let prIndex=arr.findIndex(pr=> pr.product._id.toString() === pId)
//         if (prIndex != -1) {
//                 arr[prIndex].quantity = parseInt(data)
//                 let prodnew=[]
//                 for (let prop of arr){
//                     prodnew.push({product:prop.product._id.toString(),quantity:prop.quantity})
//                 }
//                 pr.products = prodnew
//                 Cart.updateOne({_id:cId},pr)
//                 .then(pr=>{
//                     res.status(200).send(
//                         {
//                             status:'success',
//                             msg:'Product quantity update',
//                             data:pr
//                         }
//                     )
//                 })
//                 .catch(err=>{
//                     res.status(500).send({
//                         status: 'error',
//                         msg: 'something went wrong :(',
//                         data: {},
//                     })
//                 })
//         }
//         else{
//             res.status(200).send(
//                 {
//                     status:'success',
//                     msg:'Product not found or dont exist',
//                     data:pr
//                 }
//             )
//        }
//     })
//     .catch(err=>{
//         res.status(500).send({
//             status: 'error',
//             msg: 'something went wrong :(',
//             data: {},
//         })
//     }) 
// }
// const purchase = async (req,res) => {
//     let user =  req.session.user
//     console.log(JSON.stringify(user))
//     try{
//         let cId = req.params.cId
//         let conStock = [];
//         let sinStock = [];
//         let clientCart= await cartService.getCartById(cId)
//         for (let prop of clientCart.products){
//             let compare = await productService.getById(prop.product._id.toString())
//             if (compare.stock >= prop.quantity){
//                 conStock.push({product:prop.product._id.toString(),quantity:prop.quantity })  
//             }
//             else{
//                 sinStock.push({product:prop.product._id.toString(), quantity:prop.quantity })
//             }
//         }



//         console.log('###' + JSON.stringify(conStock))
//         console.log('!!!' + JSON.stringify(sinStock))
//         res.send({
//             message:'Purchase ok!!!',
//         })
//     }
//     catch(err){
//         console.log(err)
//     } 
// }


// const getCartError =  (req,res)=> {
//     res.render('error404',{
//         style:'error404.css',
//         title:'Error 404'
//        })
// }



 
// module.exports = {
//     getCart,
//     postCart,
//     getCartById,
//     postCartProductsById,
//     delCartById,
//     delCartProductById,
//     putCartById,
//     putCartProductsById,
//     getCartError,
//     purchase
// }






// class CartController {
//     async getAll(req, res) {
//         try {
//             let carts = await cartService.getAll()
//             res.status(200).json({ 
//                 status: "success",
//                 message: 'Carts list',
//                 payload: carts
//             })
//         } catch (error) {
//             res.status(400).json({
//                 status: "error",
//                 error: error.message
//             })
//         }
//     }
//     async newCart(req, res) {
//         try {
//             let newCart = await cartService.addCart()
//             res.status(201).json({
//                 status: "success",
//                 message: 'Cart created successfuly',
//                 payload: newCart
//             })
//         } catch (error) {
//             res.status(400).json({
//                 status: "error",
//                 error: error.message
//             })
//         }
//     }
//     async getCartById(req, res) {
//         try {
//             const id = req.params.id;
//             const cart = await cartService.getCartById(id);
//             res.status(200).json({
//                 status: "success",
//                 message: `Cart with id:${id}`,
//                 payload: cart
//             })
 
//         } catch (error) {
//             res.status(400).json({
//                 status: "error",
//                 error: error.message
//             })
//         }
//     }
//     async addPorductToCart(req, res) {
//         try {
//             const pid = req.params.pid;
//             const cid = req.params.cid;
//             await cartService.addProductToCart(pid, cid)
//             const cart = await cartService.getCartById(cid);
//             res.status(201).json({
//                 status: "success",
//                 message: `Product with id:${pid} was added successfully to cart with id ${cid}`,
//                 payload: cart
//             })

//         } catch (error) {
//             res.status(400).json({
//                 status: "error",
//                 error: error.message
//             })

//         }
//     }
//     async delete(req, res) {
//         try {
//             const id = req.params.id;
//             const cart = await cartService.deleteCart(id);
//             res.status(200).json({
//                 status: "success",
//                 message: `The cart with id: ${id} was deleted succesfully!`,
//                 payload: cart
//             })
//         } catch (error) {
//             res.status(400).json({
//                 status: "error",
//                 error: error.message
//             })

//         }
//     }
//     async deleteProductFromCart(req, res) {
//         try {
//             const pid = req.params.pid;
//             const cid = req.params.cid;
//             await cartService.deleteProductFromCart(pid, cid)
//             const cart = await cartService.getCartById(cid);
//             console.log(cart)
//             res.status(201).json({
//                 status: "success",
//                 message: `Product with id:${pid} was deleted successfully from cart with id ${cid}`,
//                 payload: cart
//             })

//         } catch (error) {
//             res.status(400).json({
//                 status: "error",
//                 error: error.message
//             })

//         }
//     }
//     async updateQuantity(req, res) {
//         try {
//             const pid = req.params.pid;
//             const cid = req.params.cid;
//             await cartService.updateCart(cid, pid, req.body);
//             const cart = await cartService.getCartById(cid);
//             res.status(201).json({
//                 status: "success",
//                 message: `Cart with id ${cid} was uploaded successfuly`,
//                 payload: cart
//             })
//         } catch (error) {
//             res.status(400).json({
//                 status: "error",
//                 error: error.message
//             })
//         }
//     }
//     async updateCart(req, res) {
//         try {
//             const cid = req.params.cid;
//             await cartService.updateCart(cid, null, req.body);
//             const cart = await cartService.getCartById(cid);
//             res.status(201).json({
//                 status: "success",
//                 message: `Cart with id ${cid} was uploaded successfuly`,
//                 payload: cart
//             })
//         } catch (error) {
//             res.status(400).json({
//                 status: "error",
//                 error: error.message
//             })
//         }
//     }
//     async purchase(req, res) {
//         try {
//             const cid = req.params.cid
//           const user= req.session.user.email
//             // const user = req.body.email
//             const newTicket = await cartService.purchase(cid, user)
//             await cartService.updateProductsCart(cid, newTicket.prodOutStock )
//           await  ticketService.updateStock(newTicket.prodStock)
//             const newTk={
//                 id: newTicket.ticket._id,
//                 amount: newTicket.ticket.amount, 
//                 purchaser:newTicket.ticket.purchaser
//             }
//             return res.status(200).render('purchased', { newTk })

//         } catch (error) {
//             return res.status(500).render('error', { error: error.message })
//         }
//     }
//     async getPurchase(req, res) {
//         try {

//             const ticket = await cartService.getPurchase()

//             return res.status(200).json(ticket)
//         } catch (error) {
//             return res.status(500).render('error', { error: error.message })
//         }
//     }
//     async deletePurchase(req, res) {
//         try {

//             const ticket = await cartService.deletePurchase()

//             return res.status(200).json(ticket)
//         } catch (error) {
//             return res.status(500).render('error', { error: error.message })
//         }
//     }
// }
// const cartController = new CartController()