var express = require("express");
var router  = express.Router();
var Campground = require("../models/spaceground");
var middleware = require("../middleware");
var request = require("request");

//INDEX - show all spacegrounds
router.get("/", function(req, res){
    // Get all spacegrounds from DB
    Spaceground.find({}, function(err, allSpacegrounds){
       if(err){
           console.log(err);
       } else {
           request('https://maps.googleapis.com/maps/api/geocode/json?address=sardine%20lake%20ca&key=AIzaSyBtHyZ049G_pjzIXDKsJJB5zMohfN67llM', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body); // Show the HTML for the Modulus homepage.
                res.render("spacegrounds/index",{spacegrounds:allSpacegrounds});

            }
});
       }
    });
});

//CREATE - add new spaceground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to spacegrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newSpaceground = {name: name, image: image, description: desc, author:author}
    // Create a new spaceground and save to DB
    Spaceground.create(newSpaceground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to spacegrounds page
            console.log(newlyCreated);
            res.redirect("/spacegrounds");
        }
    });
});

//NEW - show form to create new spaceground
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("spacegrounds/new"); 
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the spaceground with provided ID
    Spaceground.findById(req.params.id).populate("comments").exec(function(err, foundSpaceground){
        if(err){
            console.log(err);
        } else {
            console.log(foundSpaceground)
            //render show template with that campground
            res.render("spacegrounds/show", {spaceground: foundSpaceground});
        }
    });
});

router.get("/:id/edit", middleware.checkUserSpaceground, function(req, res){
    console.log("IN EDIT!");
    //find the spaceground with provided ID
    Spaceground.findById(req.params.id, function(err, foundSpaceground){
        if(err){
            console.log(err);
        } else {
            //render show template with that spaceground
            res.render("spacegrounds/edit", {spaceground: foundSpaceground});
        }
    });
});

router.put("/:id", function(req, res){
    var newData = {name: req.body.name, image: req.body.image, description: req.body.desc};
    Spaceground.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, spaceground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/spacegrounds/" + spaceground._id);
        }
    });
});


//middleware
// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     req.flash("error", "You must be signed in to do that!");
//     res.redirect("/login");
// }

module.exports = router;