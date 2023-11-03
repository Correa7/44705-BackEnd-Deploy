const {Command} = require('commander')
const program = new Command()
const dotenv = require('dotenv')

program
    .option('-d', 'Variable para debug', false)
    .option('-p <port>', 'Puerto del servidor', 8080)
    .option('--mode <mode>', 'Modo de trabajo', 'develop')
program.parse()

//console.log("Options: ", program.opts());
console.log("Mode Option: ", program.opts().mode);
const environment = program.opts().mode;
dotenv.config({
    path: environment === 'production'? './src/config/.env.production':'./src/config/.env.development' 
})


module.exports = {
    port:process.env.PORT || 3000, 
    mongoUrl: process.env.MONGO_URL, 
    dbName: process.env.DATABASE_NAME,
    secret: process.env.SECRET,
    persistence: process.env.PERSISTENCE,
    githubClientId: process.env.CLIENT_ID_GITHUB,
    githubSecret: process.env.CLIENT_SECRET_GITHUB,
    githubCallBack: process.env.CALL_BACK_URL_GITHUB,
    gmailAccount:process.env.GMAIL_ACCOUNT,
    gmailAppPass: process.env.GMAIL_APP_PASSWD,
    twilioSID: process.env.TWILIO_ACCOUNT_SID,
    twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
    twilioNumber: process.env.TWILIO_SMS_NUMBER,
    userCellNumber: process.env.CELL_NUMBER,
    stripePublishableKey: process.env.STRIPE_APP_PUBLIC_KEY,
    stripeSecretKey:process.env.STRIPE_APP_SECRET_KEY,
    environment: environment

} 
 