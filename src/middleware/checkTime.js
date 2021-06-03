const moment = require('moment');

module.exports.checkTime = (ctx, next) => {
    if (!ctx.message?.date){
        return next();
    }

    const timeDiffInMinutes = moment(moment() - moment.unix(ctx?.message?.date)).minutes();

    if (timeDiffInMinutes < 60) {
        next();
    } else {
        console.log(`Ignoring messages updateType: 'message' from ${ctx.chat.id}`);
    }
};