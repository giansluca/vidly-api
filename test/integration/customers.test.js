const request = require("supertest");
const mongoose = require("mongoose");
const { Customer } = require("../../src/models/customer");
const { User } = require("../../src/models/user");

let server;

beforeAll(async () => {
    server = await require("../../index");
    await setUpInitData();

    console.log(new User().generateAuthToken());
});

afterAll(async () => {
    await clearData();
    await mongoose.disconnect();
    await server.close();
});

describe("/api/customers", () => {
    describe("GET /", () => {
        it("should return all the customers", async () => {
            const res = await request(server).get("/api/customers");
            expect(res.status).toBe(200);

            expect(res.body.length).toBe(4);
            expect(
                res.body.some((c) => c.name === "Pablo Bomb" && c.phone === "12345" && c.isGold === true)
            ).toBeTruthy();
            expect(res.body.some((c) => c.name === "Zio Tom" && c.isGold === false)).toBeTruthy();
        });
    });
});

const setUpInitData = async () => {
    await Customer.collection.insertMany([
        { name: "Pablo Bomb", phone: "12345", isGold: true },
        { name: "Zio Tom", phone: "098765" },
        { name: "Peter Zum", phone: "000001" },
        { name: "Tom The Hero", phone: "112301", isGold: true },
    ]);
};

const clearData = async () => {
    await Customer.deleteMany({});
};
