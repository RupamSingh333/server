const User = require("../models/userModal");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

const create_token = async (id) => {
  try {
    const token = await jwt.sign({ _id: id }, config.secret_key);
    return token;
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// password hasing methode
const securePassword = async (password) => {
  try {
    const passwordHash = await bcryptjs.hash(password, 10);
    return passwordHash;
  } catch (error) {
    res.status(400).send(error.message);
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

    let userData = await User.findOne({ email: req.body.email });

    if (userData) {
      res.status(200).send({ success: false, msg: "Email already exist" });
    } else {
      const user_data_save = await user.save();
      res.status(200).send({ success: true, data: user_data_save });
    }
  } catch (error) {
    res.status(400).send(error.message);
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
          msg: "User Details",
          data: userData,
        };
        res.status(200).send(response);
      } else {
        res
          .status(200)
          .send({ success: false, msg: "Login details are incorrect" });
      }
    } else {
      res
        .status(200)
        .send({ success: false, msg: "Login details are incorrect" });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

//get all users
const get_users = async (req, res) => {
  try {
    res.status(200).send({ success: true, msg: "Authentication okay" });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = { register_user, user_login, get_users };
