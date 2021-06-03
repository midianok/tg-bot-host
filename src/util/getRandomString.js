module.exports.getRandomElement = array => {
    if (array){
        const randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
    }
    return array
}
