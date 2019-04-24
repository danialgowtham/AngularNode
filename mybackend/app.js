var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// var index = require('./routes/index');
var users = require('./routes/users.route');
var employee_skill_mapping = require('./routes/employee_skill_mapping.route');

const cors = require('cors');
const jwt = require('./public/javascripts/jwt');
const errorHandler = require('./public/javascripts/error-handler');
var bluebird = require('bluebird')
var app = express();

var mongoose = require('mongoose')
mongoose.Promise = bluebird
mongoose.connect('mongodb://localhost:27017/ideal_new', { useMongoClient: true })
  .then(() => { console.log(`Succesfully Connected to the Mongodb Database  at URL : mongodb://localhost:27017/ideal2`) })
  .catch(() => { console.log(`Error Connecting to the Mongodb Database at URL : mongodb://localhost:27017/ideal2`) })

//cross domain access
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});
app.use(cors());




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', index);
app.use(jwt());
app.use('/users', users);
app.use('/employee_skill_mapping', employee_skill_mapping);
app.use(errorHandler);
// app.use('/api', api);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
