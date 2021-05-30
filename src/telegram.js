const { Telegraf } = require('telegraf');
const fs = require('fs').promises;
const ffprobe = require('ffprobe');
const ffprobeStatic = require('ffprobe-static');
const speech = require('@google-cloud/speech');
const axios = require('axios');
const MongoClient = require('mongodb').MongoClient;
const { GREETINGS, REPLY, SPEECH_TO_TEXT} = require('./operations');

const runTgBot = async (config) => {
    const client = new MongoClient(config.connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

    client.connect(async err => {
        const collection = client.db(config.dbName).collection(config.collectionName);
        const bots = await collection.find({}).toArray();
        for (const botConfig of bots) {
            const bot = new Telegraf(botConfig.token);

            for (const operation of botConfig.operations) {
                switch (operation.type) {
                    case SPEECH_TO_TEXT:
                        bot.on('voice', async ctx => {
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
                            const transcription = response.results[0]?.alternatives[0]?.transcript;
                            const message = transcription ?
                                `Вот что наговорил\\_a *${ctx.update.message.from.first_name}* \\(а лучше бы жопу скинул\\_a\\):\n_${transcription}_` :
                                `Ничего не понятно что вы там *${ctx.update.message.from.first_name}* ноговорил\\_a, если честно, лучше бы жопу скинул\\_a`;
                            const result = message.replace("-", " ");

                            await ctx.telegram.editMessageText(chatId, message_id, null, result, { parse_mode: 'MarkdownV2' });
                            });
                        break;
                    case REPLY:
                        bot.on('text', ctx => ctx.reply(operation.response));
                        break;
                    case GREETINGS:
                        bot.on('new_chat_members', (ctx) => {
                            ctx.message.new_chat_members.forEach(function (user) {
                                const userName = user.username ?? user.first_name;
                                const message = operation.response.replace("{user}", `@${userName}`)
                                ctx.reply(message);
                            });
                        })
                        break;
                    default:
                        console.log('Unsupported feature');
                }
            }

            bot.launch();

            process.once('SIGINT', () => bot.stop('SIGINT'))
            process.once('SIGTERM', () => bot.stop('SIGTERM'))
        }
        await client.close();
    });
}

module.exports.runApp = runTgBot;