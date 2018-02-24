var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./app/routes/index');
var users = require('./app/routes/users');
let messages = require('./app/routes/messages');
let aichatdb = require('./app/routes/aichatdb');
let consts = require('./app/constants');
let jwt = require('jsonwebtoken');
let cors = require('cors');

var app = express();
app.use(cors());

// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
/*app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});*/

// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'hbs');

app.set('tokenSecret', process.env.AIBOT_TOKEN_SECRET); // secret variable

// uncomment after placing your favicon in app/public
//app.use(favicon(path.join(__dirname, 'app/public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'app/public')));

app.use(function(req, res, next) {
	let token = req.body.token || req.query.token || req.headers['x-access-token'];
	if (typeof token !== 'undefined') {
		jwt.verify(token, app.get('tokenSecret'), function(err, decoded) {
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });    
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;    
				next();
			}
		});
	}
	else {
		// if there is no token
		// return an error
		return res.status(403).send({
			success: false,
			message: 'No token provided.'
		});
	}
});

app.use('/', index);
app.use('/users', users);
app.use('/messages', messages);
app.use('/aichatdb', aichatdb);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
