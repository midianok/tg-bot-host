const { markdownv2: format } = require('telegram-format');
const fetch = require('node-fetch');
const operationName = "treech-text"
module.exports.TREECH_TEXT = operationName;

module.exports.sendTreechText = (bot, operation) => {
    bot.on('inline_query', async (ctx) => {
        const responce = [];
        const treechGeneralResp = await fetch(' http://localhost:8081/treech-general/1');
        const treechGeneral = await treechGeneralResp.json();
        treechGeneral[0].title = "Высер тричера"
        responce.push(treechGeneral[0])

        const treechItanResp = await fetch(' http://localhost:8081/treech-itan/1');
        const treechItan = await treechItanResp.json();
        treechItan[0].title = "Высер итана"
        treechItan[0].id = "2"
        responce.push(treechItan[0])

        const replies = responce.map(x =>{
            return {
                type: 'article',
                id: x.id,
                title: x.title,
                message_text: x.message
            }
        });

        ctx.answerInlineQuery(replies, {cache_time: 5});
    })
}
