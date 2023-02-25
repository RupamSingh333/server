const express = require("express");
const app = express();
const config = require("./config/config");
const PORT = process.env.PORT || 5000;


//user route
const user_route = require("./routes/userRoute");
app.use("/api", user_route);

//Home Route
app.get("/", (req, res) => {
  res.status(200).send("<h1>Hello Welcome to API Home Page</h1>");
});

// app.get('*', function(req, res){
//   res.status(404).send('<h1>Opps Not Found</h1>');
// });



const serverStart = async () => {
  try {
    await config.connectDB(config.config.LOCAL_URI);
    app.listen(PORT, () => {
        console.log(`Server is listen on localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

serverStart();

