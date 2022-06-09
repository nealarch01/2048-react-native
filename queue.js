export default class Queue {
    #items;
    constructor() {
        this.#items = []; // initialize empty array
    }

    top() { // peek
        if(this.#items.length === 0) throw 'Error: Empty Queue';
        return this.#items[0];
    }
    
    push(item) {
        this.#items.push(item);
    }

    pop() {
        if(this.#items.length === 0) throw 'Error: Empty Queue';
        this.#items.shift(); // shift one to the left
    }

    isEmpty() {
        if(this.#items.length === 0) return true;
        return false; 
    }
};
