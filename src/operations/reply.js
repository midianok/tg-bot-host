const { getRandomElement } = require("./../util/getRandomString");
const { probability } = require("./../util/probability");

module.exports.REPLY = "reply";

module.exports.reply = (bot, operation) => {
    const regexp = new RegExp(operation.regexPattern);

    bot.hears(regexp, (ctx, next) => {
        const isBot = ctx.update.message.from.is_bot;
        const userInReplyList = operation.userReplyList ? operation.userReplyList.includes(ctx.update.message.from.username) : true;
        const hits = operation.probability ? probability(operation.probability) : true;

        if (isBot || !userInReplyList || !hits) {
            return next();
        }

        const message = getRandomElement(operation.replies);
        ctx.reply(message, {reply_to_message_id : ctx.message.message_id});

        return next();
    })
};