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
        _id: faker.database.mongodbObjectId(),
        firtsName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        age: 20,
        password: faker.internet.password(),
        rol:'User',
        cart: products,
        last_connection:faker.date.between({ from: '2023-10-01T00:00:00.000Z', to: '2023-11-01T00:00:00.000Z'}),
        documents: []
    };
}; 

const generateProduct = () => {
    return {
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.product(),
        description:faker.commerce.productDescription(),
        thumbnail: faker.image.urlPicsumPhotos(),
        price: faker.commerce.price(),
        stock: parseInt(faker.string.numeric(2)),
        code:faker.string.numeric(5),
        category:'Catedory moch',
        status: true,
        owner:faker.internet.email()
    }
};

module.exports= {generateUser,generateProduct}