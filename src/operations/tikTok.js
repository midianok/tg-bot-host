module.exports.TIKTOK = "tiktok";
const TikTokScraper = require('@pterko/tiktok-scraper');
const { nonDeletingRateLimiter, downloadBuffer } = require("../util/utils");
const { logger } = require("../logger");


module.exports.tiktok = (bot) => {
    bot.hears((text, ctx) => {
            if (ctx.message.entities) {
                for (const entity of ctx.message.entities.filter((x) => x.type === "text_link")) {
                    if (entity.url.startsWith("https://www.tiktok.com/") && entity.url.indexOf("video") > 0) {
                        ctx.url = entity.url;
                        return true;
                    }

                    if (entity.url.startsWith("https://vm.tiktok.com/")) {
                        ctx.url = entity.url;
                        return true;
                    }
                }
                for (const entity of ctx.message.entities.filter((x) => x.type === "url")) {
                    const url = ctx.message.text.substring(entity.offset, entity.length + entity.offset);
                    if (url.startsWith("https://www.tiktok.com/") && url.indexOf("video") > 0) {
                        ctx.url = url;
                        return true;
                    }

                    if (url.startsWith("https://vm.tiktok.com/")) {
                        ctx.url = url;
                        return true;
                    }
                }
            }
            return false;
        },
        nonDeletingRateLimiter,
        handleTiktokPost
    );
}

const makeCaption = videoMeta => {
    const description = videoMeta.text;
    const authorUsername = `@${videoMeta.authorMeta.name}`;
    const authorLink = `<a href="https://www.tiktok.com/${authorUsername}">${authorUsername}</a>`
    return `${authorLink}\n\n${description}`;
}

const handleTiktokPost = async (ctx, next) => {
    const logMeta = {
        botName: ctx.botInfo.username,
        operation: module.exports.TIKTOK,
        chatName: ctx.update.message.chat.username,
        fromUserName: ctx.update.message.from.username,
        fromFirstName: ctx.update.message.from.first_name,
        updateId: ctx.update.update_id
    };
    logger.info('tiktok link detected', {...logMeta, tiktokUrl: ctx.url})

    let videoMeta;
    try {
        videoMeta = await TikTokScraper.getVideoMeta(ctx.url);
    } catch (err) {
        logger.info("cannot get tiktok video metadata", {...logMeta, err});
        return;
    }

    const videoUrl = videoMeta.collector[0].videoUrl;
    const collector = videoMeta.collector[0];
    logger.info('tiktok video meta obtained', {...logMeta, videoMeta: videoMeta.collector[0]})

    if (!videoUrl) {
        logger.info('tiktok videoUrl is empty', logMeta);
        return;
    }

    const caption = makeCaption(collector);

    ctx.replyWithVideo(videoUrl, { caption: caption, reply_to_message_id: ctx.message.message_id, parse_mode: 'HTML' })
        .catch(async (err) => {
            const buffer = await downloadBuffer(videoUrl, videoMeta.headers);
            logger.info('tiktok video videoUrl send fail, trying to send as buffer', logMeta);
            if (buffer.byteLength > 10) {
                await ctx.replyWithVideo({ source: buffer }, { caption: caption, reply_to_message_id: ctx.message.message_id, parse_mode: 'HTML' });
                logger.info('tiktok video sent as buffer', logMeta);
            } else {
                await ctx.replyWithMarkdown(`[Ссылка](${videoUrl})`, { reply_to_message_id: ctx.message.message_id, parse_mode: 'HTML' });
                logger.info('tiktok video send failed', logMeta);
            }
        })
        .then(() => logger.info('tiktok video send complete', { ...logMeta, videoUrl, caption }));



};
