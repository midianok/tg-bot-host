module.exports.GREETINGS = "greetings";

module.exports.greetings = (bot, operation) => {
    bot.on('new_chat_members', (ctx, next) => {
        ctx.message.new_chat_members.forEach(function (user) {
            const userName = user.username ?? user.first_name;
            const message = operation.response.replace("{user}", `@${userName}`)
            ctx.reply(message);
        });
    })

}