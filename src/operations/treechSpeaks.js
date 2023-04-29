const { markdownv2: format } = require('telegram-format');
const fetch = require('node-fetch');
const operationName = "treech-text"
module.exports.TREECH_TEXT = operationName;

module.exports.sendTreechText = (bot, operation) => {
    bot.on('inline_query', async (ctx) => {
        const responce = [];
        const treechGeneral = fetch('http://markov/treech-general')
            .then(result => result.text())
            .then(result => responce.push({ title : "Высер тричера", text: result, img: "https://i.imgur.com/9Cm0EQv.jpg"}));

        const treechItanText = fetch('http://markov/treech-itan')
            .then(result => result.text())
            .then(result => responce.push({ title : "Высер Итана", text: result, img: "https://i.imgur.com/CO35jw4.png"}));

        await Promise.all([treechGeneral, treechItanText]);

        const replies = responce
            .map((x, index) => {
            return {
                type: 'article',
                id: index,
                title: x.title,
                message_text: x.text,
                thumb_url: x.img
            }
        }).sort((a, b) => a.id - b.id);

        ctx.answerInlineQuery(replies, {cache_time: 0});
    })
}
