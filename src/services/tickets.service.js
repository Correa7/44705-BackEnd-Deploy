const {TicketMethods} = require('../dao/factory.js');
const ProductService = require('../services/products.service.js');
const productService = new ProductService();
const cartService = require('../services/carts.service.js'); 

  
class TicketService {

    async createTicket(tk) {
        const newTk = await TicketMethods.create(tk);
        return newTk
    }
    // //Modificamos el stock de aquellos productos que tenian stock 
    async updateStock(prodStock) {
        prodStock.map(async (prod, index) => {
            await productService.updateStockProduct(prod.idProduct, prod.stock)
            console.log("se modifico stock de los product",prodStock);
    
        })
    }
    async getTickets() {
        const newTk = await TicketMethods.getAll();
        return newTk

    }
    async deletePurchase() {
        const newTk = await TicketMethods.deletePurchase();
        return newTk

    }
}

module.exports = TicketService 

