const { getRandomElement } = require("./../util/getRandomString")
module.exports.REPLY = "reply";

module.exports.reply = (bot, operation) => {
    const regexp = new RegExp(operation.regexPattern);

    bot.hears(regexp, (ctx, next) => {
        const username = ctx.update.message.from.username;
        if (operation.replyToUsers?.length > 0 && !operation.replyToUsers.includes(username)){
            return next();
        }
        next();
    })
};