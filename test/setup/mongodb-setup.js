const { MongoDBContainer } = require("testcontainers");
const mongoose = require("mongoose");

const mongoDbStart = async () => {
    const mongoDb = await new MongoDBContainer("mongo:6.0.4").start();
    return mongoDb;
};

const getMongoDbClient = () => {
    return null;
};

module.exports = { mongoDbStart, getMongoDbClient };
