const request = require("supertest");
const mongoose = require("mongoose");
const { Customer } = require("../../src/models/customer");
const { User } = require("../../src/models/user");

let server;
let insertedCustomer;
let jwtToken;

beforeAll(async () => {
    server = await require("../../index");
    jwtToken = new User({ name: "name", email: "email", password: "password", isAdmin: true }).generateAuthToken();
});

afterAll(async () => {
    await mongoose.disconnect();
    await server.close();
});

describe("/api/customers", () => {
    beforeEach(async () => {
        insertedCustomer = await setUpInitData();
    });

    afterEach(async () => {
        await clearData();
    });

    describe("GET /", () => {
        it("should return all the customers", async () => {
            // Given - When
            const res = await request(server).get("/api/customers").set("Authorization", jwtToken);

            // Then
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(4);
            expect(
                res.body.some((c) => c.name === "Pablo Bomb" && c.phone === "123456" && c.isGold === true)
            ).toBeTruthy();
            expect(res.body.some((c) => c.name === "Zio Tom" && c.isGold === false)).toBeTruthy();
        });
    });

    describe("GET /:id", () => {
        it("should get customer by id", async () => {
            // Given
            const customerId1 = insertedCustomer["0"]._id.toString();

            // When
            const res = await request(server).get(`/api/customers/${customerId1}`).set("Authorization", jwtToken);

            // Then
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("id", customerId1);
            expect(res.body).toHaveProperty("name", "Pablo Bomb");
            expect(res.body).toHaveProperty("phone", "123456");
            expect(res.body).toHaveProperty("isGold", true);
        });
        it("should return 404 if no customer with the given id exists", async () => {
            // Given
            const randomId = new mongoose.Types.ObjectId().toString();

            // When
            const res = await request(server).get(`/api/customers/${randomId}`).set("Authorization", jwtToken);

            // Then
            expect(res.status).toBe(404);
            expect(res.text).toBe(`Customer with id: ${randomId} was not found`);
        });
    });

    describe("POST /:id", () => {
        it("should save new customer", async () => {
            // Given
            const newCustomer = {
                name: "Pablo the painter",
                phone: "0000099",
                isGold: true,
            };

            //When
            const resPost = await request(server)
                .post("/api/customers")
                .set("Authorization", jwtToken)
                .send(newCustomer);
            const idCreated = resPost.body;

            const resGet = await request(server).get(`/api/customers/${idCreated}`).set("Authorization", jwtToken);

            // Then
            expect(resPost.status).toBe(201);
            expect(resGet.status).toBe(200);
            expect(resGet.body).toHaveProperty("name", "Pablo the painter");
            expect(resGet.body).toHaveProperty("phone", "0000099");
            expect(resGet.body).toHaveProperty("isGold", true);
        });
        it("should return 400 if mandatory 'phone' parameter is missing", async () => {
            // Given
            const newCustomer = {
                name: "Pablo the painter",
                isGold: true,
            };

            //When
            const resPost = await request(server)
                .post("/api/customers")
                .set("Authorization", jwtToken)
                .send(newCustomer);

            // Then
            expect(resPost.status).toBe(400);
        });
    });

    describe("PUT /:id", () => {
        it("should update customer by id", async () => {
            // Given
            const customerId1 = insertedCustomer["0"]._id.toString();

            // When
            const resPut = await request(server)
                .put(`/api/customers/${customerId1}`)
                .set("Authorization", jwtToken)
                .send({ phone: "999000" });

            const resGet = await request(server).get(`/api/customers/${customerId1}`).set("Authorization", jwtToken);

            // Then
            expect(resPut.status).toBe(200);
            expect(resPut.body).toHaveProperty("name", "Pablo Bomb");
            expect(resPut.body).toHaveProperty("phone", "999000");
            expect(resPut.body).toHaveProperty("isGold", true);

            expect(resGet.status).toBe(200);
            expect(resGet.body).toHaveProperty("name", "Pablo Bomb");
            expect(resGet.body).toHaveProperty("phone", "999000");
            expect(resGet.body).toHaveProperty("isGold", true);
        });
        it("should return 404 if no customer with the given id exists", async () => {
            // Given
            const randomId = new mongoose.Types.ObjectId().toString();

            // When
            const res = await request(server)
                .put(`/api/customers/${randomId}`)
                .set("Authorization", jwtToken)
                .send({ phone: "999000" });

            // Then
            expect(res.status).toBe(404);
            expect(res.text).toBe(`Customer with id: ${randomId} was not found`);
        });
        it("should return 400 if 'phone' parameter has less than six characters", async () => {
            // Given
            const customerId1 = insertedCustomer["0"]._id.toString();

            // When
            const res = await request(server)
                .put(`/api/customers/${customerId1}`)
                .set("Authorization", jwtToken)
                .send({ phone: "1A" });

            // Then
            expect(res.status).toBe(400);
        });
    });

    describe("DELETE /:id", () => {
        it("should delete customer by id", async () => {
            // Given
            const customerId1 = insertedCustomer["0"]._id.toString();

            // When
            const resDelete = await request(server)
                .delete(`/api/customers/${customerId1}`)
                .set("Authorization", jwtToken);

            const resGetAll = await request(server).get("/api/customers").set("Authorization", jwtToken);
            const resGetOne = await request(server).get(`/api/customers/${customerId1}`).set("Authorization", jwtToken);

            // Then
            expect(resDelete.status).toBe(200);
            expect(resGetAll.body.length).toBe(3);
            expect(resGetOne.status).toBe(404);
        });
        it("should return 404 if no customer with the given id exists", async () => {
            // Given
            const randomId = new mongoose.Types.ObjectId().toString();

            // When
            const res = await request(server).delete(`/api/customers/${randomId}`).set("Authorization", jwtToken);

            // Then
            expect(res.status).toBe(404);
            expect(res.text).toBe(`Customer with id: ${randomId} was not found`);
        });
    });
});

const setUpInitData = async () => {
    const customers = [
        new Customer({ name: "Pablo Bomb", phone: "123456", isGold: true }),
        new Customer({ name: "Zio Tom", phone: "098765", isGold: false }),
        new Customer({ name: "Peter Zum", phone: "000001", isGold: false }),
        new Customer({ name: "Tom The Hero", phone: "112301", isGold: true }),
    ];

    return await Customer.insertMany(customers);
};

const clearData = async () => {
    await Customer.deleteMany({});
};
