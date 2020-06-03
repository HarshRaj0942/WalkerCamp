var express = require("express");

var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

//global object array as data for now
var campgrounds = [
  {
    name: "Bihar",
    image:
      "https://k6u8v6y8.stackpathcdn.com/blog/wp-content/uploads/2019/04/Summer-Camping-Sites-India.jpg",
  },
  {
    name: "Rajasthan",
    image:
      "https://k6u8v6y8.stackpathcdn.com/blog/wp-content/uploads/2019/04/Summer-Camping-Jaisalmer-Rajasthan.jpg",
  },
  {
    name: "Gujarat",
    image:
      "https://k6u8v6y8.stackpathcdn.com/blog/wp-content/uploads/2019/04/Summer-Camping-Rann-of-Kutch-Gujarat.jpg",
  },
];

//server listening at port 6969

app.listen(6969, function () {
  console.log("The WalkerCamp Server listening at port 6969");
});

//landing page route
app.get("/", function (req, res) {
  res.render("landing.ejs");
});

//campgrounds route
app.get("/campgrounds", function (req, res) {
  res.render("campgrounds.ejs", { campgrounds: campgrounds });
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
  campgrounds.push(newCampground);

  //redirect back to campgrounds page
  res.redirect("/campgrounds");
});
