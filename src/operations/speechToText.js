const fs = require('fs').promises;
const axios = require('axios');
const speech = require('@google-cloud/speech');
const exiftool = require('node-exiftool')
const exiftoolPath = require('dist-exiftool');
const { markdownv2: format } = require('telegram-format');

const { defaultDetectVoiceMessage } = require("./../constants");
const { getRandomElement } = require("./../util/getRandomString");
const { replaceFirstName } = require("../util/replacePattern");
const { logger } = require("../logger");

module.exports.SPEECH_TO_TEXT = "speech-to-text";

module.exports.speechToText = (bot, operation) => {
    bot.on('voice', async (ctx) => {
        const logMeta = {
            botName: ctx.botInfo.username,
            operation: module.exports.SPEECH_TO_TEXT,
            chatName: ctx.update.message.chat.username,
            fromUserName: ctx.update.message.from.username,
            fromFirstName: ctx.update.message.from.first_name,
            updateId: ctx.update.update_id
        };
        logger.info(`voice message detected`, logMeta)

        const detectVoiceMessage = getRandomElement(operation.detectVoiceMessages) ?? defaultDetectVoiceMessage;
        const { chat: {id: chatId}, message_id } = await ctx.telegram.sendMessage(ctx.chat.id, detectVoiceMessage);

        logger.info(`trying to getFileLink`, {...logMeta});
        const fileUrl = await bot.telegram.getFileLink(ctx.update.message.voice);

        logger.info(`trying to download voice file`, {...logMeta, fileUrl: fileUrl.toString()});
        const tgVoiceFile = await axios.get(fileUrl.toString(),{ responseType: 'arraybuffer' });
        const filePath = ctx.update.message.voice.file_unique_id;
        await fs.writeFile(filePath, tgVoiceFile.data);
        logger.info(`voice file downloaded`, {...logMeta, filePath});

        const ep = new exiftool.ExiftoolProcess(exiftoolPath);
        const oggMetadata = await ep.open().then(() => ep.readMetadata(filePath, ['-File:all']));
        const rateHertz = oggMetadata.data[0].SampleRate;
        await ep.close();
        logger.info(`reading voice file metadata`, {...logMeta, fileMetadata: oggMetadata.data[0]});

        const fileContent = await fs.readFile(filePath, {encoding: 'base64'});
        fs.unlink(filePath)
            .then(() => logger.info(`voice file deleted`, logMeta));

        const request = {
            audio: { content: fileContent },
            config: {
                encoding: 'OGG_OPUS',
                sampleRateHertz: rateHertz,
                languageCode: 'ru-RU',
                alternativeLanguageCodes: ['uk_UA']
            },
        };
        logger.info(`sending voice file to recognize`, {...logMeta, recogmizeConfig: request.config});
        const client = new speech.SpeechClient();
        const [response] = await client.recognize(request);
        logger.info(`getting recognize response`, {...logMeta, response });

        const transcription = response.results.map(x => x.alternatives.map(z => z.transcript)).join(" ");
        let result;
        const firstName = format.bold(format.escape(ctx.update.message.from.first_name));
        if (transcription) {
            logger.info(`voice message recognize success`, logMeta);
            const randomResponse = getRandomElement(operation.successVoiceDetectionMessages);
            const replacedPatternResponse = replaceFirstName(format.escape(randomResponse), firstName);
            result = `${replacedPatternResponse}:\n${format.italic(format.escape(transcription))}`
        }
        else {
            logger.info(`voice message recognize fail`, logMeta);
            const randomResponse = getRandomElement(operation.failVoiceDetectionMessages);
            result = replaceFirstName(format.escape(randomResponse),  firstName);
        }

        await ctx.telegram.editMessageText(chatId, message_id, null, result, { parse_mode: 'MarkdownV2' });

        logger.info(`voice message recognize complete`, {...logMeta, result });
    });
};