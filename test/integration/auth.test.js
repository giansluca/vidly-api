const request = require("supertest");
const mongoose = require("mongoose");
const { Genre } = require("../../src/model/genre");
const { User } = require("../../src/model/user");

let server;

beforeAll(async () => {
    server = await require("../../index");
});

afterAll(async () => {
    await Genre.deleteMany({});
    await mongoose.disconnect();
    await server.close();
});

describe("auth middleware", () => {
    it("should return 401 if no token is provided", async () => {
        // Given - When
        const res = await request(server).post("/api/genres").send({ name: "new-genre" });

        // Then
        expect(res.status).toBe(401);
    });

    it("should return 400 if token is invalid", async () => {
        // Given
        const jwtToken = "A";

        // When
        const res = await request(server)
            .post("/api/genres")
            .set("Authorization", jwtToken)
            .send({ name: "new-genre" });

        // Then
        expect(res.status).toBe(400);
    });

    it("should return 201 if token is valid", async () => {
        // Given
        const jwtToken = new User({
            name: "name",
            email: "email",
            password: "password",
            isAdmin: true,
        }).generateAuthToken();

        // When
        const res = await request(server)
            .post("/api/genres")
            .set("Authorization", jwtToken)
            .send({ name: "new-genre" });

        // Then
        expect(res.status).toBe(201);
    });
});
