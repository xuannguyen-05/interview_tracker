import jwt from "jsonwebtoken"
import prisma from"../config/prisma.js"

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.accessToken

    if (!token) {
        return res.status(401).json({
            code: "NO_TOKEN",
            message: "No token provided"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await prisma.user.findUnique({
            where: { user_id: decoded.user_id },
            select: {
                user_id: true
            }
        })

        if (!user) {
            return res.status(401).json({
                code: "USER_NOT_VALID",
                message: "User not valid"
            })
        }

        req.user = decoded
        next()

    } catch (error) {
        // phân biệt lỗi
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                code: "TOKEN_EXPIRED",
                message: "Token expired"
            })
        }

        return res.status(401).json({
            code: "INVALID_TOKEN",
            message: "Invalid token"
        })
    }
}

export default authMiddleware 
