var express = require("express");
var router = express.Router({ mergeParams: true });
var campgroundModel = require("../models/campgrounds");
var comment = require("../models/comment");

//===================================================
//new comment route
//isLoggedIn is our middleWare
//when /secret is called, first isLoggedIn is run
//the next refers here to our callback
//if the user is loggedIn, next ,i.e. callback is run
router.get("/campgrounds/:id/comments/new", isLoggedIn, function (req, res) {
  campgroundModel.findById(req.params.id, function (err, foundCampground) {
    if (err) console.log("Error writing comments!");
    else {
      res.render("./comments/new.ejs", { campground: foundCampground });
    }
  });
});

router.post("/campgrounds/:id/comments", isLoggedIn, function (req, res) {
  //lookup campground using the id
  //create new comment
  //connect the new comment to the campground
  //redirect to the appropriate show page

  campgroundModel.findById(req.params.id, function (err, foundCampground) {
    if (err) console.log("error");
    else {
      //create the comment
      comment.create(req.body.comment, function (err, newComment) {
        if (err) console.log("Error creating comment!");

        //add user name and id to comment. Use req.useer

        newComment.author.id = req.user._id;
        newComment.author.username = req.user.username;
        newComment.save();

        foundCampground.comments.push(newComment);

        //make sure to save it!
        foundCampground.save();
        console.log("New comment made!");
        res.redirect("/campgrounds/" + foundCampground._id);
      });
    }
  });
});

//edit route for comments

router.get(
  "/campgrounds/:id/comments/:comment_id/edit",
  checkCommentOwnership,
  function (req, res) {
    comment.findById(req.params.comment_id, function (err, foundComment) {
      if (err) res.redirect("back");
      else {
        res.render("./comments/edit.ejs", {
          campground_id: req.params.id,
          foundComment: foundComment,
        });
      }
    });
  }
);

//post route for comment
router.put(
  "/campgrounds/:id/comments/:comment_id",
  checkCommentOwnership,
  function (req, res) {
    comment.findByIdAndUpdate(
      req.params.comment_id,
      req.body.comment,
      function (err, updatedComment) {
        if (err) res.redirect("back");
        else {
          res.redirect("/campgrounds/" + req.params.id);
        }
      }
    );
  }
);

//destroy route for comments

router.delete(
  "/campgrounds/:id/comments/:comment_id",
  checkCommentOwnership,
  function (req, res) {
    comment.findByIdAndRemove(req.params.comment_id, function (err) {
      if (err) res.redirect("/campgrounds/" + req.params.id);
      else res.redirect("/campgrounds/" + req.params.id);
    });
  }
);

//middleWare to check if user is logged in

//middleWare usually has three params, req,res and next
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}

//middleware to check comment ownership before edit/delete
function checkCommentOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    comment.findById(req.params.comment_id, function (err, foundComment) {
      if (err) res.redirect("back");
      else {
        //does the user own the comment

        //author.id is a mongoose object, user._id is a string, cant compare with == OR ===
        if (foundComment.author.id.equals(req.user._id)) next();
        else {
          res.redirect("back");
        }
      }
    });
  } else {
    //send user back to where they came from
    res.redirect("back");
  }
}
module.exports = router;
