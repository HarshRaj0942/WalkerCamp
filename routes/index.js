var express = require("express");
var router = express.Router();
var passport = require("passport");
var user = require("../models/user");

//this is the all purpose route not related to any model
//landing page route, this is the index route
router.get("/", function (req, res) {
  res.render("landing.ejs");
});

//==========================================================
//AUTH ROUTES!

//show register form
router.get("/register", function (req, res) {
  res.render("register");
});

//handling user signUp
router.post("/register", function (req, res) {
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

router.get("/login", function (req, res) {
  res.render("login");
});

//we now use passport.authenticate as a middleware
//middleware is something that runs before final route call
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
  }),
  function (req, res) {}
);

//logout route

router.get("/logout", function (req, res) {
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

module.exports = router;
