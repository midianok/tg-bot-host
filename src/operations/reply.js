module.exports.REPLY = "reply";

module.exports.reply = (bot, operation) => {
    bot.on('text', (ctx, next) => ctx.reply(operation.response));
};