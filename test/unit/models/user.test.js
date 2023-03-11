const config = require("../../../src/startup/config");
const { User } = require("../../../src/models/user");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

describe("user", () => {
    it("should return a valid JWT", () => {
        // Given
        const payload = {
            _id: new mongoose.Types.ObjectId().toHexString(),
            isAdmin: true,
        };

        const user = new User(payload);

        // When
        const bearerToken = user.generateAuthToken();
        const token = bearerToken.replace("Bearer ", "");

        const decoded = jwt.verify(token, config.jwt.privateKey);

        // Then
        expect(decoded).toMatchObject(payload);
    });
});
