
'use strict';

const superagent = require('superagent');
const client = require('../util/database');


function getLocationFromCache(city) {
  const SQL = `
  SELECT *
  FROM Locations
  WHERE search_query = $1
  LIMIT 1
  `;
  const parameters = [city];
  return client.query(SQL, parameters);
}
// function is storing this into the locations table
function setLocationInCache(location) {
  const { search_query, formatted_query, latitude, longitude } = location;
  const SQL = `
  INSERT INTO Locations (search_query, formatted_query, latitude, longitude)
  VALUES ($1, $2, $3, $4)
  RETURNING *
  `;
  const parameters = [search_query, formatted_query, latitude, longitude];
  return client.query(SQL, parameters)
    .then(result => {
      console.log('Cache Location', result);
    })                                                   
    .catch(err => {
      console.error('Failed to cache location', err);
    })
}

// Route Handler: location
function locationHandler(request, response) {
  const city = request.query.city;

  //returning promise
  getLocationFromCache(city)
    .then(result => {
      let { rowCount, rows } = result;
      if (rowCount > 0) {
        response.send(rows[0])
      } else {
        return getLocationFromApi(city, response);
      }
    })
}

function getLocationFromApi(city, response) {
  const url = 'https://us1.locationiq.com/v1/search.php';
  
  return superagent.get(url)
    .query({
      key: process.env.GEO_KEY,
      q: city, // query
      format: 'json'
    })

    .then(locationResponse => {
      let geoData = locationResponse.body;
      const location = new Location(city, geoData);

      setLocationInCache(location)
        .then(() => {
          return response.send(location);
        });
    })
    .catch(err => {
      console.log(err);
      errorHandler(err, request, response);
    });
}
// Location constructor 
function Location(city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData[0].display_name;
  this.latitude = parseFloat(geoData[0].lat);
  this.longitude = parseFloat(geoData[0].lon);
}
module.exports = locationHandler;
