var express = require("express");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var passport = require("passport");
var user = require("./models/user.js");
var localStrategy = require("passport-local");
var flash = require("connect-flash");

// var seedDB = require("./seeds.js");

var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");

//connect to our database

mongoose.connect(
  "mongodb+srv://hr1102:bits_pilani0942@cluster0-jk0pk.mongodb.net/WalkerCamp?retryWrites=true&w=majority"
);
var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

//use flash() before passport configuration
app.use(flash());

//generate seed data
//seedDB();

//passport configuration
app.use(
  require("express-session")({
    secret: "Harsh is awesome!",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
//important lines
//Passport.serialize and passport.deserialize are used to set id as a cookie in
//the user's browser and to get the id from the cookie when it then used to get user info in a callback. The
//done() function is an internal function of passport.js and the user id which you provide as the second
//arguement of done() function is saved in the session and it is later used to get the whole object using
//deserializeUser function
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

//middleware to send user data to all the routes
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

//tell our app to use these routes
app.use(indexRoutes);
app.use(commentRoutes);
app.use(campgroundRoutes);

//server listening at port 6969

app.listen(6969, function () {
  console.log("The WalkerCamp Server listening at port 6969");
});
