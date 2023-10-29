const winston = require('winston');
const {environment} = require('../config/env.config');

const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http:4,
        debug:5
    },
    colors: {
        fatal: 'red',
        error: 'red',
        warning: 'yellow',
        info: 'blue',
        http:'green',
        debug: 'white'
    }
};

const devLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports:[
        new winston.transports.Console({
            level:'debug',
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelsOptions.colors }),
                winston.format.simple()
            )
        }),
    ]
});

const prodLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports:[
        new winston.transports.Console({
            level:'info',
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelsOptions.colors }),
                winston.format.simple()
            )
        }),
        new winston.transports.File(
            {
                filename: './errors.log',
                level: 'error',
                format: winston.format.simple()
            }
        )
    ]
});

const addLogger = (req, res, next) => {
    // logger
    if (environment === 'production') {
        req.logger = prodLogger;
        req.logger.info(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`);
    } else {
        req.logger = devLogger;
        req.logger.info(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`);
    }
 
    next();
};
 
module.exports= addLogger;

