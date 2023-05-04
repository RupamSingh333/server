const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const config = require("../config/config");
const path = require("path");

// Set up storage for uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      path.join(__dirname, "../public/uploads/"),
      function (error, success) {
        if (error) throw error;
      }
    );
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "_" + file.originalname;
    cb(null, name, function (error1, success1) {
      if (error1) throw error1;
    });
  },
});

const uploadImage = multer({ storage: storage });

const sendEmail = async (email, subject, message, html) => {
  try {
    const transporter = nodemailer.createTransport(config.smtp);

    const mailOptions = {
      from: config.config.emailUser,
      to: email,
      subject: subject,
      text: message,
      html: html,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (error) {
    res.status(400).send({ sucess: false, message: error.message });
    return false;
  }
};

// password hasing methode
const createPassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log("Error in createPassword:", error.message);
    return error.message;
    res.status(400).send({ sucess: false, message: error.message });
  }
};

//create token
const create_token = async (id, res) => {
  try {
    const token = await jwt.sign({ _id: id }, config.config.secret_key, {
      expiresIn: "12h", // expires in 12 hours
    });
    return token;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  uploadImage,
  sendEmail,
  createPassword,
  create_token,
};
