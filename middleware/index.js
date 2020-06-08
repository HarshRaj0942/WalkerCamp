//all the middleware goes here
var campgroundModel = require("../models/campgrounds");
var comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    campgroundModel.findById(req.params.id, function (err, foundCampground) {
      if (err) res.redirect("back");
      else {
        //does the user own the campground

        //author.id is a mongoose object, user._id is a string, cant compare with == OR ===
        if (foundCampground.author.id.equals(req.user._id)) next();
        else {
          res.redirect("back");
        }
      }
    });
  } else {
    //send user back to where they came from
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
          res.redirect("back");
        }
      }
    });
  } else {
    //send user back to where they came from
    res.redirect("back");
  }
};

middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

module.exports = middlewareObj;
