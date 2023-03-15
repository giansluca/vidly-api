const { Movie } = require("../model/movie");
const { Genre } = require("../model/genre");
const { ApiError } = require("../error/apiError");
const mongoose = require("mongoose");

async function getAllMovies() {
    const movies = await Movie.find().sort("name");
    return movies.map((m) => m.toApiRes());
}

async function getMovieById(id) {
    const movie = await Movie.findById(id);
    if (!movie) throw new ApiError(`Movie with id: ${id} was not found`, 404);

    return movie.toApiRes();
}

async function addNewMovie(bodyReq) {
    const genreId = bodyReq.genreId;
    const isValidGenreId = mongoose.isValidObjectId(genreId);
    if (!isValidGenreId) throw new ApiError(`Invalid genreId: ${genreId}`, 400);

    const genre = await Genre.findById(genreId);
    if (!genre) throw new ApiError(`Genre ${genreId} not found`, 404);

    const movie = new Movie({
        title: bodyReq.title,
        genre: genre.toApiReq(),
        numberInStock: bodyReq.numberInStock,
        dailyRentalRate: bodyReq.dailyRentalRate,
    });

    await movie.save();
    return movie._id;
}

async function updateMovie(id, bodyReq) {
    let genre;
    const genreId = bodyReq.genreId;
    if (genreId) {
        const isValidGenreId = mongoose.isValidObjectId(genreId);
        if (!isValidGenreId) throw new ApiError(`Invalid genreId: ${genreId}`, 400);

        genre = await Genre.findById(bodyReq.genreId);
        if (!genre) throw new ApiError(`Genre with id ${genreId} not found`, 404);
    }

    const movie = await Movie.findByIdAndUpdate(
        id,
        {
            title: bodyReq.title,
            genre: genre != undefined ? genre.toApiReq() : genre,
            numberInStock: bodyReq.numberInStock,
            dailyRentalRate: bodyReq.dailyRentalRate,
        },
        { new: true }
    );
    if (!movie) throw new ApiError(`Movie with id: ${id} was not found`, 404);

    return movie.toApiRes();
}

async function deleteMovie(id) {
    const movie = await Movie.findByIdAndRemove(id);
    if (!movie) throw new ApiError(`Movie with id: ${id} was not found`, 404);
}

module.exports = {
    getAllMovies: getAllMovies,
    getMovieById: getMovieById,
    addNewMovie: addNewMovie,
    updateMovie: updateMovie,
    deleteMovie: deleteMovie,
};
