 const {generateUser,generateProduct} = require('../utils/mocks')



 const mockUsers = async (req,res)=>{ 
    try {
        let users = [];
        let numUsuarios = 5
        for (let index = 0; index < numUsuarios; index++) {
            users.push(generateUser())
        }
        res.send({ status: "success", payload: users })
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo obtener los usuarios:" });
    }
 }
const mockProducts = async (req,res)=>{
    try {
        let products = [];
        let numOfProducts = 50
        for (let index = 0; index < numOfProducts; index++) {
            products.push(generateProduct())
        }
        res.send({ status: "success", payload: products })
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo obtener los Productos:" });
    }
}
const mockGetError = (req,res)=>{ 
    res.render('error404',{
        style:'error404.css',
        title:'Error 404'
       })
}

module.exports= {
    mockProducts,
    mockUsers,
    mockGetError
}