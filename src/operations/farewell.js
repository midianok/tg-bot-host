module.exports.FAREWELL = "farewell";
const { getRandomElement } = require("./../util/getRandomString")

module.exports.farewell = (bot, operation) => {
    bot.on('left_chat_member', (ctx, next) => {
        const user = ctx.message.left_chat_member
        const userName = user.username ?? user.first_name;
        const response = getRandomElement(operation.response);
        const message = response.replace("{user}", `@${userName}`)
        ctx.reply(message, { reply_to_message_id : ctx.message.message_id });
    })

}