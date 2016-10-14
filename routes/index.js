var express = require('express');
var router = express.Router();
var request = require('request');
var tmdb = require('../config/themoviedb');



/* GET home page. */
router.get('/', function(req, res, next) {
  request(tmdb.discoverSearchUrl + 'sort_by=popularity.desc', function (err, response, data) {
      if(!err && response.statusCode == 200) {
          res.render('index', {title: "Home Page", data: JSON.parse(data), genres: tmdb.genres});
      }
  });

});

router.get('/showing', function(req, res, next) {
    request(tmdb.discoverSearchUrl + 'primary_release_date.gte=2016-10-15&primary_release_date.lte=2016-10-30', function (err, response, data) {
        if(!err && response.statusCode == 200) {
            res.render('index', {title: "Now Showing Page", data: JSON.parse(data), genres: tmdb.genres});
        }
    });

});

router.get('/comming', function(req, res, next) {
    request(tmdb.discoverSearchUrl + 'primary_release_date.gte=2016-11-01&primary_release_date.lte=2016-12-30', function (err, response, data) {
        if(!err && response.statusCode == 200) {
            res.render('index', {title: "Now Showing Page", data: JSON.parse(data), genres: tmdb.genres});
        }
    });

});

router.get('/kids', function(req, res, next) {
    request(tmdb.discoverSearchUrl + 'certification_country=US&certification.lte=G&sort_by=popularity.desc', function (err, response, data) {
        if(!err && response.statusCode == 200) {
            res.render('index', {title: "Now Showing Page", data: JSON.parse(data), genres: tmdb.genres});
        }
    });

});

router.get('/best/:year', function(req, res, next) {
    request(tmdb.discoverSearchUrl + 'primary_release_year='+req.params.year+'&sort_by=vote_average.desc', function (err, response, data) {
        if(!err && response.statusCode == 200) {
            res.render('index', {title: "Now Showing Page", data: JSON.parse(data), genres: tmdb.genres});
        }
    });

});



// router.get('/test', function (req, res, next) {
//   request('https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=1bd3f3a91c22eef0c9d9c15212f43593', function (err, response, data) {
//     if(!err && response.statusCode == 200) {
//       res.json(JSON.parse(data));
//     }
//   });
// });


module.exports = router;
