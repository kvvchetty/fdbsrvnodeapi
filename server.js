// get dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// parse requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/*Enable CORS for all HTTP methods
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
*/
// hard coded configuration object
conf = {
    // look for PORT environment variable,
    // else look for CLI argument,
    // else use hard coded value for port 8080
    port: process.env.PORT || process.argv[2] || 4200,
    // origin undefined handler
    // see https://github.com/expressjs/cors/issues/71
    originUndefined: function (req, res, next) {
        if (!req.headers.origin) {
            res.json({
                mess: 'Hi you are visiting the service locally. If this was a CORS the origin header should not be undefined'
            });
        } else {
            next();
        }
    },
 
    // Cross Origin Resource Sharing Options
    cors: {
        // origin handler
        origin: function (origin, cb) {
            // setup a white list
            let wl = ['https://agfndbsrv101.herokuapp.com'];
            if (wl.indexOf(origin) != -1) {
                cb(null, true);
            } else {
                cb(new Error('invalid origin: ' + origin), false);
            }
        },
        optionsSuccessStatus: 200
    }
};
 
// use origin undefined handler, then cors for all paths
app.use(conf.originUndefined, cors(conf.cors));

// Configuring the database
const config = require('./config.js');
const mongoose = require('mongoose');
require('./product.routes.js')(app);

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(config.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

// default route
app.get('/', (req, res) => {
    res.json({"message": "Fdbsrv Product app"});
});

// set port, listen for requests
const PORT = process.env.PORT || config.serverport;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
