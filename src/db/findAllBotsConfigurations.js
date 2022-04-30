const MongoClient = require('mongodb').MongoClient;
const { config } = require('../config');

module.exports.findAllBotsConfigurations = async () => {
    const client = await new MongoClient(config.connectionString, { useNewUrlParser: true, useUnifiedTopology: true }).connect();

    const bots = await client
        .db(config.dbName)
        .collection(config.collectionName)
        .find({})
        .toArray();
    await client.close();
    return bots;
}

module.exports.findBotConfiguration = async (botToken) => {
    const client = await new MongoClient(config.connectionString, { useNewUrlParser: true, useUnifiedTopology: true }).connect();

    const bot = await client
        .db(config.dbName)
        .collection(config.collectionName)
        .findOne({token: botToken});
    await client.close();
    return bot;
}