module.exports.TIKTOK = "tiktok";
const TikTokScraper = require('tiktok-scraper');

const { nonDeletingRateLimiter, downloadBuffer } = require("../util/utils");


module.exports.tiktok = (bot, operation) => {
    bot.hears((text, ctx) => {
            if (ctx.message.entities) {
                for (const entity of ctx.message.entities.filter((x) => x.type === "text_link")) {
                    if (
                        entity.url.startsWith("https://www.tiktok.com/") &&
                        entity.url.indexOf("video") > 0
                    ) {
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

function makeCaption(videoMeta) {
    const description = videoMeta.text;
    const authorUsername = `@${videoMeta.authorMeta.name}`;
    const authorLink = `<a href="https://www.tiktok.com/${authorUsername}">${authorUsername}</a>`
    return `${authorLink}\n\n${description}`;
}

const handleTiktokPost = async (ctx, next) => {
    const videoMeta = await TikTokScraper.getVideoMeta(ctx.url);
    const videoUrl = videoMeta.collector[0].videoUrl;
    const collector = videoMeta.collector[0];

    if (videoUrl) {
        const caption = makeCaption(collector);

        ctx.replyWithVideo(videoUrl, { caption: caption, reply_to_message_id: ctx.message.message_id, parse_mode: 'HTML' })
            .catch(async (err) => {
                const buffer = await downloadBuffer(videoUrl, videoMeta.headers);
                if (buffer.byteLength > 10) {
                    await ctx.replyWithVideo({ source: buffer }, { caption: caption, reply_to_message_id: ctx.message.message_id, parse_mode: 'HTML' });
                } else {
                    await ctx.replyWithMarkdown(`[Ссылка](${videoUrl})`, { reply_to_message_id: ctx.message.message_id, parse_mode: 'HTML' });
                }
            });
    }
};