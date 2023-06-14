const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
    try {
        const token = req.get("Authorization")?.split(" ")[1];
        if (!token) {
            const error = new Error("Not authenticated.");
            error.statusCode = 401;
            throw error;
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if (!decodedToken) {
            const error = new Error("Not authenticated.");
            error.statusCode = 401;
            throw error;
        }
        req.mongoose_id = decodedToken.mongoose_id;
        req.user_id = decodedToken.id;
        next();
    } catch (err) {
        next(err);
    }
};
