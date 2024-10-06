const responseHelper = (res, message, statusCode, success, data) => {
    res.status(statusCode).json({ success, message, data })
}

const errorHelper = (message = 'An error occured', statusCode = 500, data = []) => {
    const err = new Error(message);
    err.statusCode = statusCode;
    err.data = data;
    throw err;
}

module.exports = { responseHelper, errorHelper };