const genresRouter = require("../routes/genres");
const moviesRouter = require("../routes/movies");
const customersRouter = require("../routes/customers");
const rentalsRouter = require("../routes/rentals");
const usersRouter = require("../routes/users");
const returnsRouter = require("../routes/returns");

module.exports = function (app) {
    app.use("/api/genres", genresRouter);
    app.use("/api/customers", customersRouter);
    app.use("/api/movies", moviesRouter);
    app.use("/api/rentals", rentalsRouter);
    app.use("/api/users", usersRouter);
    app.use("/api/returns", returnsRouter);
};
