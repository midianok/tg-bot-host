module.exports.VOICE_INLINE = "voice-inline";

module.exports.sendVoiceInline = (bot, operation) => {
    bot.on('inline_query', async (ctx) => {
        const replies = [
            {
                id: 1,
                type: 'voice',
                title: "🥕 Полупукеры",
                voice_file_id: "AwACAgEAAxkBAAMJYk34RGf9T43TrKC8_MmVvkErMO4AAs4BAALI91lHUXzE1oBYI4cjBA",
            },
            {
                id: 2,
                type: 'voice',
                title: "🥕 Приятного аппетита",
                voice_file_id: "AwACAgEAAxkBAAMKYk34YxvVg-49-IqpejUQSFTsRYIAAi8BAAKrzzlHiift-bgc9OAjBA",
            },
            {
                id: 3,
                type: 'voice',
                title: "🥕 Убью",
                voice_file_id: "AwACAgEAAxkBAAMLYk34eVXvD6ccHLfKvy1qG0xAR2EAAjIBAAKrzzlHsHHrSlGUXfojBA",
            },
            {
                id: 4,
                type: 'voice',
                title: "🥕 Хрюк",
                voice_file_id: "AwACAgEAAxkBAAMMYk34j42qyHlwgDK1r0xn-NN2Qq4AAtABAALI91lH_yrhASKEqLkjBA",
            },
            {
                id: 5,
                type: 'voice',
                title: "🥕 Гс",
                voice_file_id: "AwACAgEAAxkBAAMOYk35uUGIJwKon-QLYRhUtUxtkCQAArgBAAIGkolFzuOpLnLtRqojBA",
            },
            {
                id: 6,
                type: 'voice',
                title: "🥕 О нет",
                voice_file_id: "AwACAgEAAxkBAAMQYll7NkXt566ExZ1s6qtboJxq33EAAm4CAAI_L9BGKRwqjrKj66gjBA",
            },
            {
                id: 7,
                type: 'voice',
                title: "🇪🇸 Хорни",
                voice_file_id: "AwACAgQAAxkBAAMRYll7dCOPE7vs09M41gyqq6y5-igAAnYLAAIhTrBS7TvO-o4i7nUjBA",
            },
            {
                id: 8,
                type: 'voice',
                title: "🇪🇸 МММ... Да!",
                voice_file_id: "AwACAgQAAxkBAAMSYll7pJAqKwdcXIAgH3HYuOQj_vkAAncLAAIhTrBSKRiWGmDnAh0jBA",
            },
            {
                id: 9,
                type: 'voice',
                title: "🇪🇸 Meow",
                voice_file_id: "AwACAgQAAxkBAAMTYll72RuZyiKoTAABCiL0upF6xfcjAAJ7CwACIU6wUo12h9HpPTQDIwQ",
            }
        ];

        ctx.answerInlineQuery(replies);
    })
}