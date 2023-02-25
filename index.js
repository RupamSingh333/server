const express = require("express");
const app = express();

const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/ECOM");

//user route
const user_route = require("./routes/userRoute");
app.use("/api", user_route);

//Home Route
app.get("/", (req, res) => {
  res.status(200).send("<h1>Hello Welcome to API Home Page</h1>");
});

app.get('*', function(req, res){
  res.send('<h1>Opps Not Found</h1>', 404);
});


app.listen(5000, function () {
  console.log("Server is Ready on the localhost:5000/");
});
