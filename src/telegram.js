const { Telegraf } = require('telegraf');
const MongoClient = require('mongodb').MongoClient;

const runTgBot = async (config) => {
    const client = new MongoClient(config.connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

    client.connect(async err => {
        const collection = client.db(config.dbName).collection(config.collectionName);
        const bots = await collection.find({}).toArray();
        for (const botConfig of bots) {
            const bot = new Telegraf(botConfig.token);

            for (const action of botConfig.actions) {
                if (action.on === 'text'){
                    bot.on(action.on, ctx => ctx.reply(action.reply));
                }

                if (action.on === 'new_chat_members'){
                    bot.on(action.on, (ctx) => {
                        ctx.message.new_chat_members.forEach(function (user) {
                            const message = action.reply.replace("{user}", `@${user.username}`)
                            ctx.reply(message);
                        });
                    })
                }
            }

            bot.launch();

            process.once('SIGINT', () => bot.stop('SIGINT'))
            process.once('SIGTERM', () => bot.stop('SIGTERM'))
        }
        await client.close();
    });
}

module.exports.runApp = runTgBot;