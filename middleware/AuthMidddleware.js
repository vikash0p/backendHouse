import jwt from 'jsonwebtoken';
export const AuthMiddleware = async (req, res, next) => {
    try {
        console.log("Authorization Header:", req.headers['authorization']); // Log authorization header
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Unauthorized - Missing or incorrect format" });
        }
        const token = authHeader.split(' ')[1]; // Extract token part
        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error); // Log verification errors
        res.status(401).json({ message: "Unauthorized - Token verification failed" });
    }
};
