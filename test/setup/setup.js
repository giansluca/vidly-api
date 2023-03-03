const { mongoDbStart } = require("./mongodb-setup");

module.exports = async () => {
    await startMongoDb();
};

const startMongoDb = async () => {
    const mongoDb = await mongoDbStart();

    process.env.MONGO_URL = `${mongoDb.getConnectionString()}/vidly-api?directConnection=true`;
    global._mongoDb = mongoDb;

    console.log("MongoDb started");
};
