const { Rental } = require("../../src/model/rental");
const { User } = require("../../src/model/user");
const { Movie } = require("../../src/model/movie");
const moment = require("moment");
const mongoose = require("mongoose");
const request = require("supertest");

let server;

beforeAll(async () => {
    server = await require("../../index");
});

afterAll(async () => {
    await mongoose.disconnect();
    await server.close();
});

describe("/api/returns", () => {
    let customerId;
    let movieId;
    let rentalId;
    let rental;
    let movie;
    let jwtToken;

    const exec = async () => {
        return request(server).post("/api/returns").set("Authorization", jwtToken).send({ rentalId: rentalId });
    };

    beforeEach(async () => {
        customerId = new mongoose.Types.ObjectId().toString();
        movieId = new mongoose.Types.ObjectId().toString();
        jwtToken = new User({ name: "name", email: "email", password: "password", isAdmin: true }).generateAuthToken();

        movie = new Movie({
            _id: movieId,
            title: "Rambo the king",
            dailyRentalRate: 2,
            genre: { name: "adventure" },
            numberInStock: 10,
        });
        await movie.save();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: "Tobias",
                isGold: true,
                phone: "1234567",
            },
            movie: {
                _id: movieId,
                title: "Rambo the king",
                dailyRentalRate: 2,
            },
            dateOut: Date.now(),
            status: "OUT",
        });

        rentalId = rental._id;
        await rental.save();
    });

    afterEach(async () => {
        await Rental.deleteMany({});
        await Movie.deleteMany({});
    });

    it("should return 400 if rentalId is not provided", async () => {
        // Given
        rentalId = "";

        // When
        const res = await exec();

        // Then
        expect(res.status).toBe(400);
    });

    it("should return 404 if no rental found for rentalId", async () => {
        // Given
        await Rental.deleteMany({});

        // When
        const res = await exec();

        // Then
        expect(res.status).toBe(404);
    });

    it("should return 400 if return is already processed", async () => {
        // Given
        rental.dateReturned = new Date();
        rental.status = "RETURNED";
        await rental.save();

        // When
        const res = await exec();

        // Then
        expect(res.status).toBe(400);
    });

    it("should set returnDate and rentalFee if input is valid", async () => {
        // Given
        rental.dateOut = moment().add(-7, "days").toDate();
        await rental.save();

        // When
        await exec();

        // Then
        const rentalInDb = await Rental.findById(rental._id);
        expect(rentalInDb.rentalFee).toBe(14);
    });

    it("should increase the movie stock if input is valid", async () => {
        // Given - When
        await exec();
        const movieInDb = await Movie.findById(movieId);

        // Then
        expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
    });

    it("should return rental if input is valid", async () => {
        // Given - When
        const res = await exec();

        // Then
        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining(["dateOut", "dateReturned", "rentalFee", "customer", "movie"])
        );
    });
});
