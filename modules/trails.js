'use strict';

const superagent = require('superagent');
// const client = require('../util/database');



//Trails Handler
function getTrails(request, response) {
    const url = 'https://www.hikingproject.com/data/get-trails';
    superagent.get(url)
      .query({
        key: process.env.TRAIL_KEY,
        lat: request.query.latitude,
        lon: request.query.longitude,
        format: 'json'
      })
      .then(trailsResponse => {
        let trailsData = trailsResponse.body;
        let trailsResults = trailsData.trails.map(allTrails => {
          return new Trails(allTrails);
        })
        response.send(trailsResults);
      })
      .catch(err => {
        console.log(err);
        errorHandler(err, request, response);
      })
  }
  
  
  // trails constructor
  function Trails(trail) {
    this.name = trail.name;
    this.location = trail.location;
    this.length = trail.length;
    this.stars = trail.stars;
    this.star_votes = trail.starVotes;
    this.summary = trail.summary;
    this.trail_url = trail.url;
    this.conditions = trail.conditionStatus;
    this.condition_date = new Date(trail.conditionDate).toDateString();
  }

  module.exports = getTrails;