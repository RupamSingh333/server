const mongoose = require("mongoose");

const config = {
    secret_key:"asdfghjklqwertyuiop",
    emailUser:'rupam@dommshell.com',
    emailPassword:'Rupamsingh@123',
    LOCAL_URI :'mongodb://127.0.0.1:27017/ECOM'
}


const connectDB = async (uri) => {
  try {
    // console.log("Database has been connected successfully");
    return mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.log("Database not connected Error:", error);
  }
};


module.exports = {config,connectDB};