const express = require('express'); 
const app = express();
const {port, mongoUrl, secret, dbName} = require('./config/env.config');



// Public Folder
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended:true}));

// Sessions requires
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');

app.use(cookieParser()); 
app.use(session({ 
    store: MongoStore.create({
        mongoOptions:{useNewUrlParser:true,useUnifiedTopology:true},
        mongoUrl:mongoUrl+dbName
    }),
    secret:secret,
    resave:false,
    saveUninitialized:false 

}));

// Passport Passport-Local
const initializePassport = require('./config/passport.config');
const passport = require('passport');
initializePassport(); //Importante que este antes de el paasport.initialize
app.use(passport.initialize());
app.use(passport.session());


// logger
const addLogger = require('./utils/logger');
app.use(addLogger);

// Swagger
const { swaggerSpecs } = require('./utils/swaggerSpect.js');
const swaggerUi = require("swagger-ui-express");
//Documentation 
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));


// Routes
const {homeView} = require('./controller/views.controller')
app.get('/',homeView)           
//Views
const routesViews = require('./routes/views.route');
app.use('/views', routesViews);
// Admin
const routesAdmin = require('./routes/admin.route');
app.use('/api/admin', routesAdmin);
//Products
const routesProduct = require('./routes/products.route');
app.use('/api/product', routesProduct);
//Cart
const routesCart = require('./routes/cart.route');  
app.use('/api/cart', routesCart);  
// Users 
const routesUsers = require('./routes/user.route');
app.use('/api/user',routesUsers); 
// Sessions
const sessions = require('./routes/sessions.route');
app.use('/session', sessions);
// auth.pasport
const authPassport = require('./routes/passport.route');
app.use('/auth', authPassport); 
// Mailing
const emailRoute = require('./routes/email.route');
app.use('/api/email', emailRoute);
// Twilio
const smsRoute = require('./routes/sms.route');
app.use('/api/sms', smsRoute);
// Mcks
const mocksRoute = require('./routes/mocks.route');
app.use('/api/mocks', mocksRoute);
// Logger
const loggerRoute = require('./routes/logger.route');
app.use('/api/logger',loggerRoute);

// Handlebars
const handlebars = require('express-handlebars');
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views/');

// Sockets set

const http = require('http');
const server = http.createServer(app);
const connectSocket = require ('./utils/socket');
connectSocket(server)


server.listen(port, ()=>{
    console.log('Server is runing on port: ' + port) 
});

app.get("*", (req, res) => {
    return res.status(404).json({
        status: "error",
        message: "Not Found"
    });
});

