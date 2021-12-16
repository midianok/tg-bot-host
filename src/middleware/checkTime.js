const moment = require('moment');
const { logger } = require("../logger");

module.exports.checkTime = (ctx, next) => {
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