const responseHelper = (res, message, statusCode, success, data) => {
    res.status(statusCode).json({ success, message, data })
}



module.exports = { responseHelper };