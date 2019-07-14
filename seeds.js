var mongoose = require("mongoose");
var Spaceground = require("./models/spaceground");
var Comment   = require("./models/comment");

var data = [
    {
        name: "107 Jetson's Way", 
        image: "https://images.adsttc.com/media/images/5cb9/ad2f/284d/d1c1/b000/002d/large_jpg/02_Houses-of-the-future-space-house.jpg?1555672362",
        description: "Great location, hover distance to Cosmo Space"
    },
    {
        name: "Moonlight Mesa", 
        image: "https://cdn.decoist.com/wp-content/uploads/2016/09/Custom-contemporary-pool-house-inspired-by-waves.jpg",
        description: "Quiet, peaceful location to get work done on a business travel trip. walking distance to the E.T. Memorial"
    },
    {
        name: "Gattaca Canyon", 
        image: "https://cms.qz.com/wp-content/uploads/2018/08/YT-STILL.png?w=1400&strip=all&quality=75",
        description: "For the adventurous! Go for a hike through the WanBacca crater"
    }
]

function seedDB(){
   //Remove all spacegrounds
   Spaceground.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed spacegrounds!");
         //add a few spacegrounds
        data.forEach(function(seed){
            Spaceground.create(seed, function(err, spaceground){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a spaceground");
                    //create a comment
                    Comment.create(
                        {
                            text: "I hate how Pluto's prices raised ever since it became a planet again.",
                            author: "Spaceman Spiff"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                spaceground.comments.push(comment);
                                spaceground.save();
                                console.log("Created new comment");
                            }
                        });
                }
            });
        });
    }); 
    //add a few comments
}

module.exports = seedDB;