const { markdownv2: format } = require('telegram-format');
const { RefillableStack } = require('../util/agroStack');
const fetch = require('node-fetch');
const operationName = "treech-text"
module.exports.TREECH_TEXT = operationName;
let agroStack;
let itanStack;
let treechStack;

module.exports.initStack = () => {
    const agroFillFunc = () => fetch('http://markov/agro')
        .then(result => result.text());
    agroStack = new RefillableStack(agroFillFunc, 50, "agro");
    agroStack.fill();

    const itanFillFunc = () => fetch('http://markov/treech-itan')
        .then(result => result.text());
    itanStack = new RefillableStack(itanFillFunc, 10, "itan");
    itanStack.fill();

    const treechFillFunc = () => fetch('http://markov/treech-general')
        .then(result => result.text());
    treechStack = new RefillableStack(treechFillFunc, 10, "treech");
    treechStack.fill();
};

module.exports.sendTreechText = (bot, operation) => {
    bot.on('inline_query', async (ctx) => {
        const responce = [];
        const itanText = itanStack.pop()
            .then(result => responce.push({ id:1, title : "Высер Итана", text: result, img: "https://i.imgur.com/CO35jw4.png"}));
        const treechText = treechStack.pop()
            .then(result => responce.push({ id:2, title : "Высер тричера", text: result, img: "https://i.imgur.com/9Cm0EQv.jpg"}));
        const agroText = agroStack.pop()
            .then(result => responce.push({ id:3, title : "Высер злобного девственника", text: result, img: "https://memepedia.ru/wp-content/uploads/2016/08/9df18f050741a1da79d70751018f8811.jpg"}));

        await Promise.all([itanText, treechText, agroText]);

        const replies = responce
            .map((x) => {
            return {
                type: 'article',
                id: x.id,
                title: x.title,
                message_text: x.text,
                thumb_url: x.img
            }
        }).sort((a, b) => a.id - b.id);

        ctx.answerInlineQuery(replies, {cache_time: 0});
    })
}
