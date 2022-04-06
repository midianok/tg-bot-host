const moment = require('moment');
const { logger } = require("../logger");

module.exports.checkTime = (ctx, next) => {
    if (ctx.update?.inline_query){
        return next();
    }

    if (ctx.update?.message?.via_bot){
        return next();
    }

    if (!ctx.message?.date){
        return next();
    }

    const timeDiffInMinutes = moment(moment() - moment.unix(ctx?.message?.date)).minutes();

    if (timeDiffInMinutes < 10) {
        next();
    } else {
        logger.info(`Ignoring messages updateType: 'message' from ${ctx.chat.id}`);
    }
};