var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/spaceground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Comments New
router.get("/new", middleware.isLoggedIn, function(req, res){
    // find spaceground by id
    console.log(req.params.id);
    Spaceground.findById(req.params.id, function(err, spaceground){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {spaceground: spaceground});
        }
    })
});

//Comments Create
router.post("/",middleware.isLoggedIn,function(req, res){
   //lookup spaceround using ID
   Spaceground.findById(req.params.id, function(err, spaceground){
       if(err){
           console.log(err);
           res.redirect("/spacegrounds");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment
               comment.save();
               spaceground.comments.push(comment);
               spaceground.save();
               console.log(comment);
               req.flash('success', 'Created a comment!');
               res.redirect('/spacegrounds/' + spaceground._id);
           }
        });
       }
   });
});

router.get("/:commentId/edit", middleware.isLoggedIn, function(req, res){
    // find spaceground by id
    Comment.findById(req.params.commentId, function(err, comment){
        if(err){
            console.log(err);
        } else {
             res.render("comments/edit", {spaceground_id: req.params.id, comment: comment});
        }
    })
});

router.put("/:commentId", function(req, res){
   Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, comment){
       if(err){
           res.render("edit");
       } else {
           res.redirect("/spacegrounds/" + req.params.id);
       }
   }); 
});

router.delete("/:commentId",middleware.checkUserComment, function(req, res){
    Comment.findByIdAndRemove(req.params.commentId, function(err){
        if(err){
            console.log("PROBLEM!");
        } else {
            res.redirect("/spacegrounds/" + req.params.id);
        }
    })
});

module.exports = router;