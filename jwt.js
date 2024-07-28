const jwt = require("jsonwebtoken");

const jwtauthmiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: "unauthorized" });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: "unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ error: "invalid token" });
    }
};

const generatetoken = (userdata) => {
    return jwt.sign(userdata, process.env.JWT_SECRET, { expiresIn: '5m' });
};

module.exports = { jwtauthmiddleware, generatetoken };
