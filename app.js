var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var expressSession = require('express-session');

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/routes');
var config = require('./config');
var models = require('./models-' + config.database + '/models');

// Connect models and send to router
models.connect(function(err) {
    if (err) {
        throw err;
    }

    // For testing only
    // TODO: Delete this afterwards
    models.Users.create('abc', '123', 'abc@gmail.com', function(err) {
        if (err) {
            throw err;
        }
    });
});
routes.configure({
    models: models,
    passport: passport
});

var app = express();

// Configure passport
passport.serializeUser(routes.serializeUser);
passport.deserializeUser(routes.deserializeUser);
passport.use(routes.strategy);

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

// Configure to use session
app.use(expressSession({ secret: 'keyboard cat' }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes.router);

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
