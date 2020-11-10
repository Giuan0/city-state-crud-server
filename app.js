const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { Segments } = require('celebrate');

const ApplicationResponse = require('./helpers/ApplicationResponse');
const config = require('config');

const isTestEnvironment = config.util.getEnv('NODE_ENV') === 'test';

/////// TODO: move to somewhere else
async function connect() {
    const databaseURL = config.databaseURL;
    const connection = await mongoose.connect(databaseURL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    });
    const mongoConnection = await connection.connection.db;
    if(!isTestEnvironment) {
        console.info('DB loaded and connected!');
    }
}
connect().then();
///////

const stateRouter = require('./routes/state');
const cityRouter = require('./routes/city');

const app = express();

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

if(!isTestEnvironment) {
    //use morgan to log at command line
    app.use(logger('dev'));
}
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/state', stateRouter);
app.use('/city', cityRouter);

app.use((err, req, res, next) => {
    const errorMessage = err.details.get(Segments.BODY).message;
    const response = new ApplicationResponse(errorMessage);
    response.setStatusCode(httpStatus.BAD_REQUEST);

    return res.status(response.getStatusCode()).json(response);
});

app.listen(config.port, err => {
    if (err) {
        console.error(err);
        process.exit(1);
    }

    if(!isTestEnvironment) {
        console.info(`
          ###########################################
          Server listening on port: ${config.port} 
          ###########################################
        `);
    }
});

module.exports = app;
