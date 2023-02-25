const express = require("express");
const app = express();
const config = require("./config/config");
const cors = require('cors');
const PORT = process.env.PORT || 5000;


// Allow requests from all origins
app.use(cors());

//user route
const user_route = require("./routes/userRoute");
app.use("/api", user_route);

//Home Route
app.get("/", (req, res) => {
  res.status(200).send(`<!DOCTYPE html>
  <html>
    <head>
      <title>Welcome to My Node.js Server</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f2f2f2;
        }
        .container {
          margin: 100px auto;
          text-align: center;
        }
        h1 {
          font-size: 5em;
          color: #555;
          margin-bottom: 0.2em;
        }
        p {
          font-size: 1.2em;
          color: #777;
          margin-top: 0.2em;
        }
        a {
          color: #999;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Welcome to My Node.js Server</h1>
        <p>This is a simple Node.js application.</p>
        <a href="/users">View All Users</a>
      </div>
    </body>
  </html>
  `);
});

//when not found 
app.get('*', function(req, res){
  res.status(404).send(`<!DOCTYPE html>
  <html>
    <head>
      <title>404 Not Found</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f2f2f2;
        }
        .container {
          margin: 100px auto;
          text-align: center;
        }
        h1 {
          font-size: 5em;
          color: #555;
          margin-bottom: 0.2em;
        }
        p {
          font-size: 1.2em;
          color: #777;
          margin-top: 0.2em;
        }
        a {
          color: #999;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>404</h1>
        <p>Oops! The page you requested was not found.</p>
        <a href="/">Go back to the home page</a>
      </div>
    </body>
  </html>
  `);
});


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

