const fastq = require('fastq');
const fetch = require('node-fetch');
const agroStack = [];
const maxAgros = 1;

const fillStack = async () => {
    do {
        await fetch('http://127.0.0.1:5000/agro')
            .then(result => {
                agroStack.push(result.text())
                console.log(`Pushed. Total agros ${agroStack.length}`);
            });
    } while (agroStack.length <= maxAgros)
}
const queue = fastq.promise(fillStack, 1)

module.exports.getAgro = () => {
    const agro = agroStack.pop();
    queue.push(fillStack);
    return agro;
}

module.exports.fillAgro = () => queue.push(fillStack);