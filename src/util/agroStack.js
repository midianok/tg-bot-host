const fastq = require('fastq');

class RefillableStack {
    #fillFunc;
    #queue;
    #stack = [];
    #stackCapacity = 10;
    #queueName;

    constructor(fillFunc, stackCapacity, name) {
        this.#fillFunc = fillFunc;
        this.#queue = fastq.promise(this.fill, 1);
        this.#stackCapacity = stackCapacity;
        this.#queueName = name;
    }

    async pop() {
        let elem = this.#stack.pop();
        if (!elem){
            console.log(`${this.#queueName} Empty. Total agros ${this.#stack.length}`);
            elem = await this.#fillFunc();
        }
        if (this.#queue.length() === 0) {
            this.#queue.push(this.fill());
            console.log(`${this.#queueName} Enqueue. Total agros ${this.#stack.length}`);
        }
        console.log(`${this.#queueName} Poped. Total agros ${this.#stack.length}`);
        return elem;
    };

    async fill() {
        console.log(`${this.#queueName} Start fill. Total agros ${this.#stack.length}`);
        while (this.#stack.length < this.#stackCapacity){
            const result = await this.#fillFunc();
            this.#stack.push(result);
            console.log(`${this.#queueName} Pushed. Total agros ${this.#stack.length}`);
        }
    }
}
module.exports.RefillableStack = RefillableStack