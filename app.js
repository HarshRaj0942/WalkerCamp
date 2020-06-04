var express = require("express");
var mongoose = require("mongoose");

//connect to our database
mongoose.connect("mongodb://localhost:27017/WalkerCamp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

//server listening at port 6969

app.listen(6969, function () {
  console.log("The WalkerCamp Server listening at port 6969");
});

//schema setup

var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
});

//setup the campground Model

var campgroundModel = mongoose.model("campground", campgroundSchema);

campgroundModel.create(
  {
    name: "Surat",
    image:
      "https://k6u8v6y8.stackpathcdn.com/blog/wp-content/uploads/2019/04/Summer-Camping-Har-Ki-Dun-Uttarakhand.jpg",
  },
  function (err, campground) {
    if (err) console.log("error!");
    else console.log("NEW CAMPGROUND!!");
    console.log(campground);
  }
);

//add another campground
campgroundModel.create(
  {
    name: "Dhanbad",
    image:
      "https://k6u8v6y8.stackpathcdn.com/blog/wp-content/uploads/2019/04/Summer-Camping-Jaisalmer-Rajasthan.jpg",
  },
  function (err, campground) {
    if (err) console.log("error!");
    else console.log("NEW CAMPGROUND!!");
    console.log(campground);
  }
);

//landing page route
app.get("/", function (req, res) {
  res.render("landing.ejs");
});

//campgrounds route
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
  res.render("new.ejs");
});

//creating new campgrounds ,REST convention
app.post("/campgrounds", function (req, res) {
  //get data from form and add to Walker camp

  var name = req.body.ground_Name;
  var image = req.body.ground_Image;

  //make an object with the data obtained

  var newCampground = { name: name, image: image };

  //create a new campground and save to the database

  campgroundModel.create(newCampground, function (err, campground) {
    if (err) console.log("Error in creating new campgrounds!");
    else {
      //redirect to campgrounds page
      res.redirect("/campgrounds");
    }
  });

  //redirect back to campgrounds page
});
