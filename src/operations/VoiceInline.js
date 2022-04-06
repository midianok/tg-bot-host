module.exports.VOICE_INLINE = "voice-inline";

module.exports.sendVoiceInline = (bot, operation) => {
    bot.on('inline_query', async (ctx) => {
        const replies = [
            {
                id: 1,
                type: 'voice',
                title: "Полупукеры",
                voice_file_id: "AwACAgEAAxkBAAMJYk34RGf9T43TrKC8_MmVvkErMO4AAs4BAALI91lHUXzE1oBYI4cjBA",
            },
            {
                id: 2,
                type: 'voice',
                title: "Приятного аппетита",
                voice_file_id: "AwACAgEAAxkBAAMKYk34YxvVg-49-IqpejUQSFTsRYIAAi8BAAKrzzlHiift-bgc9OAjBA",
            },
            {
                id: 3,
                type: 'voice',
                title: "Убью",
                voice_file_id: "AwACAgEAAxkBAAMLYk34eVXvD6ccHLfKvy1qG0xAR2EAAjIBAAKrzzlHsHHrSlGUXfojBA",
            },
            {
                id: 4,
                type: 'voice',
                title: "Хрюк",
                voice_file_id: "AwACAgEAAxkBAAMMYk34j42qyHlwgDK1r0xn-NN2Qq4AAtABAALI91lH_yrhASKEqLkjBA",
            },
            {
                id: 5,
                type: 'voice',
                title: "Гс",
                voice_file_id: "AwACAgEAAxkBAAMOYk35uUGIJwKon-QLYRhUtUxtkCQAArgBAAIGkolFzuOpLnLtRqojBA",
            }
        ];

        ctx.answerInlineQuery(replies);
    })
}