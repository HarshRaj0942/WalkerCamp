var express = require("express");
var router = express.Router();
var campgroundModel = require("../models/campgrounds");

//campgrounds  route
router.get("/campgrounds", function (req, res) {
  //get all campground from database and render it

  campgroundModel.find({}, function (err, allcampground) {
    if (err) console.log("Error in obtaining campgrounds!");
    else {
      res.render("./campgrounds/index.ejs", {
        campgrounds: allcampground,
      });
    }
  });
  // res.render("campgrounds.ejs", { campgrounds: campgrounds ,currentUser});
});

//show the form to create new camp grounds
router.get("/campgrounds/new", isLoggedIn, function (req, res) {
  res.render("./campgrounds/new.ejs");
});

//creating new campgrounds ,REST convention
router.post("/campgrounds", isLoggedIn, function (req, res) {
  //req.user contains a lot of info of the logged In user...this is done by Passport

  //get data from form and add to Walker camp

  var name = req.body.ground_Name;
  var image = req.body.ground_Image;
  var desc = req.body.ground_desc;

  //make an object with the data obtained

  var author = {
    id: req.user._id,
    username: req.user.username,
  };
  var newCampground = {
    name: name,
    image: image,
    description: desc,
    author: author,
  };

  //create a new campground and save to the database

  campgroundModel.create(newCampground, function (err, campground) {
    if (err) console.log("Error in creating new campgrounds!");
    else {
      console.log(campground);
      //redirect to campgrounds page
      res.redirect("./campgrounds");
    }
  });
});

//creating the SHOW route for individual camps

router.get("/campgrounds/:id", function (req, res) {
  //render info about the campgrounds

  //the campground object that is returned also has comments. We need to get that using .exec() Exec executes the query made by the populate function.
  campgroundModel
    .findById(req.params.id)
    .populate("comments")
    .exec(function (err, foundCampground) {
      if (err) console.log("Error displaying info");
      else {
        console.log(foundCampground);
        res.render("./campgrounds/shows.ejs", { campground: foundCampground });
      }
    });
});

//edit campground route

router.get("/campgrounds/:id/edit", checkCampgroundOwnership, function (
  req,
  res
) {
  //if user is logged In or not
  campgroundModel.findById(req.params.id, function (err, foundCampground) {
    //if we got to this point, there is no problem anyway
    res.render("./campgrounds/edit.ejs", { campground: foundCampground });
  });
  //if yes, is he the author of the campground
});

//post route

router.put("/campgrounds/:id", checkCampgroundOwnership, function (req, res) {
  campgroundModel.findByIdAndUpdate(
    req.params.id,
    req.body.campground,
    function (err, updatedCampground) {
      if (err) res.redirect("/campgrounds");
      else {
        res.redirect("/campgrounds/" + req.params.id);
      }
    }
  );
});

//destroy campground route
//remember, for deleting, we need to submit a form
router.delete("/campgrounds/:id", checkCampgroundOwnership, function (
  req,
  res
) {
  campgroundModel.findByIdAndRemove(req.params.id, function (err) {
    if (err) res.redirect("/campgrounds");
    else {
      res.redirect("/campgrounds");
    }
  });
});

//middleWare to check if user is logged in

//middleWare usually has three params, req,res and next
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}

//middleware
//check ownership of campground

function checkCampgroundOwnership(req, res, next) {
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
}
module.exports = router;