const { init } = require('./src/init');
const config = {
    connectionString: process.env.CONNECTION_STRING,
    dbName: process.env.DB_NAME,
    collectionName: process.env.COLLECTION_NAME
}
init(config)