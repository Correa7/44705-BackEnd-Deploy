const { Server } = require ('socket.io');
const ProductDTO = require ('../dao/DTO/product.dto.js'); 
const ProductService  = require ('../services/products.service.js');
const productService = new ProductService();
const  ChatService  = require ('../services/chat.service'); 
const chatService = new ChatService();
const messages = [] 

function connectSocket(httpServer){ 
  const socketServer = new Server(httpServer);

  socketServer.on('connection', (socket) => {
      console.log(`New user connected: ${socket.id}`); 
      
     // Comunicacion con realTimeProduct.js
    socket.on('addProduct' ,(data)=>{ 
        const productToAdd = new ProductDTO(data)
        productService.addProduct(productToAdd)
        .then(pr=>{
            productService.find({})
            .then(pr=>{
                socketServer.emit('newData', pr)
            })
            .catch(error=>{
                throw new Error(error.message);   
                
            }) 
        })
        .catch(error=>{
            throw new Error(error.message);   
            
        })  

    })
    socket.on('delProduct', async(data)=>{
        let {id} = data
     
        productService.deleteProduct(id)
        .then(pr =>{ 
            productService.find({})
            .then(pr=>{
                socketServer.emit('newData', pr)
            })
            .catch(error=>{
                throw new Error(error.message);   
                
            }) 
        })
        .catch(error=>{
            throw new Error(error.message);   
            
        })
        // try {
        //     let pid = data;
        //     let product = await productService.getProductById(pid)
        //     console.log(product)
        //     let owner = await Service.getByEmail(product.owner)
        //     console.log(owner)
        //     let rol = owner.rol
        //     let email = owner.email
        //     if(rol === 'Premium'){
        //         let productFound = await productService.getProductById(pid)
        //         if(productFound.owner === email){
        //           await productService.deleteProduct(pid);
        //           console.log(`The product with id: ${pid} was deleted succesfully!`)
        //           socketServer.emit('newData', product)  
        //         }
        //         else{
        //             console.log(`The product with id: ${pid} could not be removed!`)
        //             socketServer.emit('newData', product) 
        //         }
        //     }
        //     else{
        //       if(owner.rol === 'Premium'){
        //         await productService.deleteProduct(pid);
  
        //         const deleteProductPremium = {
        //           from: 'Coder Test - Delete Product Premium User ' + gmailAccount,
        //           to: owner.email,
        //           subject: "Correo de prueba coderhouse - programacion backend ",
        //           html: "<div><h1>A product created by you was removed!</h1></div>",
        //           attachments: []
        //           }
        //           transporter.sendMail(deleteProductPremium, (error, info) => {
        //               if (error) {
        //                   console.log(error);
        //                   res.status(400).send({ message: "Error", payload: error })
        //               }
                      
        //           })
        //           console.log(`The product with id: ${pid} was deleted succesfully!`)
        //           socketServer.emit('newData', product) 
                 
        //       }
        //       else{
        //         await productService.deleteProduct(pid);
        //         console.log(`The product with id: ${pid} was deleted succesfully!`)
        //         socketServer.emit('newData', product) 
        //       }
        //     }
        // } catch (error) {
        //     console.log('Error send message') ; 
            
        // } 
        
    })

    // Chat sockets
    socket.on('new-message', (data)=>{
            console.log(data)
            chatService.findOne(data.user)
            .then(pr=>{
                if(pr){
                    let id = pr._id
                    chatService.updateOne(id,data)
                    .then(pr=>{
                        messages.push(data)
                        socketServer.emit('messages-all', messages)
                    })
                    .catch(err=>{
                        console.log('Error send message')   
                    })
                }
                else{
                    chatService.create(data)
                    .then(pr=>{
                    messages.push(data)
                    socketServer.emit('messages-all', messages)
                    })
                    .catch(err=>{
                        console.log('Error send message')   
                    })
                }
            })
    })
  });
}

module.exports = connectSocket
 