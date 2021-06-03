const { getRandomElement } = require("./../util/getRandomString")
module.exports.REPLY = "reply";

module.exports.reply = (bot, operation) => {

    bot.on('text', async (ctx, next) => {
        const response = getRandomElement(operation.response) ?? ctx.message.text;
        await ctx.reply(response);
    });
};