const { Telegraf } = require("telegraf");
const { SPEECH_TO_TEXT, speechToText } = require("./operations/speechToText");
const { FAREWELL, farewell } = require("./operations/farewell");
const { REPLY, reply } = require("./operations/reply");
const { GREETINGS, greetings } = require("./operations/greetings");
const { findAllBotsConfigurations } = require("./db/findAllBotsConfigurations");
const { checkTime } = require("./middleware/checkTime");

const init = async (config) => {
    const bots = await findAllBotsConfigurations(config);
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
                default:
                    console.log('Unsupported feature');
            }
        }

        await bot.launch();

        process.once('SIGINT', () => bot.stop('SIGINT'))
        process.once('SIGTERM', () => bot.stop('SIGTERM'))
    }
};

module.exports.init = init;