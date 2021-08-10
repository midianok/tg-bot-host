const { createApi } = require('unsplash-js');
const { config } = require('../config');
const fetch = require('node-fetch');

module.exports.RANDOM_CAT = "randomCat";

module.exports.randomCat = (bot) => {
    bot.command('cat', async (ctx) => {
        const unsplash = createApi({
            accessKey: config.unsplashAccessKey,
            fetch: fetch,
        });

        const catPhotoResult = await unsplash.photos.getRandom({ query: 'cat', count: 1 });
        const catPhotoLink = catPhotoResult?.response[0]?.urls?.regular;
        if (catPhotoLink) {
            await ctx.replyWithPhoto({ url: catPhotoLink }, {reply_to_message_id : ctx.message.message_id});
        }
    })
}