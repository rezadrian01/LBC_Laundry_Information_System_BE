const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { config } = require('dotenv')
const mongoose = require('mongoose')

config();
const app = express();

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('Database connected')
    app.listen(process.env.PORT, () => console.log(`Server is running at http://localhost:${process.env.PORT}`))
}
).catch(err => console.log(err))