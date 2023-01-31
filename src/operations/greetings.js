const { getRandomElement } = require("./../util/getRandomString");
const { logger } = require("../logger");
const {getCachedOperation} = require("../util/operationCache");

const operationName = "greetings";
module.exports.GREETINGS = operationName;

module.exports.greetings = (bot) => {
    bot.on('new_chat_members', async (ctx, next) => {
        const logMeta = {
            botName: ctx.botInfo.username,
            operation: module.exports.GREETINGS,
            chatName: ctx.update.message.chat.username,
            fromUserName: ctx.update.message.from.username,
            fromFirstName: ctx.update.message.from.first_name,
            updateId: ctx.update.update_id
        };
        const operation = await getCachedOperation(bot.token, operationName);

        ctx.message.new_chat_members.forEach(function (user) {
            const userName = user.username ?? user.first_name;
            logger.info('new chat member detected', {...logMeta, userName});
            const response = getRandomElement(operation.response);
            const message = response.replace("{user}", `@${userName}`)
            ctx.reply(message);
            logger.info('new chat member greet complete', {...logMeta, resultMessage: message});
        });
    })
}