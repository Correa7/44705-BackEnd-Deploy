const uuid4 = require('uuid4') 

class ProductDTO{

    constructor(product){
        
            this.title =  product.title,
            this.description =  product.description, 
            this.price =  product.price,
            this.thumbnail =  product.thumbnail || "https://via.placeholder.com/180x180",
            this.code =  product.code || uuid4(),
            this.stock =  product.stock  || 0,
            this.category  =  product.category
            this.owner = product.owner || 'admin@admin.com.ar'
        
    }
} 
module.exports= ProductDTO