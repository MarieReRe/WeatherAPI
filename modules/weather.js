'use strict'; 

const superagent = require('superagent');
// const client = require('../util/database');
const errorHandler = require('../util/error');

// Route Handler: weather
function weatherHandler(request, response) {
    const url = 'https://api.weatherbit.io/v2.0/forecast/daily'
    superagent.get(url)
      .query({
        key: process.env.WEATHER_KEY,
        lat: request.query.latitude,
        lon: request.query.longitude,
        format:'json'
      })
      .then(weatherresponse => {
        let weatherData = weatherresponse.body;
        let dailyWeatherResult = weatherData.data.map(weatherResult => {
          return new Weather(weatherResult);
        })
  
        response.send(dailyWeatherResult);
      })
      .catch(err => {
        console.log(err);
        errorHandler(err, request, response);
      });
  }
  // Weather
  function Weather(weatherData) {
    this.forecast = weatherData.weather.description;
    this.time = new Date(weatherData.ts * 1000);
  }

  module.exports = weatherHandler;
  