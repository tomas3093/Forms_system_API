
const express = require('express');
const bodyParser = require('body-parser');
const app =  express();

// template engine settings
app.set('views', './server/views');
app.set('view engine', 'pug');

// bodyparser settings
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//CORS
var cors = require('cors');
app.use(cors({credentials: true, origin: true}));

const routes = require('./server/routes.js');
routes(app);

const port = 3000;
const server = app.listen(port, function () {
    console.log('Application running on http://localhost:' + server.address().port);
});


// Users can only access '/client' directory
app.use('/client', express.static(__dirname + '/client'));
