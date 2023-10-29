const ProductModel = require ('../models/products.model.js');

class ProductClass{
    async getAll(page, limit, sort, query){
        const options = {
            page: page || 1,
            limit: limit || 8,
            sort: sort || "asc"
        };
        const queryOptions = {};
        if(query){
            queryOptions.$text = {$search: query}
        };
        if(sort){
            options.sort = {
                price: sort
            }
        };
        let queryResult = await ProductModel.paginate(queryOptions,options);

        return queryResult;
    }
    async create(product){
        const newProduct = await ProductModel.create(product);
        return newProduct;
    }
    async paginate(customA, customB){
       let paginated = await ProductModel.paginate(customA, customB);
       return paginated;
    }
    async findOne(id){
        const product = await ProductModel.findOne({ _id: id});
        return product;
    }
    async find(){
        const product = await ProductModel.find({}).lean().exec();
        return product; 
    }
    async updateOne(id, product){
        await ProductModel.updateOne({_id: id},  {
            title: product.title,
            description: product.description,
            price: product.price,
            thumbnail: product.thumbnail,
            code: product.code,
            stock: product.stock,
            category: product.category,
            status: true
        });
       
    }
    async updateOneStock(id, product){
        await ProductModel.updateOne({_id: id},  {stock: product,});
    }
    async deleteProduct(id){
        const deletedProduct = await ProductModel.deleteOne({_id: id});
        return deletedProduct;
    }
    async createMany(data) {
        const result = await ProductModel.insertMany(data);
        return result;
      } 
}
const productModel = new ProductClass()
module.exports = productModel