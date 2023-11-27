const { MongoDBContainer } = require("@testcontainers/mongodb");
//const mongoose = require("mongoose");

const mongoDbStart = async () => {
    const mongoDb = await new MongoDBContainer("mongo:6.0.4").start();
    return mongoDb;
};

module.exports = { mongoDbStart };
