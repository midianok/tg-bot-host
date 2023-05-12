require('dotenv').config();
module.exports.config = {
    connectionString: process.env.CONNECTION_STRING,
    configurationsCollectionName: process.env.CONFIGURATIONS_COLLECTION_NAME,
    unsplashAccessKey: process.env.UNSPLASH_ACCESS_KEY,
    markovServiceUrl: process.env.MARKOV_SERVICE_URL,
    imageManipulationServiceUrl: process.env.IMAGE_MANIPULATION_SERVICE_URL
};