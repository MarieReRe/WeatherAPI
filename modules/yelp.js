'use strict';

const superagent = require('superagent');
//Route Handler: Yelp
function yelpHandler(request, response) {
    const url = 'https://api.yelp.com/v3/businesses/search';
    console.log(request.query);
    const lat = request.query.latitude;
    const lon = request.query.longitude;
    const restaurants = request.query.restaurants;
 






//Yelp constructor
function Restaurant(yelpData) {
    this.name = yelpData.name;
    this.image_url = yelpData.image_url;
    this.price = yelpData.price;
    this.rating = yelpData.rating;
    this.url = yelpData.url;
  }



//export for use in server.js
module.exports = yelpHandler; 