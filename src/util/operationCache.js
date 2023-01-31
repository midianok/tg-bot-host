const NodeCache = require( "node-cache" );
const { findBotConfiguration } = require("../db/botRepository");
const myCache = new NodeCache( { stdTTL: 60 * 60 * 24 } );

module.exports.getCachedOperation = async (botToken, operationType) => {

    if(myCache.has(botToken)){
        return myCache.get(botToken);
    }

    const botConfiguration = await findBotConfiguration(botToken);
    const operation = botConfiguration
        .operations
        .filter(o => o.type == operationType)[0]

    myCache.set(botToken, operation);

    return operation;
}

module.exports.clearCache = (botToken) => {
    if(myCache.has(botToken)){
         myCache.del(botToken)
         return true;
    }
    return false;
}