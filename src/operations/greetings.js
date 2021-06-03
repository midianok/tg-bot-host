module.exports.GREETINGS = "greetings";
const { getRandomElement } = require("./../util/getRandomString")

module.exports.greetings = (bot, operation) => {
    bot.on('new_chat_members', (ctx, next) => {
        ctx.message.new_chat_members.forEach(function (user) {
            const userName = user.username ?? user.first_name;
            const response = getRandomElement(operation.response);
            const message = response.replace("{user}", `@${userName}`)
            ctx.reply(message);
        });
    })

}