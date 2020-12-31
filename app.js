const express = require('express');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const cors = require('cors');
const AppError = require('./utils/appError');
const globalError = require('./Controllers/errorController');
const rolesRoutes = require('./routes/rolesRoutes');
const users = require('./routes/userRoutes');

const askJackie = require('./routes/askJackieRoutes');

const app = express();
//body parse middleware
app.use(express.json({limit: '5mb'}));
//app.use(express.json());
// app.use(express.)
app.enable('trust proxy');
//Global Middleware Stack

//implementing CORS
//Access-control-Allow-Origin(Allowing Everyone to use our API)
app.use(cors());
app.options('*', cors());
// app.options('api/v1/tours/:id',cors())
//Setting Security Http Headers
app.use(helmet());
//Allowing Only 100 Request in 1 Hour For '/api'
const limit = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too Many Request From this IP.',
});
app.use('/api', limit);

//seting View Engine
//app.set('view engine','pug');
//app.set('views',path.join(__dirname,'views'))

//Data Sanitization against No Sql query injection(Filtering $ etc)
app.use(mongoSanitize());
//Data Sanitization against XSS
app.use(xss());
//Prevent Parameter Pollution
// app.use(
//   hpp({whitelist: ['duration,difficulty,price,ratingAverage,ratingQuantity']}),
// );

//Compressing text
app.use(compression());
//static File
app.use(express.static(`${__dirname}/public`));
//logging
process.env.NODE_ENV === 'development' ? app.use(morgan('dev')) : null;

//Routes Middleware
app.use('/api/roles', rolesRoutes);
app.use('/api/users', users);
app.use('/api/askJackie', askJackie);

app.all('*', (req, res, next) => {
  next(
    new AppError(
      `requested Url ${req.originalUrl} could not be found on this server`,
      404,
    ),
  );
});
app.use(globalError);
//app.param(tours.checkID)
module.exports = app;
