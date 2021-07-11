const { getRandomElement } = require("./../util/getRandomString");
const { probability } = require("./../util/probability");
const { logger } = require("../logger");

module.exports.REPLY = "reply";

module.exports.reply = (bot, operation) => {
    const regexp = new RegExp(operation.regexPattern);

    bot.hears(regexp, (ctx, next) => {
        const logMeta = {
            botName: ctx.botInfo.username,
            operation: module.exports.REPLY,
            chatName: ctx.update.message.chat.username,
            fromUserName: ctx.update.message.from.username,
            fromFirstName: ctx.update.message.from.first_name,
            updateId: ctx.update.update_id,
            messageToReply: ctx.update.message.text,
            regexp: operation.regexPattern
        };

        const isBot = ctx.update.message.from.is_bot;
        const userInReplyList = operation.userReplyList ? operation.userReplyList.includes(ctx.update.message.from.username) : true;
        const hits = operation.probability ? probability(operation.probability) : true;

        if (isBot || !userInReplyList || !hits) {
            logger.info("reply fail", {...logMeta, isBot, userInReplyList, hits});
            return next();
        }

        const message = getRandomElement(operation.replies);
        ctx.reply(message, {reply_to_message_id : ctx.message.message_id});
        logger.info("reply success", {...logMeta, isBot, userInReplyList, hits, reply: message});

        return next();
    })
};