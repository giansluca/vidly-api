const { User } = require("../model/user");
const { ApiError } = require("../error/apiError");
const bcrypt = require("bcrypt");
const _ = require("lodash");

async function getUserById(id) {
    const user = await User.findById(id);
    if (!user) throw new ApiError(`User with id: ${id} was not found`, 400);

    return user;
}

async function createUser(bodyReq) {
    let user = await User.findOne({ email: bodyReq.email });
    if (user) throw new ApiError("User already registered", 400);

    user = new User(_.pick(bodyReq, ["name", "email", "password"]));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user.isAdmin = false;

    await user.save();
    return user;
}

async function doLogin(bodyReq) {
    let user = await User.findOne({ email: bodyReq.email });
    if (!user) throw new ApiError("Invalid email or password", 400);

    const validPassword = await bcrypt.compare(bodyReq.password, user.password);
    if (!validPassword) throw new ApiError("Invalid email or password", 400);

    const token = user.generateAuthToken();
    return token;
}

module.exports = {
    getUserById: getUserById,
    createUser: createUser,
    doLogin: doLogin,
};
