'use strict';

// Load Environment Variables from the .env file
const dotenv = require('dotenv')
dotenv.config();

// Application Setup
const PORT = process.env.PORT || 3000;


// Application Dependencies
const express = require('express');
const cors = require('cors');
const app = express();

// Module requirements
const locationHandler = require('./modules/location');
const weatherHandler = require('./modules/weather');
const getTrails = require('./modules/trails');
const client = require('./util/database');


// Middleware
app.use(cors()); 

// Add /location route
app.get('/location', locationHandler);
app.get('/weather', weatherHandler);
app.get('/trails', getTrails);
app.get('/movies', (request, response) => {
  response.send([]);
} );
// app.get('/yelp', yelpHandler );
app.get('/', (request, response) => {
  response.send('City Explorer Goes Here');
});

app.get('/bad', (request, response) => {
  throw new Error('oops');
});





// Has to happen after everything else
app.use(notFoundHandler);
// Has to happen after the error might have occurred
app.use(errorHandler); // Error Middleware



// Helper Functions

function errorHandler(error, response) {
  console.log(error);
  response.status(500).json({
    error: true,
    message: error.message,
  });
}

function notFoundHandler(request, response) {
  response.status(404).json({
    notFound: true,
  });
}

//Client connect
client.connect()
  .then(() => {
    console.log('Database/PG connected.');
    app.listen(PORT, () => console.log(`Listening on ${PORT}`));
  })
  .catch(error => {
    throw `Something went wrong: ${error}`;
  });
