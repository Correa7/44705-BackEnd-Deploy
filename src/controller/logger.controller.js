const {environment} = require('../config/env.config');

const getLogger = (req,res)=>{
    if(environment === 'production'){
        req.logger.fatal("Prueba de log level Fatal!");
        req.logger.error("Prueba de log level Error!");
        req.logger.warning("Prueba de log level Warning!");
        req.logger.info("Prueba de log level Info!");
    }
    else{
        req.logger.fatal("Prueba de log level Fatal!");
        req.logger.error("Prueba de log level Error!");
        req.logger.warning("Prueba de log level Warning!");
        req.logger.info("Prueba de log level Info!");
        req.logger.http("Prueba de log level HTTP!");
        req.logger.debug("Prueba de log level Debug!");
    }
    res.status(200).send('Test Loggers');
};

module.exports = getLogger;