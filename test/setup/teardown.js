module.exports = async () => {
    if (global._mongoDb) {
        await global._mongoDb.stop();
        console.log("MongoDb stopped");
    }
};
