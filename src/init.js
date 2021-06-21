const { Telegraf } = require("telegraf");
const { SPEECH_TO_TEXT, speechToText } = require("./operations/speechToText");
const { FAREWELL, farewell } = require("./operations/farewell");
const { REPLY, reply } = require("./operations/reply");
const { GREETINGS, greetings } = require("./operations/greetings");
const { TIKTOK, tiktok } = require("./operations/tikTok");
const { findAllBotsConfigurations } = require("./db/findAllBotsConfigurations");
const { checkTime } = require("./middleware/checkTime");
const { logger } = require("./logger");

const init = async () => {
    logger.info("app started", { pid: process.pid})
    const bots = await findAllBotsConfigurations();
    logger.info(`${bots.length} bots finded`, { bots: bots.map(x => x.name) });
    for (const botConfig of bots) {
        const bot = new Telegraf(botConfig.token);
        bot.use(checkTime);
        for (const operation of botConfig.operations) {
            switch (operation.type) {
                case SPEECH_TO_TEXT:
                    await speechToText(bot, operation);
                    break;
                case REPLY:
                    await reply(bot, operation)
                    break;
                case GREETINGS:
                    await greetings(bot, operation)
                    break;
                case FAREWELL:
                    await farewell(bot, operation)
                    break;
                case TIKTOK:
                    await tiktok(bot, operation)
                    break;
                default:
                    logger.error(`Unsupported feature "${operation.type}" for bot "${bot.name}"`, { botName: bot.name, operation:  operation.type});
            }
        }

        await bot.launch();

        process.once('SIGINT', () => {
            bot.stop('SIGINT');
            logger.info("app stoped", { pid: process.pid, reason: 'SIGINT'})
        })
        process.once('SIGTERM', () => {
            bot.stop('SIGTERM')
            logger.info("app stoped", { pid: process.pid, reason: 'SIGTERM'})
        })
    }
};

module.exports.init = init;