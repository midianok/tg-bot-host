const { markdownv2: format } = require('telegram-format');
const fetch = require('node-fetch');
const operationName = "treech-text"
module.exports.TREECH_TEXT = operationName;

module.exports.sendTreechText = (bot, operation) => {
    bot.on('inline_query', async (ctx) => {
        const responce = [];
        const treechGeneral = fetch('http://markov/treech-general')
            .then(result => result.text())
            .then(result => responce.push({ title : "Высер тричера", text: result}));

        const treechItanText = fetch('http://markov/treech-itan')
            .then(result => result.text())
            .then(result => responce.push({ title : "Высер тричера", text: result}));

        await Promise.all([treechGeneral, treechItanText]);

        const replies = responce.map((x, index) =>{
            return {
                type: 'article',
                id: index,
                title: x.title,
                message_text: x.text
            }
        });

        ctx.answerInlineQuery(replies, {cache_time: 0});
    })
}
