'use strict';

const superagent = require('superagent');
//Route Handler: Yelp
function yelpHandler(request, response) {
    const url = 'https://api.yelp.com/v3/businesses/search';
    console.log(request.query);
    const lat = request.query.latitude;
    const lon = request.query.longitude;
    const restaurants = request.query.restaurants;
    //setup superagent
    superagent.get(url)
        .set('Authorization', 'Bearer ' + process.env.YELP_KEY)
        // How do we match restaurants with user input what info do they need? 
        .query({
            latitude: lat,
            longitude: lon,
            category: restaurants,
            format: 'json'
        })
        .then(yelpResponse => {
            let restaurantData = yelpResponse.body;
            let yelpResults = restaurantData.businesses.map(allRestaurants => {
                return new Restaurant(allRestaurants);
            })
            response.send(yelpResults);
        })
        .catch(error => {
            errorHandler(error, request, response);
        })
}
//Yelp constructor
function Restaurant(restaurantData) {
    this.name = restaurantData.name;
    this.image_url = restaurantData.image_url;
    this.price = restaurantData.price;
    this.rating = restaurantData.rating;
    this.url = restaurantData.url;
}
//export for use in server.js
module.exports = yelpHandler; 