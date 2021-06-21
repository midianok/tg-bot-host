const { config } = require('./config');
const MongoClient = require('mongodb').MongoClient;
const winston = require('winston');
require('winston-mongodb');

const logger = winston.createLogger({
    format: winston.format.combine(winston.format.json(), winston.format.metadata()),
    transports: [
        new winston.transports.MongoDB({
            db : new MongoClient(config.connectionString, { useNewUrlParser: true, useUnifiedTopology: true }).connect()
        }),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ],
});
module.exports.logger = {
    info: (message, meta) => logger.info(message, meta),
    error: (message, meta) => logger.error(message, meta),
}