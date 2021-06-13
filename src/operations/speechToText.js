const fs = require('fs').promises;
const axios = require('axios');
const speech = require('@google-cloud/speech');
const exiftool = require('node-exiftool')
const exiftoolPath = require('dist-exiftool');
const { markdownv2: format } = require('telegram-format');

const { defaultDetectVoiceMessage } = require("./../constants")
const { getRandomElement } = require("./../util/getRandomString")
const { replaceFirstName } = require("../util/replacePattern")

module.exports.SPEECH_TO_TEXT = "speech-to-text";

module.exports.speechToText = (bot, operation) => {
    bot.on('voice', async (ctx) => {
        const detectVoiceMessage = getRandomElement(operation.detectVoiceMessages) ?? defaultDetectVoiceMessage;
        const { chat: {id: chatId}, message_id } = await ctx.telegram.sendMessage(ctx.chat.id, detectVoiceMessage);

        const fileUrl = await bot.telegram.getFileLink(ctx.update.message.voice);
        const tgVoiceFile = await axios.get(fileUrl.toString(),{ responseType: 'arraybuffer' });
        const filePath = ctx.update.message.voice.file_unique_id;
        await fs.writeFile(filePath, tgVoiceFile.data);

        const ep = new exiftool.ExiftoolProcess(exiftoolPath);
        const oggMetadata = await ep.open().then(() => ep.readMetadata(filePath, ['-File:all']));
        const rateHertz = oggMetadata.data[0].SampleRate;
        await ep.close();

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
        const client = new speech.SpeechClient();
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

    bot.on('text', async (ctx, next) => {
        const t1 = ctx.update.message.text;
        const t2 = ctx.update.message?.reply_to_message?.from?.username;
        if (ctx.update.message.text === "украинский" && t2 === "ilya_dev_bot"){
            await ctx.telegram.editMessageText(ctx.update.message.chat.id, ctx.update.message.reply_to_message.message_id, null, "asdasdasdasd", { parse_mode: 'MarkdownV2' });
        }
        console.log(ctx);
        next();
    });
};