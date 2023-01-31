const { Telegraf } = require("telegraf");
const { findAllBotsConfigurations, addVoiceInlineItem} = require("./db/botRepository");
const { clearCache } = require("./util/operationCache");
const { checkTime } = require("./middleware/checkTime");
const { errorHandler } = require("./middleware/errorHandler");
const { logger } = require("./logger");
const { features } = require("./operations/features");

const init = async () => {
    //await addVoiceInlineItem('5124918242:AAG7BNYu4oeeRmQb7WAAFym_p-gnFvpJm04');
    //return;

    logger.info("app started", { pid: process.pid})

    const bots = await findAllBotsConfigurations();

    logger.info(`${bots.length} bots found`, { bots: bots.map(x => x.name) });

    for (const botConfig of bots) {
        const bot = new Telegraf(botConfig.token);

        bot.use(checkTime);
        bot.use(errorHandler);
        botConfig.operations.map(op => {
            const operation = features[op.type];

            if (!operation) {
                logger.error(`Unsupported feature "${operation.type}" for bot "${bot.name}"`, { botName: bot.name, operation:  operation.type});
                return;
            }

            operation(bot);
        })

        await bot.launch();

        bot.command('clearcache', (ctx) => {
            const result = clearCache(bot.token);
            ctx.reply(result ? "Cleared" : "Nothing to clear");
        });

        process.once('SIGINT', () => {
            bot.stop('SIGINT');
            logger.info("app stoped", { pid: process.pid, reason: 'SIGINT'})
            process.exit()
        })

        process.once('SIGTERM', () => {
            bot.stop('SIGTERM')
            logger.info("app stoped", { pid: process.pid, reason: 'SIGTERM'})
            process.exit()
        })
    }
};

module.exports.init = init;