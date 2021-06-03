const fs = require('fs').promises;
const axios = require('axios');
const speech = require('@google-cloud/speech');
const ffprobeStatic = require('ffprobe-static');
const ffprobe = require('ffprobe');

module.exports.SPEECH_TO_TEXT = "speech-to-text";

module.exports.speechToText = (bot, operation) => {
    bot.on('voice', async (ctx, next) => {
        const { chat: {id: chatId}, message_id } = await ctx.telegram.sendMessage(ctx.chat.id, "Тэкс, снова войс. А могли бы жопу скинуть.");

        const fileUrl = await bot.telegram.getFileLink(ctx.update.message.voice);
        const tgVoiceFile = await axios.get(fileUrl.toString(),{ responseType: 'arraybuffer' });
        const filePath = ctx.update.message.voice.file_unique_id;
        await fs.writeFile(filePath, tgVoiceFile.data);
        const oggMetadata = await ffprobe(filePath, { path: ffprobeStatic.path });
        const rateHertz = oggMetadata.streams[0].sample_rate;

        const client = new speech.SpeechClient();
        const fileContent = await fs.readFile(filePath, {encoding: 'base64'});

        fs.unlink(filePath);

        const request = {
            audio: { content: fileContent },
            config: {
                encoding: 'OGG_OPUS',
                sampleRateHertz: rateHertz,
                languageCode: 'ru-RU',
            },
        };

        const [response] = await client.recognize(request);
        const transcription = response.results.map(x => x.alternatives.map(z => z.transcript)).join(" ");

        const result = transcription ?
            `Вот что наговорил\\_a *${ctx.update.message.from.first_name}* \\(а лучше бы жопу скинул\\_a\\):\n_${transcription.replaceAll("-", "\\-")}_` :
            `Ничего не понятно что вы там *${ctx.update.message.from.first_name}* ноговорил\\_a, если честно, лучше бы жопу скинул\\_a`;

        await ctx.telegram.editMessageText(chatId, message_id, null, result, { parse_mode: 'MarkdownV2' });
    });
};