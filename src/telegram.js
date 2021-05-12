const { Telegraf } = require('telegraf');

const runTgBot = async (config) => {
    const bot = new Telegraf(config.token);
    bot.start((ctx) => ctx.reply('Starting echo'));

    bot.on('text', ctx => ctx.telegram.sendMessage(ctx.chat.id, ctx.message.text) );

    await bot.launch();
}

module.exports.runApp = runTgBot;