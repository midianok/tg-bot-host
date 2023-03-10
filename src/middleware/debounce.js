const { logger } = require("../logger");
let isCooldown = false;

module.exports.debounce = (ctx, next) => {
    if (isCooldown) {
        logger.error('Debounced', {
            botName: ctx.botInfo.username,
            chatName: ctx.update.message?.chat.username,
            fromUserName: ctx.update.message?.from.username,
            fromFirstName: ctx.update.message?.from.first_name,
            updateId: ctx.update.update_id
        });
        return;
    }

    isCooldown = true;
    setTimeout(() => isCooldown = false, 990);

    return next();
};
