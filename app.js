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
//let cors = require('cors');

var app = express();

/*let whitelist = [
    'http://localhost:5000',
];
var corsOptions = {
    origin: function(origin, callback){
        var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
        callback(null, originIsWhitelisted);
    },
    credentials: true
};
let corsOptions = {
	origin: true,
	allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With', 'Accept'],
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'
};*/
//app.use(cors(corsOptions));
//app.use('*', cors({origin:true,credentials: true}));
//app.options('*', cors({origin:true,credentials: true}));
//app.options('*', cors(corsOptions));

// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
/*app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});*/

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
    // intercept OPTIONS method
    if ('OPTIONS' == req.method.toUpperCase()) {
      res.send(204).end();
    }
    else {
      next();
    }
};
app.use(allowCrossDomain);

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
	//console.log("req", req);
	console.log("foo");
	console.log(req.method);
	if (typeof token !== 'undefined') {
		jwt.verify(token, app.get('tokenSecret'), function(err, decoded) {
			if (err) {
				console.log("Failed to authenticate token.");
				return res.json({ success: false, message: 'Failed to authenticate token.' });    
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;    
				next();
			}
		});
	}
	else {
		console.log('no token');
		// if there is no token
		// return an error
		
		return res.status(403).send({
			success: false,
			message: 'No token provided.'
		});
		
		//next();
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
