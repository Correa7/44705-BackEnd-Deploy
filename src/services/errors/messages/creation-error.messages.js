const generateUserErrorInfo = (user) => {
    // return msg custom
    return `Una o más propiedades fueron enviadas incompletas o no son válidas.
    Lista de propiedades requeridas:
        * fistName: type String, recibido: ${user.firstName}
        * lastName: type String, recibido: ${user.lastName}
        * email: type String, recibido: ${user.email}
        * age: type Number, recibido: ${age.email}
        
`;  
};
const generateProductErrorInfo = (product) => {
    // return msg custom
    return `Una o más propiedades fueron enviadas incompletas o no son válidas.
    Lista de propiedades requeridas:
        * title: type String, recibido: ${product.title}
        * description: type String, recibido: ${product.description}
        * price: type Number, recibido: ${product.price}
        * thumbnail: type String, recibido: ${product.thumbnail}
        * code: type String, recibido: ${product.code}
        * stock: type Number, recibido: ${product.stock}
        * category: type String, recibido: ${product.category}
        * status: type Boolean, recibido: ${product.status}
        * Owner: type String, recibido: ${product.owner}

`; 
};

module.exports = {
    generateUserErrorInfo,
    generateProductErrorInfo 
}