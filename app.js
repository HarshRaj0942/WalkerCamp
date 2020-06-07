var express = require("express");
var mongoose = require("mongoose");
var campgroundModel = require("./models/campgrounds.js");
var comment = require("./models/comment.js");
var user = require("./models/user.js");
var passport = require("passport");
var user = require("./models/user.js");
var localStrategy = require("passport-local");
// var passportLocalMongoose = require("passport-local-mongoose");
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
  next();
});

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
      res.render("./campgrounds/index.ejs", {
        campgrounds: allcampground,
      });
    }
  });
  // res.render("campgrounds.ejs", { campgrounds: campgrounds ,currentUser});
});

//show the form to create new camp grounds
app.get("/campgrounds/new", function (req, res) {
  res.render("./campgrounds/new.ejs");
});

//creating new campgrounds ,REST convention
app.post("/campgrounds", function (req, res) {
  //req.user contains a lot of info of the logged In user...this is done by Passport

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
//isLoggedIn is our middleWare
//when /secret is called, first isLoggedIn is run
//the next refers here to our callback
//if the user is loggedIn, next ,i.e. callback is run
app.get("/campgrounds/:id/comments/new", isLoggedIn, function (req, res) {
  campgroundModel.findById(req.params.id, function (err, foundCampground) {
    if (err) console.log("Error writing comments!");
    else {
      res.render("./comments/new.ejs", { campground: foundCampground });
    }
  });
});

app.post("/campgrounds/:id/comments", isLoggedIn, function (req, res) {
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

//AUTH ROUTES!

//show register form
app.get("/register", function (req, res) {
  res.render("register");
});

//handling user signUp
app.post("/register", function (req, res) {
  var username = req.body.username;
  var password = req.body.password;

  //not a good idea to store password to database. Provide it as a second argument for hashing. Third parameter is the callback function
  user.register(new user({ username: username }), password, function (
    err,
    newUser
  ) {
    if (err) {
      console.log(err);
      res.redirect("/");
    }
    res.send("Registered!");

    //if no error, then  authenticate
    //this method takes care of logging the user in, takes care of everything in the session.
    //this also runs the userSerialize() method
    //"local" means we are using local strategy

    //NOTE:- salt in our databse helps to unhash the hashed password
    passport.authenticate("local")(req, res, function () {
      res.redirect("/campgrounds");
    });
  });
});

//add login routes
//add login form

//one will be a GET and another will be a POST request

app.get("/login", function (req, res) {
  res.render("login");
});

//we now use passport.authenticate as a middleware
//middleware is something that runs before final route call
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
  }),
  function (req, res) {}
);

//logout route

app.get("/logout", function (req, res) {
  //passport destroys user data from session
  req.logout();
  res.redirect("/campgrounds");
});

//middleWare to check if user is logged in

//middleWare usually has three params, req,res and next
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}
