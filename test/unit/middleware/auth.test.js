const { User } = require("../../../src/models/user");
const auth = require("../../../src/middleware/auth");
const mongoose = require("mongoose");

describe("auth", () => {
    it("should populate req.user with the payload of a valid JWT", () => {
        // Given
        const user = {
            _id: new mongoose.Types.ObjectId().toString(),
            isAdmin: true,
        };
        const bearerToken = new User(user).generateAuthToken();

        const req = {
            header: jest.fn().mockReturnValue(bearerToken),
        };

        const res = {};
        const next = jest.fn();

        // When
        auth(req, res, next);

        // Then
        expect(req.user).toMatchObject(user);
    });
});
