import jwt from "jsonwebtoken";

class AuthMiddleware {
    static authenticate(req, res, next) {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ error: "Authentication required." });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // Set user information in the request, including role
            next();
        } catch (error) {
            res.status(401).json({ error: "Invalid token." });
        }
    }

    static verifyRole(allowedRoles) {
        return (req, res, next) => {
            const userRole = req.user.role; // Assuming `req.user.role` is set after authentication

            if (allowedRoles.includes(userRole)) {
                next();
            } else {
                res.status(403).json({ error: "Access denied. Insufficient permissions." });
            }
        };
    }
}

export default AuthMiddleware;
