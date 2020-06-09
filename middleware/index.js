//all the middleware goes here
var campgroundModel = require("../models/campgrounds");
var comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function (req, res, next) {
  //isAuthenticated() checks if user is logged In
  if (req.isAuthenticated()) {
    campgroundModel.findById(req.params.id, function (err, foundCampground) {
      if (err) {
        req.flash("error", "Campground not found!");
        res.redirect("back");
      } else {
        // Added this block, to check if foundCampground exists, and if it doesn't to throw an error via connect-flash and send us back to the homepage
        if (!foundCampground) {
          req.flash("error", "Item not found.");
          return res.redirect("back");
        }
        //does the user own the campground

        //author.id is a mongoose object, user._id is a string, cant compare with == OR ===
        if (foundCampground.author.id.equals(req.user._id)) next();
        else {
          req.flash("error", "You are not authorized to do this!");
          res.redirect("back");
        }
      }
    });
  } else {
    //send user back to where they came from
    req.flash("error", "You need to be Logged In to do this");
    res.redirect("back");
  }
};

middlewareObj.checkCommentOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    comment.findById(req.params.comment_id, function (err, foundComment) {
      if (err) res.redirect("back");
      else {
        //does the user own the comment

        //author.id is a mongoose object, user._id is a string, cant compare with == OR ===
        if (foundComment.author.id.equals(req.user._id)) next();
        else {
          req.flash("error", "You are not authorized to do that!");
          res.redirect("back");
        }
      }
    });
  } else {
    //send user back to where they came from
    req.flash("error", "You need to be Logged In to do that!");
    res.redirect("back");
  }
};

middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  //req.flash MUST BE BEFORE THE REDIRECT
  //THIS MESSAGE WONT PERSIST,ITS JUST A ONE TIME THING
  req.flash("error", "You need to be Logged In to do that!");
  res.redirect("/login");
};

module.exports = middlewareObj;
