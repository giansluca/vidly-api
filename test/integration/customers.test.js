const request = require("supertest");
const mongoose = require("mongoose");
const { Customer } = require("../../src/models/customer");
const { User } = require("../../src/models/user");

let server;
let insertedIds;

beforeAll(async () => {
    server = await require("../../index");
    insertedIds = await setUpInitData();

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
            // Given - When
            const res = await request(server).get("/api/customers");

            // Then
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(4);
            expect(
                res.body.some((c) => c.name === "Pablo Bomb" && c.phone === "12345" && c.isGold === true)
            ).toBeTruthy();
            expect(res.body.some((c) => c.name === "Zio Tom" && c.isGold === false)).toBeTruthy();
        });
    });

    describe("GET /:id", () => {
        it("should get customer by id", async () => {
            // Given
            const customerId1 = insertedIds["0"].toString();

            // When
            const res = await request(server).get(`/api/customers/${customerId1}`);

            // Then
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("id", customerId1);
            expect(res.body).toHaveProperty("name", "Pablo Bomb");
            expect(res.body).toHaveProperty("phone", "12345");
            expect(res.body).toHaveProperty("isGold", true);
        });
        it("should return 404 if no customer with the given id exists", async () => {
            // Given
            const randomId = new mongoose.Types.ObjectId().toString();

            // When
            const res = await request(server).get(`/api/customers/${randomId}`);

            // Then
            expect(res.status).toBe(404);
            expect(res.text).toBe(`Customer with id: ${randomId} was not found`);
        });
    });
});

const setUpInitData = async () => {
    const result = await Customer.collection.insertMany([
        { name: "Pablo Bomb", phone: "12345", isGold: true },
        { name: "Zio Tom", phone: "098765" },
        { name: "Peter Zum", phone: "000001" },
        { name: "Tom The Hero", phone: "112301", isGold: true },
    ]);

    return result.insertedIds;
};

const clearData = async () => {
    await Customer.deleteMany({});
};
