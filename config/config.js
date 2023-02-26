const mongoose = require("mongoose");

const config = {
    secret_key:"asdfghjklqwertyuiop",
    LOCAL_URI :'mongodb://127.0.0.1:27017/ECOM'
}

var smtp = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "rupam@doomshell.com",
    pass: "",
  },
};


const connectDB = async (uri) => {
  try {
    return mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.log("Database not connected Error:", error);
  }
};


module.exports = {config,connectDB,smtp};