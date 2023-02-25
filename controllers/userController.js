const User = require("../models/userModal");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const randomstring = require("randomstring");
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");

const sendMail = async (name, email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: config.emailUser,
        pass: config.emailPassword,
      },
    });

    const mailOption = {
      from: config.emailUser,
      to: email,
      subject: "For Reset Password",
      html:
        "<p> Hii " +
        name +
        ', Please copy the link and <a href="http://localhost:5000/api/reset-password?token="' +
        token +
        '"> Reset your password</a>',
    };

    transporter.sendMail(mailOption, function (error, info) {
      if (error) {
        console.log("Error From Send Mail", error);
      } else {
        console.log("Mail has been sent:-", info.response);
      }
    });
  } catch (error) {
    res.status(400).send({ sucess: false, message: error.message });
    return false;
  }
};

const create_token = async (id, res) => {
  try {
    const token = await jwt.sign({ _id: id }, config.config.secret_key);
    return token;
  } catch (error) {
    console.log(error);
  }
};

// password hasing methode
const securePassword = async (password) => {
  try {
    const passwordHash = await bcryptjs.hash(password, 10);
    return passwordHash;
  } catch (error) {
    res.status(400).send({ sucess: false, message: error.message });
  }
};

//register user
const register_user = async (req, res) => {
  try {
    const spassword = await securePassword(req.body.password);

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: spassword,
      image: req.file.filename,
      type: req.body.type,
      mobile: req.body.mobile,
    });

    let userExists = await User.findOne({ email: req.body.email });

    if (userExists) {
      if (userExists) {
        // Delete the uploaded image if the user already exists
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
      }
      res.status(200).send({ success: false, message: "User already exists" });
    } else {
      const user_data_save = await user.save();
      res.status(200).send({ success: true, data: user_data_save });
    }
  } catch (error) {
    res.status(400).send({ sucess: false, message: error.message });
  }
};

//login Method
const user_login = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    let userExist = await User.findOne({ email: email });

    if (userExist) {
      const passwordMatch = await bcryptjs.compare(
        password,
        userExist.password
      );
      if (passwordMatch) {
        const tokenData = await create_token(userExist._id);
        const userData = {
          _id: userExist._id,
          name: userExist.name,
          password: userExist.password,
          image: userExist.image,
          mobile: userExist.mobile,
          type: userExist.type,
          token: tokenData,
        };

        const response = {
          success: true,
          message: "Login Successfully",
          data: userData,
        };
        res.status(200).send(response);
      } else {
        res
          .status(200)
          .send({ success: false, message: "Login details are incorrect" });
      }
    } else {
      res
        .status(200)
        .send({ success: false, message: "Login details are incorrect" });
    }
  } catch (error) {
    res.status(400).send({ sucess: false, message: error.message });
  }
};

//get all users
const get_users = async (req, res) => {
  try {
    const users = await User.find({});

    // Add the image URL to each user's image property
    const usersWithImageUrls = users.map((user) => {
      return {
        ...user.toObject(),
        image:
          req.protocol + "://" + req.get("host") + "/api/uploads/" + user.image,
      };
    });

    res
      .status(200)
      .send({
        success: true,
        message: "Authentication",
        data: usersWithImageUrls,
      });
  } catch (error) {
    res.status(400).send({ sucess: false, message: error.message });
  }
};

//update password methode
const update_password = async (req, res) => {
  try {
    const user_id = req.body.user_id;
    const password = req.body.password;

    // Check if any of the fields are empty
    if (!user_id || !password) {
      return res.status(400).json({
        success: false,
        error: "Both user id and password are required.",
      });
    }

    const isValid = await User.findOne({ _id: user_id });
    if (isValid) {
      const newpassword = await securePassword(password);

      const updateUser = await User.findByIdAndUpdate(
        { _id: user_id },
        {
          $set: {
            password: newpassword,
          },
        }
      );
      res.status(200).send({
        success: true,
        message: "Password has been update successfully.",
      });
    } else {
      res.status(200).send({ success: false, message: "Invalid user id" });
    }
  } catch (error) {
    res.status(400).send({ sucess: false, message: error.message });
  }
};

// forget password
const forget_password = async (req, res) => {
  try {
    const email = req.body.email;
    if (!email) {
      return res.status(400).json({
        success: false,
        error: "email are required.",
      });
    }
    const findUser = await User.findOne({ email: email });
    if (findUser) {
      const randomString = randomstring.generate();

      await User.updateOne(
        { email: email },
        {
          $set: {
            token: randomString,
          },
        }
      );
      sendMail(findUser.name, email, randomString);
      return res.status(200).json({
        success: true,
        message: "We have send mail to your mail kidly check and verify.",
      });
    } else {
      res.status(200).send({
        sucess: true,
        message: "This email does not exist",
      });
      return false;
    }
  } catch (error) {
    res.status(400).send({ sucess: false, message: error.message });
    return false;
  }
};

module.exports = {
  register_user,
  user_login,
  get_users,
  update_password,
  forget_password,
};
