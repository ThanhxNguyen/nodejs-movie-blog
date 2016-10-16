var express = require('express');
var router = express.Router();
var request = require('request');
var tmdb = require('../config/themoviedb');

var Comment = require('../models/Comment');

var AuthController = require('../controllers/AuthController');



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

//get single movie
router.get('/movie/:movieId', AuthController.isUserLoggedin, function (req, res, next) {
    req.session.redirectTo = '/movie/' + req.params.movieId;
    request(tmdb.getSingleMovieUrl(req.params.movieId), function (err, response, data) {
        if(!err && response.statusCode == 200) {

            res.render('movies/movie', {title: "Movie Page", movie: JSON.parse(data), genres: tmdb.genres});
        }
    });
});

router.get('/movie/:movieId/comments', AuthController.isUserLoggedin, function(req, res, next) {
    Comment.find({movieId: req.params.movieId})
        .populate('postedBy', 'name')
        .exec(function(err, comments) {
            if(err)
                console.log('error getting comments');

            res.json(comments);
        });
});

router.post('/movie/:movieId/comment', AuthController.isUserLoggedin, function (req, res, next) {
    var commentData = {
        postedBy: req.user._id,
        content: req.body.comment,
        movieId: req.params.movieId
    };
    var newComment = new Comment(commentData);

    //save comment
    newComment.save(function(err, comment) {
        if(err)
            console.log('error saving comment');
        // res.json(comment);
        //get this new comment with user info
        Comment.findOne({_id: comment._id})
            .populate('postedBy', 'name')
            .exec(function(err, data) {
                if(err)
                    console.log('error get latest comment');

                res.json(data);
            });
    });

});

router.post('/movie/:movieId/comment/:commentId', AuthController.isUserLoggedin, function(req, res, next) {

    let newSubComment = {
        postedBy: req.user.name,
        content: req.body.subComment
    };

    Comment.findById(req.params.commentId, function(err, comment) {
        // res.json(comment);
        comment.subComments.push(newSubComment);

        comment.save(function(err) {
            if(err)
                console.log('error insert sub comment');

            newSubComment.parentCommentId = req.params.commentId;
            res.json(newSubComment);
        });
    });

    // Comment.findByIdAndUpdate(
    //     req.params.commendId,
    //     {$push: {"subComments": newSubComment}},
    //     {safe: true, upsert: true, new : true},
    //     function(err, model) {
    //         if(err)
    //             console.log('error insert sub comment');
    //
    //         //append commend id into response
    //         newSubComment.parentCommentId = req.params.commentId;
    //         res.json(newSubComment);
    //     }
    // );
});

module.exports = router;
