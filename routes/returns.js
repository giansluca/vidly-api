const { Rental } = require("../models/rental");
const { Movie } = require("../models/movie");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const express = require("express");
const router = express.Router();

router.post("/", [auth, validate(validateReturn)], async (req, res) => {
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  if (!rental) return res.status(404).send("Rental not found.");

  if (rental.dateReturned) return res.status(400).send("Return already processed.");

  rental.return();

  // Transactions work so far only on mongo replica set
  /*
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await rental.save({ session });
    await Movie.update({ _id: rental.movie._id }, { $inc: {numberInStock: 1} }, { session });
    
    await session.commitTransaction();
    
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
  */

  await rental.save();

  await Movie.updateOne({ _id: rental.movie._id }, { $inc: { numberInStock: 1 } });

  return res.send(rental);
});

function validateReturn(req) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });

  return schema.validate(req);
}

module.exports = router;
