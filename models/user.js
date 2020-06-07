var mongoose = require("mongoose");

//passport-local-mongoose to be added to user model

var passportLocalMongoose = require("passport-local-mongoose");
var userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

//adds all the relevant methods etc to our schema
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("user", userSchema);
