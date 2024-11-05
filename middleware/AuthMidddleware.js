import jwt from "jsonwebtoken";
export const AuthMiddleware = async (req, res, next) => {
    try {
        // Log the cookies to check if they're being parsed
        console.log("🚀 ~ Cookies:", req.cookies.token t);

        const token = req.cookies.token; // Extract token from cookies
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - Token not found in cookies" });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        req.user = decoded; // Attach decoded token to request

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("JWT Verification Error:", error); // Log verification errors
        res.status(401).json({ message: "Unauthorized - Token verification failed" });
    }
};
