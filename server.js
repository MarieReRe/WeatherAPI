'use strict';

// Load Environment Variables from the .env file
const dotenv = require('dotenv')
dotenv.config();

// Application Dependencies
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');

// Application Setup
const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors()); // Middleware

app.get('/', (request, response) => {
  response.send('City Explorer Goes Here');
});

app.get('/bad', (request, response) => {
  throw new Error('oops');
});



// Add /location route
app.get('/location', locationHandler);
app.get('/weather', weatherHandler);
app.get('/trails', getTrails);
// app.get('/movies', );
// app.get('/yelp', );



// Route Handler: location
function locationHandler(request, response) {
  const city = request.query.city; 
  const url = 'https://us1.locationiq.com/v1/search.php';
  superagent.get(url)
    .query({
      key: process.env.GEO_KEY,
      q: city, // query
      format: 'json'
    })
  
    .then(locationResponse => {
      let geoData = locationResponse.body;
      const location = new Location(city, geoData);
      response.send(location);
    })
    .catch(err => {
      console.log(err);
      errorHandler(err, request, response);
    });
  }

  // Route Handler: weather
  function weatherHandler(request, response) {
    const url = 'https://api.weatherbit.io/v2.0/forecast/daily'
    superagent.get(url)
    .query ({
      key: process.env.WEATHER_KEY,
      lat: request.query.latitude,
      lon:request.query.longitude, 
      format: 'json'
    })
    .then(weatherresponse => {
      let weatherData = weatherresponse.body;
      let dailyWeatherResult = weatherData.data.map(weatherResult =>{
        return new Weather(weatherResult); 
      })
    
      response.send(dailyWeatherResult);
    })
    .catch(err => {
      console.log(err);
      errorHandler(err, request, response);
    });
  }


  //Trails Handler
  function getTrails(request, response) {
    const url = 'https://www.hikingproject.com/data/get-trails';
    superagent.get(url)
      .query({
        key: process.env.TRAIL_KEY,
        lat: request.query.latitude,
        lon: request.query.longitude,
        format:'json'
      })
      .then( trailsResponse => {
        let trailsData = trailsResponse.body;
        let trailsResults = trailsData.trails.map( trails => {
          return new Trails(trails);
        })
        response.send(trailsResults);
      })
      .catch(error => {
        console.log(error);
        errorHandler(error, request, response);
      })
  }
  

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

  function Location(city, geoData) {
    this.search_query = city; 
    this.formatted_query = geoData[0].display_name;
    this.latitude = parseFloat(geoData[0].lat);
    this.longitude = parseFloat(geoData[0].lon);
  }

  // Weather
  function Weather(weatherData) {
    this.forecast = weatherData.weather.description;
    this.time = new Date(weatherData.ts * 1000);
  }

  
// trails constructor
function Trails(trail){
  this.name = trail.name;
  this.location = trail.location;
  this.length = trail.length;
  this.stars = trail.stars;
  this.star_votes = trail.starVotes;
  this.summary = trail.summary;
  this.trail_url = trail.url;
  this.conditions = trail.conditionStatus;
  this.condition_date = new Date(trailsData.conditionDate).toDateString();
}

  // Make sure the server is listening for requests
  app.listen(PORT, () => console.log(`App is listening on ${PORT}`));