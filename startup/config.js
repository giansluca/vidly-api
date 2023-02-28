const ENV = process.env.ENV || "dev";
if (ENV !== "prod") {
    require("dotenv").config();
}
const pkg = require("../package");

const config = {
    env: process.env.ENV || "local",
    app: {
        name: process.env.APP_NAME || "Vidly-api",
        version: pkg.version,
        commit: process.env.APP_COMMIT,
    },
    http: {
        PORT: process.env.PORT || 8080,
    },
    db: {
        mongoUrl: process.env.MONGO_URL,
    },
    jwt: {
        privateKey: process.env.JWT_PRIVATE_KEY,
    },
};

module.exports = config;
