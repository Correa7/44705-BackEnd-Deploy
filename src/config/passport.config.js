const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const gitHubStrategy = require('passport-github2').Strategy
const UserModel = require('../dao/mongo/models/users.model')
const UserService = require('../services/users.service');
const userService = new UserService();
const cartService = require('../services/carts.service')
const {createHash, isValidPass} = require ('../utils/bcrypt')
const { githubClientId, githubSecret, githubCallBack} = require('../config/env.config')
const fetch = require('node-fetch')
 
const initializePassport = () => {

    passport.use('login-passport', 
    new LocalStrategy(
        {passReqToCallback:true, usernameField:'email'}, 
        async (req, username, password, done)=>{
            try{
                let userFound = await UserModel.findOne({email:username})
         

                if (!userFound) {
                    console.log('User Not Found with username (email) ' + username);
                    return done(null, false);
                }
                if (!isValidPass(password, userFound.password)) {
                    console.log('Invalid Password');
                    return done(null, false);
                }

                let userNew = {
                    firstName: userFound.firstName,
                    lastName:userFound.lastName,
                    email:userFound.email,
                    age: userFound.age,
                    password:userFound.password,
                    rol: userFound.rol,
                    cart:userFound.cart,
                    documents: userFound.documents,
                    last_connection: new Date(Date.now())
                  
                }  
                await userService.updateOne(userFound._id.toString(), userNew)
                
                let result = await UserModel.findOne({email:username})

                return done(null, result);
            }
            catch (err){
                return done(err);
            }
        })
    ),
    passport.use('register-passport', 
    new LocalStrategy(
        {passReqToCallback:true, usernameField:'email'},
        async (req, username, password,done) => {
            try{
                let newCart = await cartService.addCart() 
                let userData = req.body
                
                let userFound = await UserModel.findOne({email:username})
                if(userFound){
                    console.log('User already exists')
                    done(null,false)
                }

                let userNew = {
                    firstName: userData.firstName,
                    lastName:userData.lastName || 'no-last-name',
                    email:userData.email,
                    age: userData.age || 18,
                    password:createHash(userData.password),
                    rol: 'User',
                    cart:newCart._id,
                    documents: [],
                    last_connection: new Date(Date.now())
                  
                }  
                console.log(userNew)
                let result = await UserModel.create(userNew)
                done(null, result)
            }
            catch (err){
                return done('Error creating user' + err)
            }
        }) 
    ),
    passport.use('auth-github', new gitHubStrategy(
        { 
            clientID: githubClientId, 
            clientSecret:  githubSecret,
            callbackURL: githubCallBack
        },
        async (accessToken, refreshToken, profile, done)=>{
            try{
                const res = await fetch('https://api.github.com/user/emails', {
                headers: {
                    Accept: 'application/vnd.github+json',
                    Authorization: 'Bearer ' + accessToken,
                    'X-Github-Api-Version': '2022-11-28',
                },
                });
                
                const emails = await res.json();
                const emailDetail = emails.find((email) => email.verified == true); 
 
                if (!emailDetail) {
                    return done(new Error('Cannot get a valid email for this user'));
                  }
                  profile.email = emailDetail.email;
                  let date = new Date(8.64e15).toString()
                  console.log(date)
                  let user = await UserModel.findOne({ email: profile.email });
                  if (!user) {
                    let userCart = await cartService.addCart()
                    const newUser = {
                      email: profile.email,
                      firstName: profile._json.name || profile._json.login || 'Avatar',
                      lastName: profile._json.name ||'Avatar',
                      password: null,
                      rol: 'User',
                      cart: userCart._id,
                      documents:[],
                      last_connection: new Date(Date.now())
                    };
                    let userCreated = await UserModel.create(newUser);
                    console.log('User registration succesful');
                    return done(null, userCreated);
                  }
                  else {
                console.log('User already exists');
                return done(null, user);
                } 
            }
            catch(err) {
                console.log('Error en auth github');
                console.log(err);
                return done(err);
                }
            }
        )
    ),
    passport.serializeUser((user,done)=>{
        done(null, user._id)
    }), 
    passport.deserializeUser(async (id,done)=>{
        let user= await UserModel.findById(id)
        done(null,user)
    })
}

module.exports =  initializePassport
