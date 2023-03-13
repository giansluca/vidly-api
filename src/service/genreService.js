const { Genre } = require("../model/genre");
const { ApiError } = require("../error/apiError");

async function getAllGenres() {
    const genres = await Genre.find().sort("name");
    return genres.map((g) => g.toApiRes());
}

async function getGenreById(id) {
    const genre = await Genre.findById(id);
    if (!genre) throw new ApiError(`Genre with id: ${id} was not found`, 404);

    return genre.toApiRes();
}

async function addNewGenre(bodyReq) {
    const genre = new Genre({
        name: bodyReq.name,
    });

    await genre.save();
    return genre._id;
}

async function updateGenre(id, bodyReq) {
    const genre = await Genre.findByIdAndUpdate(id, { name: bodyReq.name }, { new: true });
    if (!genre) throw new ApiError(`Genre with id: ${id} was not found`, 404);

    return genre.toApiRes();
}

async function deleteGenre(id) {
    const genre = await Genre.findByIdAndRemove(id);
    if (!genre) throw new ApiError(`Genre with id: ${id} was not found`, 404);
}

module.exports = {
    getAllGenres: getAllGenres,
    getGenreById: getGenreById,
    addNewGenre: addNewGenre,
    updateGenre: updateGenre,
    deleteGenre: deleteGenre,
};
