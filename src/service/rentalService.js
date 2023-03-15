const { Rental } = require("../model/rental");
const { Movie } = require("../model/movie");
const { Customer } = require("../model/customer");
const { ApiError } = require("../error/apiError");
const mongoose = require("mongoose");

async function getAllRentals() {
    const rental = await Rental.find().sort("-dateOut");
    return rental.map((g) => g.toApiRes());
}

async function getRentalById(id) {
    const rental = await Rental.findById(id);
    if (!rental) throw new ApiError(`Rental with id: ${id} was not found`, 404);

    return rental.toApiRes();
}

async function createRental({ customerId, movieId }) {
    const isValidCustomerId = mongoose.isValidObjectId(customerId);
    if (!isValidCustomerId) throw new ApiError(`Invalid customerId: ${customerId}`, 400);
    const customer = await Customer.findById(customerId);
    if (!customer) throw new ApiError(`Customer ${customerId} not found`, 404);

    const isValidMovieId = mongoose.isValidObjectId(movieId);
    if (!isValidMovieId) throw new ApiError(`Invalid movieId: ${movieId}`, 400);
    const movie = await Movie.findById(movieId);
    if (!movie) throw new ApiError(`Movie ${movieId} not found`, 404);

    if (movie.numberInStock === 0) throw new ApiError(`Movie not in stock`, 400);

    const rentalOut = await Rental.lookup(customerId, movieId);
    if (rentalOut) throw new ApiError(`Rental ${rentalOut._id} already out`, 400);

    const rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            isGold: customer.isGold,
            phone: customer.phone,
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate,
        },
        dateOut: Date.now(),
        status: "OUT",
    });

    // const session = await mongoose.startSession();
    // try {
    //     session.startTransaction();

    //     await rental.save({ session });
    //     movie.numberInStock--;
    //     await movie.save({ session });

    //     await session.commitTransaction();
    // } catch (err) {
    //     logger.error(err);
    //     await session.abortTransaction();
    // } finally {
    //     session.endSession();
    // }

    await rental.save();
    movie.numberInStock--;
    await movie.save();

    return rental._id;
}

module.exports = {
    createRental: createRental,
    getRentalById: getRentalById,
    getAllRentals: getAllRentals,
};
