const request = require("supertest");
const mongoose = require("mongoose");
const { Customer } = require("../../src/models/customer");

describe("/api/customers", () => {
    let server;

    beforeAll(async () => {
        server = await require("../../index");
    });

    afterAll(async () => {
        await server.close();
        await mongoose.disconnect();
    });

    describe("GET /", () => {
        it("should return all the customers", async () => {
            await Customer.collection.insertMany([
                { name: "Pablo Bomb", phone: "12345", isGold: true },
                { name: "Zio Tom", phone: "098765" },
            ]);

            const res = await request(server).get("/api/customers");
            expect(res.status).toBe(200);

            expect(res.body.length).toBe(2);
            expect(res.body.some((c) => c.name === "Pablo Bomb")).toBeTruthy();
            expect(res.body.some((c) => c.name === "Zio Tom")).toBeTruthy();
        });
    });
});
