const validate = (schema, source = 'body') => {
    return function(req, res, next){
        try {
            const data = schema.parse(req[source]);

            if (source === "body") {
                req.body = data;
            } else {
                Object.assign(req[source], data);
            }
            
            next()
        } catch (error) {
            console.dir(error, { depth: null });
            return res.status(400).json({
                code: "VALIDATION_ERROR",
                message: error.issues?.[0]?.message || "Invalid input"
            })
        }
    }
}

export default validate