var mongoose = require("mongoose");

//schema setup
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,

  //associating comments with campgrounds
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

//setup the campground Model

var campgroundModel = mongoose.model("campground", campgroundSchema);
module.exports = campgroundModel;
