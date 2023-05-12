const operationName = "image-distort";
const fetch = require('node-fetch');
const { config } = require('../config')
module.exports.IMAGE_DISTORT = operationName;

module.exports.imageDistort = async (bot) => {
    bot.hears(/нука|Нука|жмыхни|Жмыхни/, async (ctx, next) => {
        const logMeta = {
            botName: ctx.botInfo.username,
            operation: module.exports.GREETINGS,
            chatName: ctx.update.message.chat.username,
            fromUserName: ctx.update.message.from.username,
            fromFirstName: ctx.update.message.from.first_name,
            updateId: ctx.update.update_id
        };
        const imageIds = ctx.update.message.reply_to_message.photo;
        if (!imageIds){
            return next();
        }

        const mostQuality =  imageIds.reduce(
            (prev, current) => {
                return prev.file_size > current.file_size ? prev : current
            }
        )
        const fileMeta = await fetch(`https://api.telegram.org/bot${ctx.telegram.token}/getFile?file_id=${mostQuality.file_id}`)
            .then(result => result.json());
        const binary = await fetch(`https://api.telegram.org/file/bot${ctx.telegram.token}/${fileMeta.result.file_path}`)
            .then( result => result.buffer());

        const result = await fetch(`${config.imageManipulationServiceUrl}/image/distort`, {
            method: 'POST',
            body: JSON.stringify({ imageAsBase64: binary.toString('base64')}),
            headers: { 'Content-Type': 'application/json' }
        }).then( res => res.json())
        if (!result.distortImageAsBase64){
            return next();
        }
        const imgbase = Buffer.from(result.distortImageAsBase64, 'base64');
        ctx.replyWithPhoto({ source: imgbase }, { reply_to_message_id: ctx.message.message_id })
    });
};