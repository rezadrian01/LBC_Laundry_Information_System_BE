const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { config } = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { responseHelper } = require('./helpers/responseHelper');

config();
const app = express();
const VERSION = '/api/v1';

// Routes
const authRoute = require('./routes/authRoute');
const serviceListRoute = require('./routes/serviceListRoute');
const itemListRoute = require('./routes/itemListRoute');
const itemServiceRoute = require('./routes/itemServiceRoute')

// Middlewares
const authMiddleware = require('./middleware/authMiddleware');

app.use(cors()).use(bodyParser.json()).use(cookieParser())


app.use(`${VERSION}/auth`, authRoute);

app.use('/', authMiddleware.isAuth)

app.use(`${VERSION}/serviceList`, serviceListRoute);
app.use(`${VERSION}/itemList`, itemListRoute)
app.use(`${VERSION}/itemService`, itemServiceRoute)

app.use((err, req, res, next) => {
    const data = err.data || [];
    const statusCode = err.statusCode || 500;
    const message = err.message || "An error occured";
    responseHelper(res, message, statusCode, false, data)
})

mongoose.connect(process.env.MONGODB_URI).then(() => {
    app.listen(process.env.PORT, () => console.log(`Server is running at ${process.env.NODE_ENV === 'production' ? 'port ' : 'http://localhost:'}${process.env.PORT}`))
}
).catch(err => console.log(err))