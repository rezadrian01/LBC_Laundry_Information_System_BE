const errorHelper = (message = 'An error occured', statusCode = 500, data = []) => {
    const err = new Error(message);
    err.statusCode = statusCode;
    err.data = data;
    throw err;
}

module.exports = { errorHelper }