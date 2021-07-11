module.exports.probability = n => {
    return !!n && Math.random() <= n * 0.01;
};