module.exports.FAREWELL = "farewell";
const { getRandomElement } = require("./../util/getRandomString");
const { logger } = require("../logger");

module.exports.farewell = (bot, operation) => {
    bot.on('left_chat_member', (ctx, next) => {
        const logMeta = {
            botName: ctx.botInfo.username,
            operation: module.exports.FAREWELL,
            chatName: ctx.update.message.chat.username,
            fromUserName: ctx.update.message.from.username,
            fromFirstName: ctx.update.message.from.first_name,
            updateId: ctx.update.update_id
        };

        const user = ctx.message.left_chat_member
        const userName = user.username ?? user.first_name;
        logger.info('left chat member detected', { ...logMeta, userName });
        const response = getRandomElement(operation.response);
        const message = response.replace("{user}", `@${userName}`)
        ctx.reply(message, { reply_to_message_id : ctx.message.message_id });
        logger.info('left chat member farewell complete', { ...logMeta, resultMessage: message });
    })

}