const fs = require('fs').promises;
const axios = require('axios');
const speech = require('@google-cloud/speech');
const ffprobeStatic = require('ffprobe-static');
const ffprobe = require('ffprobe');
const { markdownv2: format } = require('telegram-format');

const { defaultDetectVoiceMessage } = require("./../constants")
const { getRandomElement } = require("./../util/getRandomString")
const { replaceFirstName } = require("../util/replacePattern")

module.exports.SPEECH_TO_TEXT = "speech-to-text";

module.exports.speechToText = (bot, operation) => {
    bot.on('voice', async (ctx, next) => {

        const detectVoiceMessage = getRandomElement(operation.detectVoiceMessages) ?? defaultDetectVoiceMessage;
        const { chat: {id: chatId}, message_id } = await ctx.telegram.sendMessage(ctx.chat.id, detectVoiceMessage);

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

        let result;
        const firstName = format.bold(ctx.update.message.from.first_name);
        if (transcription) {
            const randomResponse = getRandomElement(operation.successVoiceDetectionMessages);
            const replacedPatternResponse = replaceFirstName(format.escape(randomResponse), firstName);
            result = `${replacedPatternResponse}:\n${format.italic(format.escape(transcription))}`
        }
        else {
            const randomResponse = getRandomElement(operation.failVoiceDetectionMessages);
            result = replaceFirstName(format.escape(randomResponse), firstName);
        }

        await ctx.telegram.editMessageText(chatId, message_id, null, result, { parse_mode: 'MarkdownV2' });
    });
};