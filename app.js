var express = require("express");
var mongoose = require("mongoose");
var campgroundModel = require("./models/campgrounds.js");
var comment = require("./models/comment.js");
var user = require("./models/user.js");
var seedDB = require("./seeds.js");

//connect to our database
mongoose.connect("mongodb://localhost:27017/WalkerCamp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

//generate seed data
seedDB();

//server listening at port 6969

app.listen(6969, function () {
  console.log("The WalkerCamp Server listening at port 6969");
});

//landing page route, this is the index route
app.get("/", function (req, res) {
  res.render("landing.ejs");
});

//campgrounds  route
app.get("/campgrounds", function (req, res) {
  //get all campground from database and render it

  campgroundModel.find({}, function (err, allcampground) {
    if (err) console.log("Error in obtaining campgrounds!");
    else {
      res.render("campgrounds.ejs", { campgrounds: allcampground });
    }
  });
  //res.render("campgrounds.ejs", { campgrounds: campgrounds });
});

//show the form to create new camp grounds
app.get("/campgrounds/new", function (req, res) {
  res.render("./campgrounds/new.ejs");
});

//creating new campgrounds ,REST convention
app.post("/campgrounds", function (req, res) {
  //get data from form and add to Walker camp

  var name = req.body.ground_Name;
  var image = req.body.ground_Image;
  var desc = req.body.ground_desc;

  //make an object with the data obtained

  var newCampground = { name: name, image: image, description: desc };

  //create a new campground and save to the database

  campgroundModel.create(newCampground, function (err, campground) {
    if (err) console.log("Error in creating new campgrounds!");
    else {
      //redirect to campgrounds page
      res.redirect("./campgrounds/index.ejs");
    }
  });
});

//creating the SHOW route for individual camps

app.get("/campgrounds/:id", function (req, res) {
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

//new comment route
app.get("/campgrounds/:id/comments/new", function (req, res) {
  campgroundModel.findById(req.params.id, function (err, foundCampground) {
    if (err) console.log("Error writing comments!");
    else {
      res.render("./comments/new.ejs", { campground: foundCampground });
    }
  });
});

app.post("/campgrounds/:id/comments", function (req, res) {
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
        foundCampground.comments.push(newComment);

        //make sure to save it!
        foundCampground.save();
        console.log("New comment made!");
        res.redirect("/campgrounds/" + foundCampground._id);
      });
    }
  });
});
