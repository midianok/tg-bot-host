const { runApp } = require('./src/telegram');
const config = {
    connectionString: process.env.CONNECTION_STRING,
    dbName: process.env.DB_NAME,
    collectionName: process.env.COLLECTION_NAME
}
runApp(config)