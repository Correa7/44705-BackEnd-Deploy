const {faker} = require('@faker-js/faker')

const generateUser = () => {
    let numOfProducts = parseInt(faker.string.numeric());
    let products = [];
    for (let i = 0; i < numOfProducts; i++) {
        let data = {
            product:generateProduct(),
            quantity:parseInt(faker.string.numeric())
        }
        products.push(data);
    }
    return { 
        firtsName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        age: 20,
        password: faker.internet.password(),
        rol:'User',
        cart: products,
        id: faker.database.mongodbObjectId(),
    };
};

const generateProduct = () => {
    return {
        title: faker.commerce.product(),
        description:faker.commerce.productDescription(),
        price: faker.commerce.price(),
        stock: parseInt(faker.string.numeric(2)),
        code:faker.string.numeric(5),
        thumbnail: faker.image.urlPicsumPhotos(),
        id: faker.database.mongodbObjectId()
    }
};

module.exports= {generateUser,generateProduct}