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

module.exports.addVoiceInlineItem = async (botToken, fileId) => {
    const client = await new MongoClient(config.connectionString, { useNewUrlParser: true, useUnifiedTopology: true }).connect();
    const query = { "token": botToken, "operations.type": "voice-inline"};

    const botConfig = await client
        .db(config.dbName)
        .collection(config.collectionName)
        .findOne(query);

    const voiceIds = botConfig
        .operations
        .find(operation => operation.type == "voice-inline")
        .voices
        .map(voice => voice.id);

    const lastVoiceId = Math.max(...voiceIds)

    const updateDocument = {
        $push: {
            "operations.$.voices": {
                id: lastVoiceId + 1,
                title: 'new_voice',
                voice_file_id: fileId,
                type: 'voice'
            }
        },
    };

    const result = await client
        .db(config.dbName)
        .collection(config.collectionName)
        .updateOne(query, updateDocument);

    await client.close();
}