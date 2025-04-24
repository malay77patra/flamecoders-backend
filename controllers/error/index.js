const path = require('path');


const handleError = (err, req) => {
    const log = {
        time: new Date().toISOString(),
        message: err.message,
        stack: err.stack,
        method: req.method,
        url: req.originalUrl,
        headers: req.headers,
        body: req.body,
        query: req.query,
        params: req.params,
        ip: req.ip
    };

    console.error('Error Log:', JSON.stringify(log, null, 2));
};



const errorHandler = (err, req, res, next) => {
    handleError(err, req);

    if (req.method === "GET") {
        return res.status(500).render(path.join("pages", "error"), {
            message: "Something went wrong!"
        });
    }

    return res.status(500).json({
        message: "Something went wrong",
        details: "error handled by error handler"
    });
};


module.exports = {
    errorHandler
}