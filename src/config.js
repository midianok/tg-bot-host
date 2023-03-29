require('dotenv').config();
module.exports.config = {
    connectionString: process.env.CONNECTION_STRING,
    collectionName: process.env.COLLECTION_NAME,
    unsplashAccessKey: process.env.UNSPLASH_ACCESS_KEY
}