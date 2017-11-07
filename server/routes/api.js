const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Video = require('../models/video');


const db = "mongodb://userfonso:smallsecret@ds249575.mlab.com:49575/videoplayer777";

mongoose.Promise = global.Promise;
mongoose.connect(db, function(err){
  if(err){
    console.error("Error! " + err);
  }
});

router.get('/videos', function (req, res) {
  console.log('Get request for all videos');
  Video.find({})
    .exec(function(err, videos){
      if(err){
        console.log("error retrieving videos");
      }else{
        res.json(videos);
      }
    });
});

router.get('/videos/:id', function (req, res) {
  console.log('Get request for single video');
  Video.findById(req.params.id)
    .exec(function(err, video){
      if(err){
        console.log("error retrieving video");
      }else{
        res.json(video);
      }
    });
});

router.post('/video', function(req,res){
  console.log('Post a video');
  let newVideo = new Video();
  newVideo.title = req.body.title;
  newVideo.url = req.body.url;
  newVideo.description = req.body.description;
  newVideo.save(function(err, insertedVideo){
    if(err){
      console.log('Error saving video');
    }else{
      res.json(insertedVideo);
    }
  });
});

module.exports = router;
