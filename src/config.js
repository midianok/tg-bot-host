require('dotenv').config();
module.exports.config = {
    connectionString: process.env.CONNECTION_STRING,
    configurationsCollectionName: process.env.CONFIGURATIONS_COLLECTION_NAME,
    unsplashAccessKey: process.env.UNSPLASH_ACCESS_KEY
}
