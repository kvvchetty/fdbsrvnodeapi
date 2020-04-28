const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
//here is the magic
//app.use(cors());
/*Enable CORS for all HTTP methods*/
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


const config = require('./config.js');
const mongoose = require('mongoose');
require('./product.routes.js')(app);
mongoose.Promise = global.Promise;

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
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
