var express = require("express");

var app = express();

app.set("view engine", "ejs");
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
  res.render("campgrounds.ejs", { campgrounds: campgrounds });
});
