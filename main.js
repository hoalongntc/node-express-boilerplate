/** ====== APP ARGS ====== **/
var argv = require('yargs').argv;
process.env.NODE_ENV = process.env.NODE_ENV || (('dev' in argv) ? 'development': 'production');

var PRODUCTION = process.env.NODE_ENV == 'production';
var CLIENT_APP = argv.app || 'app';
var CLIENT_PATH = (PRODUCTION ? '/dist/' : '/') + CLIENT_APP;

/** ====== Dependencies ====== **/
var express = require('express'),
    session = require('express-session'),
    RedisStore = require('connect-redis')(session),
    helmet = require('helmet'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    config = require('config'),
    morgan = require('morgan'),
    passport = require('passport');

var util = require('util');

/** ====== Logger, Path ====== **/
var logger, session_store;
if(PRODUCTION) {
    logger = morgan('combined');
} else {
    logger = morgan('dev');
}

/** ====== Session store ====== **/
session_store = new RedisStore({
    host: config.redis.host,
    port: config.redis.port,
    pass: config.redis.auth,
    db: config.session.redis.db,
    ttl: config.session.cookie.max_age
});

/** ====== Express setup ====== **/
var app = express();
app.ENV = process.env.NODE_ENV;
app.CLIENT_PATH = CLIENT_PATH;
app.PRODUCTION = PRODUCTION;

app.use(helmet());
app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }));
app.use(methodOverride('X-HTTP-Method-Override'));
if(!PRODUCTION) app.use(logger);
app.use(express.static(__dirname + '/public/'));
app.use(bodyParser.json({limit: '200mb'}));
app.use(bodyParser.urlencoded({limit: '200mb', extended: true}));
app.use(cookieParser());
if(PRODUCTION) app.use(logger);

app.use(session({
    store: session_store,
    secret: config.session.secret || 'fk10a8fj1249ad',
    key: config.session.key || 'sessionID',
    cookie: {
        maxAge: config.session.cookie.max_age * 1000 // 5 * 24h
    },
    resave: true,
    saveUninitialized: true
}));

/** ====== Routes ====== **/
app.use('/', require('./routes')(app));


/** ====== Error handler ====== **/
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (!PRODUCTION) {
    app.use(function(err, req, res, next) {
        res.status(err.code || 500).json({ code: err.code || err.status || 500, message: err.message, ecode: err.ecode });
    });
}

app.use(function(err, req, res, next) {
    if(err.code == 403) {
        res.status(403).send("Opps! Unauthenticated!");
    } else {
        res.status(err.status || 500).send("Opps! Something went wrong!");
    }
});

/** ====== Run server ====== **/
app.listen(config.server.port || 8080, '0.0.0.0', function() {
    console.log('Express server listening on port %s', config.server.port || 8080);
});