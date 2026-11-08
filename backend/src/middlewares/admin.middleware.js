const adminMiddleware = (req, res, next) => {
    if (!req.user || req.user.role !== "ADMIN") {
        return res.status(403).json({
            code: "FORBIDDEN",
            message: "Access denied. Admin role required."
        });
    }
    next();
};

export default adminMiddleware;
