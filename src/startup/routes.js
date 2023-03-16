const genresRouter = require("../route/genres");
const moviesRouter = require("../route/movies");
const customersRouter = require("../route/customers");
const rentalsRouter = require("../route/rentals");
const usersRouter = require("../route/users");
const returnsRouter = require("../route/returns");

module.exports = function (app) {
    app.use("/api/users", usersRouter);
    app.use("/api/customers", customersRouter);
    app.use("/api/genres", genresRouter);
    app.use("/api/movies", moviesRouter);
    app.use("/api/rentals", rentalsRouter);
    app.use("/api/returns", returnsRouter);
};
