const errorHandler = (err, req, res, next) => {
    console.error(err);
    const statusCode = err.statusCode || 500
    const fallbackCode = statusCode === 400
        ? "BAD_REQUEST"
        : statusCode === 401
        ? "UNAUTHORIZED"
        : statusCode === 403
        ? "FORBIDDEN"
        : statusCode === 404
        ? "NOT_FOUND"
        : "INTERNAL_ERROR"

    const isInternalError = statusCode >= 500 || isPrismaError(err)
    const message = isInternalError
        ? "Internal Server Error"
        : err.message || "Internal Server Error"

    res.status(statusCode).json({
        success: false,
        code: err.code || fallbackCode,
        message,
    })
}

function isPrismaError(err) {
    return (
        err?.name === "PrismaClientKnownRequestError" ||
        err?.name === "PrismaClientValidationError" ||
        String(err?.message || "").includes("Invalid `prisma.")
    )
}

export default errorHandler