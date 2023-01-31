const { logger } = require("../logger");

module.exports.errorHandler = async (ctx, next) => {
    await retry(3, next, ctx);
};

const retry = async (tryCount, func, ctx) => {
    let counter = 0;
    let success = false;
    while (counter < tryCount && !success) {
        try {
            await func();
            success = true;
        } catch (e) {
            counter++;
            logger.error(e, {
                botName: ctx.botInfo.username,
                chatName: ctx.update.message?.chat.username,
                fromUserName: ctx.update.message?.from.username,
                fromFirstName: ctx.update.message?.from.first_name,
                updateId: ctx.update.update_id,
                tryCount: counter
            });

            await sleep(3000);
        }
    }
}


const sleep = async (ms) => {
    const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));
    await snooze(ms);
};

