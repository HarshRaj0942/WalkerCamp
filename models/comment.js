var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
  text: String,
  //the author would eventually have a reference to the user who made it
  author: String,
});

module.exports = mongoose.model("Comment", commentSchema);
