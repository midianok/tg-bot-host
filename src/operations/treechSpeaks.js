const { markdownv2: format } = require('telegram-format');
const fetch = require('node-fetch');
const operationName = "treech-text"
module.exports.TREECH_TEXT = operationName;

module.exports.sendTreechText = (bot, operation) => {
    bot.on('inline_query', async (ctx) => {
        const responce = [];
        const treechGeneralResp = await fetch(' http://markov/treech-general');
        const treechGeneral = await treechGeneralResp.json();
        treechGeneral.title = "Высер тричера"
        responce.push(treechGeneral)

        const treechItanResp = await fetch(' http://markov/treech-itan');
        const treechItan = await treechItanResp.json();
        treechItan.title = "Высер итана"
        responce.push(treechItan)

        const replies = responce.map((x, index) =>{
            return {
                type: 'article',
                id: index,
                title: x.title,
                message_text: x.message
            }
        });

        ctx.answerInlineQuery(replies, {cache_time: 5});
    })
}
