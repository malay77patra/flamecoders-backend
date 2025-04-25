const { defaultTo } = require("lodash");


const globalErrorHandler = (err, req, res, next) => {
    console.error(`[${new Date().toISOString()}] Error occurred`);
    console.error(`Name: ${err.name}`);
    console.error(`Message: ${err.message}`);
    if (err.stack) {
        console.error(`Stack: ${err.stack}`);
    }

    const statusCode = err.statusCode || 500;
    const responseMessage = err.isOperational ? err.message : 'Internal Server Error';

    res.status(statusCode).json({
        error: "Something went wrong!",
        details: responseMessage
    });
};


module.exports = {
    globalErrorHandler
}