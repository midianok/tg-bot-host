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