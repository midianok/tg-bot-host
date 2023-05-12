const { Telegraf } = require("telegraf");
const updateLogger = require('telegraf-update-logger');
const { telegrafThrottler } = require('telegraf-throttler');
const { findAllBotsConfigurations} = require("./db/botRepository");
const { clearCache } = require("./util/operationCache");
const { checkTime } = require("./middleware/checkTime");
const { errorHandler } = require("./middleware/errorHandler");
const { debounce } = require("./middleware/debounce");
const { logger } = require("./logger");
const { features } = require("./operations/features");
const { initStack } = require("./operations/treechSpeaks");

const init = async () => {

    logger.info("app started", { pid: process.pid});
    const bots = await findAllBotsConfigurations();
    logger.info(`${bots.length} bots found`, { bots: bots.map(x => x.name) });

    for (const botConfig of bots) {
        const bot = new Telegraf(botConfig.token);

        bot.use(checkTime);
        bot.use(errorHandler);
        bot.use(debounce);
        bot.use(telegrafThrottler());
        bot.use(updateLogger({ colors: true }));

        botConfig.operations.forEach(op => {
            const operation = features[op.type];
            if (op.type === "treech-text") {
                initStack();
            }

            if (!operation) {
                logger.error(`unsupported feature "${operation.type}" for bot "${bot.name}"`, { botName: bot.name, operation:  operation.type});
                return;
            }

            operation(bot);
        });

        bot.launch();

        bot.command('clearcache', (ctx) => {
            const result = clearCache(bot.token);
            ctx.reply(result ? "Cleared" : "Nothing to clear");
        });

        process.once('SIGINT', () => {
            bot.stop('SIGINT');
            logger.info("app stopped", { pid: process.pid, reason: 'SIGINT'});
            process.exit();
        });

        process.once('SIGTERM', () => {
            bot.stop('SIGTERM');
            logger.info("app stopped", { pid: process.pid, reason: 'SIGTERM'});
            process.exit();
        });
    }
};

module.exports.init = init;
