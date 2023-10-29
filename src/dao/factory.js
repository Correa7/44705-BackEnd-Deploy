const {persistence} = require('../config/env.config')
const MongoSingleton = require('../config/mongodb-singleton');

const cartModel = require('./mongo/classes/carts.dao');
const productModel = require('./mongo/classes/products.dao.js');
const chatModel = require('./mongo/classes/chat.dao.js');
const ticketModel = require('./mongo/classes/tickets.dao.js');
const userModel = require('./mongo/classes/users.dao.js')

let  CartMethods;
let  ProductMethods;
let  ChatMethods;
let  TicketMethods;
let  UserMethods;

async function initializeMongoService() {
  console.log("Iniciando servicio para MongoDB");
  try {
      await MongoSingleton.getInstance();

  } catch (error) {
      console.error("Error al iniciar MongoDB:", error);
      process.exit(1); // Salir con código de error
  }
}


switch (persistence) {
    case 'MONGO':
      console.log('Persistence with Mongo')

      initializeMongoService()
      CartMethods = cartModel; 
      ProductMethods = productModel;
      ChatMethods = chatModel;
      TicketMethods = ticketModel;
      UserMethods = userModel; 
  
      break;
    case 'FS':
      console.log('Persistence with FileSystem');
      const cartManager = require('./fs/classes/CartsManager.js');
      CartMethods = cartManager;
      const productManager = require('./fs/classes/ProductManager.js');
      ProductMethods = productManager;
  
      break;
    default:
      console.error("Persistencia no válida en la configuración:", config.persistence);
      process.exit(1); // Salir con código de error   
}

  module.exports = {
    CartMethods,
    ProductMethods,
    ChatMethods,
    TicketMethods,
    UserMethods
  }