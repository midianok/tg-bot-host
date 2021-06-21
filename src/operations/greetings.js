module.exports.GREETINGS = "greetings";
const { getRandomElement } = require("./../util/getRandomString");
const { logger } = require("../logger");

module.exports.greetings = (bot, operation) => {
    bot.on('new_chat_members', (ctx, next) => {
        const logMeta = {
            botName: ctx.botInfo.username,
            operation: module.exports.GREETINGS,
            chatName: ctx.update.message.chat.username,
            fromUserName: ctx.update.message.from.username,
            fromFirstName: ctx.update.message.from.first_name,
            updateId: ctx.update.update_id
        };
        ctx.message.new_chat_members.forEach(function (user) {
            const userName = user.username ?? user.first_name;
            logger.info('new chat member detected', { ...logMeta, userName });
            const response = getRandomElement(operation.response);
            const message = response.replace("{user}", `@${userName}`)
            ctx.reply(message);
            logger.info('new chat member greet complete', { ...logMeta, resultMessage: message });
        });
    })

}