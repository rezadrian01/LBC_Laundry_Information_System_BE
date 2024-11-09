const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { config } = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const { responseHelper } = require('./helpers/responseHelper');
const { startScheduler } = require('./utils/scheduler');


config();
const app = express();
const VERSION = '/api/v1';

// Routes
const authRoute = require('./routes/authRoute');
const serviceListRoute = require('./routes/serviceListRoute');
const itemListRoute = require('./routes/itemListRoute');
const itemServiceRoute = require('./routes/itemServiceRoute');
const branchListRoute = require('./routes/branchListRoute');
const statusListRoute = require('./routes/statusListRoute');
const laundryRoute = require('./routes/laundryRoute');
const laundryStatusRoute = require('./routes/laundryStatusRoute');
const weightPriceRoute = require('./routes/weightPriceRoute');
const adminRoute = require('./routes/adminRoute');
const reportRoute = require('./routes/reportRoute');
const trainDataRoute = require('./routes/trainDataRoute');

// Middlewares
const authMiddleware = require('./middlewares/authMiddleware');

// Scheduler
startScheduler();

app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL
}))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(cookieParser())


app.use(`${VERSION}/auth`, authRoute);
app.use(`${VERSION}/laundry`, laundryRoute);

app.use('/', authMiddleware.isAuth);

app.use(`${VERSION}/service`, serviceListRoute);
app.use(`${VERSION}/item`, itemListRoute);
app.use(`${VERSION}/itemService`, itemServiceRoute);
app.use(`${VERSION}/branch`, branchListRoute);
app.use(`${VERSION}/status`, statusListRoute);
app.use(`${VERSION}/laundryStatus`, laundryStatusRoute);
app.use(`${VERSION}/weightPrice`, weightPriceRoute);
app.use(`${VERSION}/admin`, adminRoute);
app.use(`${VERSION}/report`, reportRoute);
app.use(`${VERSION}/trainData`, trainDataRoute);

app.use((err, req, res, next) => {
    const data = err.data || [];
    const statusCode = err.statusCode || 500;
    const message = err.message || "An error occured";
    responseHelper(res, message, statusCode, false, data);
})

mongoose.connect(process.env.MONGODB_URI).then(() => {
    app.listen(process.env.PORT, () => console.log(`Server is running at ${process.env.NODE_ENV === 'production' ? 'port ' : 'http://localhost:'}${process.env.PORT}`));
}
).catch(err => console.log(err))