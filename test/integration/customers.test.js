const request = require("supertest");
//const mongoose = require("mongoose");
const { Customer } = require("../../src/models/customer");

describe("/api/customers", () => {
    let server;

    beforeEach(async () => {
        require("../../src/startup/db")();
        //server = await require("../../index");
    });

    afterEach(async () => {
        //await server.close();
    });

    it("should return all the customers", async () => {
        const config = require("../../src/startup/config");
        const dbUrl = config.db.mongoUrl;
        //console.log(`mongoUrl: ${dbUrl}`);

        // const dbUrl = config.db.mongoUrl;
        // mongoose
        //     .connect(dbUrl, {
        //         //useNewUrlParser: true,
        //         //useUnifiedTopology: true,
        //     })
        //     .then(
        //         () => console.log(`Connected to -> ${dbUrl}`),
        //         (err) => console.log("Error connecting to database")
        //     );
    });

    // describe("GET /", () => {
    //     it("should return all the customers", async () => {
    //         await Customer.collection.insertMany([
    //             { name: "Pablo Bomb", phone: "12345", isGold: true },
    //             { name: "Zio Tom", phone: "098765" },
    //         ]);

    //         const res = await request(server).get("/api/customers");
    //         expect(res.status).toBe(200);

    //         expect(res.body.length).toBe(2);
    //         expect(res.body.some((c) => c.name === "Pablo Bomb")).toBeTruthy();
    //         expect(res.body.some((c) => c.name === "Zio Tom")).toBeTruthy();
    //     });
    // });

    const sleep = (ms) => {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    };
});
