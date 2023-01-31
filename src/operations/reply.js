const { getRandomElement } = require("./../util/getRandomString");
const { probability } = require("./../util/probability");
const { logger } = require("../logger");
const {getCachedOperation} = require("../util/operationCache");

const operationName = "reply"
module.exports.REPLY = operationName;

module.exports.reply = async (bot) => {
    const operation = await getCachedOperation(bot.token, operationName)
    const regexp = new RegExp(operation.regexPattern);

    bot.hears(regexp,async (ctx, next) => {
        const operation = await getCachedOperation(bot.token, operationName);
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
        const replies = [];
        if (operation.replies && operation.replies.length > 0) {
            replies.push(...operation.replies.map( x =>  { return { type: 'text', reply: x } }))
        }

        if (operation.stiсkerReplies && operation.stiсkerReplies.length > 0) {
            replies.push(...operation.stiсkerReplies.map( x =>  { return { type: 'sticker', reply: x } }));
        }
        if (replies.length === 0) {
            logger.info("replies is empty", {...logMeta, isBot, userInReplyList, hits});
            return next();
        }

        const result = getRandomElement(replies);
        if (result.type === 'text') {
            ctx.reply(result.reply, {reply_to_message_id : ctx.message.message_id});
            logger.info("reply with text success", {...logMeta, isBot, userInReplyList, hits, reply: result.reply});
        }

        if (result.type === 'sticker') {
            ctx.replyWithSticker(result.reply, {reply_to_message_id : ctx.message.message_id});
            logger.info("reply with sticker success", {...logMeta, isBot, userInReplyList, hits, reply: result.reply});
        }

        return next();
    })
};