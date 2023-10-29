const ProductService = require('../services/products.service.js');
const cartService = require('../services/carts.service.js');
const productService = new ProductService()
// const cartService = new CartService()
const productsView = async (req, res)=>{
        try {
            const user = { firstName: req.session.user?.firstName, lastName: req.session.user?.lastName, email: req.session.user?.email, rol: req.session.user?.rol, cart: req.session.user?.cart}
            const { page } = req.query;
            const query = await productService.getProductData(page); 
            const { docs, ...rest } = query;
            let products = docs.map((doc) => {
              return { _id: doc._id, title: doc.title, thumbnail: doc.thumbnail, price: doc.price, stock: doc.stock ,description: doc.description};
            });
            let links = [];
            for (let i = 1; i < rest.totalPages + 1; i++) {
                links.push({ label: i, href: "http://localhost:8080/products/?page=" + i });
            }
            if (req.session.user){
                let session = req.session.user
                let rol = req.session.user.rol  
                const data={
                  products: products,
                  pagination: rest,
                  links: links,
                  user: user,
                  style: "products.css",
                  title: "Products",
                }
                data[rol] = session
                return res.status(201).render("products", data );
            
              }
              else{
                return res.status(201).render("products", {
                  products: products,
                  pagination: rest,
                  links: links,
                  style: "products.css",
                  title: "Products",
                 
                });
            
              }
            // res.status(200).render('products', { products, pagination: rest, user });
          } catch (error) {
            return res.status(500).render('error', {error: error.message})
          }
}

const cartView =  async (req, res)=>{
      try {
        let session = req.session.user
        let rol = req.session.user.rol 
        // const cid = req.params.cid;
        const cid = req.session.user.cart;
        let amount = 0
        let totalquantity = 0
        const cart = await cartService.getCartById(cid); 
        const prodsInCart = cart.products;
        const prods = prodsInCart.map((item) => {
          const { idProduct, quantity } = item;
          const { title, thumbnail, category,price } = idProduct;
          const prices =  price.toFixed(2)
          amount+= quantity*price
          totalquantity += quantity
          return {
            prices,
            title,
            thumbnail,
            category,
            quantity
          };
        });
        
        const data={
            title:'Cart',
            products:prods,
            style:'cart.css',
            amount: amount.toFixed(2),
            cart: cid,
            totalquantity: totalquantity 
        }
        data[rol]= session
        res.status(200).render('cart', data) ;
        // res.status(200).render('cart', { cart: cid, products: prods ,amount}) ;
      } catch (error) {
        console.log(error)
        return res.status(500).render('error', {error: error.message})
      }
}
const homeView = (req,res)=> {  
  if(req.session.user){
      let session = req.session.user
      let rol = req.session.user.rol 
      const data={
          title:'ecommerce backend',
          message:'Ecommerce backend  Index',
          style:'style.css',
      }
      data[rol]= session
      res.render('index', data) 
  }
  else{
      const data={
          title:'ecommerce backend',
          message:'Ecommerce backend  Index',
          style:'style.css',
      }
      res.render('index', data)  
  }
}
const chatView = (req, res) => {
  let session = req.session.user
  let rol = req.session.user.rol 
  const data = {
    title: "Chat", 
    message: "Ecommerce backend  Index",
    style: "chat.css",
  };
  data[rol]= session 
  res.render("chat", data);
}

const {ProductMethods} = require('../dao/factory')

const RealTimeProductsView = (req, res) => {
  let user = req.session.user
  let rol = req.session.user.rol  
  ProductMethods.find({}) 
    .then((pr) => {
      const data={ 
        products: pr,
        style: "realtimeproducts.css",
        title: "RealTimeProducts",
        user:user 
    }
      data[rol] = user
      res.render("realTimeProducts",data);
    })
    .catch((err) => {
      res.status(500).send(console.log("Error loading product"));
    });
}
const getViewsError = (req, res) => {
    res.render("error404", {
      style: "error404.css",
      title: "Error 404",
    });
  }

module.exports = {
    productsView,
    cartView,
    homeView,
    chatView,
    RealTimeProductsView, 
    getViewsError
}