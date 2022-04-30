const { getCachedOperation } = require("../util/operationCache");
const { markdownv2: format } = require('telegram-format');
const operationName = "voice-inline"
module.exports.VOICE_INLINE = operationName;

module.exports.sendVoiceInline = (bot, operation) => {
    bot.on('voice', async ctx => {
        const fileId = format.monospace(ctx.update.message.voice.file_id);
        await ctx.replyWithMarkdown(fileId, { parse_mode: 'MarkdownV2' })
    });

    bot.on('inline_query', async (ctx) => {
        const operation = await getCachedOperation(bot.token, operationName);
        const replies = operation.voices.map(x =>{
            return {
                id: x.id,
                title: x.title,
                voice_file_id: x.voice_file_id,
                type: 'voice'
            }
        })
        const filteredReplies = replies.filter(x => x.title.toLowerCase().includes(ctx.update.inline_query.query.toLowerCase()));

        ctx.answerInlineQuery(filteredReplies);
    })
}