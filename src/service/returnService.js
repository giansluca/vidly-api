const { Rental } = require("../model/rental");
const { Movie } = require("../model/movie");
const { ApiError } = require("../error/apiError");
const mongoose = require("mongoose");

async function doReturn(rentalId) {
    const isValidRentalId = mongoose.isValidObjectId(rentalId);
    if (!isValidRentalId) throw new ApiError(`Invalid rentalId: ${rentalId}`, 400);
    const rental = await Rental.findById(rentalId);
    if (!rental) throw new ApiError(`Rental with id: ${rentalId} was not found`, 404);

    if (rental.status === "RETURNED") throw new ApiError("Return already processed", 400);

    rental.return();
    await rental.save();
    await Movie.updateOne({ _id: rental.movie._id }, { $inc: { numberInStock: 1 } });

    return rental.toApiRes();
}

module.exports = {
    doReturn: doReturn,
};
