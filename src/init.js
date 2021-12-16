const { Telegraf } = require("telegraf");
const { SPEECH_TO_TEXT, speechToText } = require("./operations/speechToText");
const { RANDOM_CAT, randomCat } = require("./operations/randomCat");
const { RANDOM_PUG, randomPug } = require("./operations/randomPug");
const { FAREWELL, farewell } = require("./operations/farewell");
const { REPLY, reply } = require("./operations/reply");
const { GREETINGS, greetings } = require("./operations/greetings");
const { TIKTOK, tiktok } = require("./operations/tikTok");
const { findAllBotsConfigurations } = require("./db/findAllBotsConfigurations");
const { checkTime } = require("./middleware/checkTime");
const { errorHandler } = require("./middleware/errorHandler");
const { logger } = require("./logger");

const init = async () => {
    logger.info("app started", { pid: process.pid})
    const bots = await findAllBotsConfigurations();
    logger.info(`${bots.length} bots found`, { bots: bots.map(x => x.name) });
    for (const botConfig of bots) {
        const bot = new Telegraf(botConfig.token);

        bot.use(checkTime);
        bot.use(errorHandler);

        for (const operation of botConfig.operations) {
            switch (operation.type) {
                case SPEECH_TO_TEXT:
                    speechToText(bot, operation);
                    break;
                case REPLY:
                    reply(bot, operation)
                    break;
                case GREETINGS:
                    greetings(bot, operation)
                    break;
                case FAREWELL:
                    farewell(bot, operation)
                    break;
                case TIKTOK:
                    tiktok(bot, operation)
                    break;
                case RANDOM_CAT:
                    randomCat(bot, operation)
                    break;
                case RANDOM_PUG:
                    randomPug(bot, operation)
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