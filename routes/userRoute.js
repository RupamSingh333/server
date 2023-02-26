const express = require("express");
const user_route = express();
const bodyParser = require("body-parser");
const auth = require("../middleware/auth");
const utils = require("../utils/helper");
user_route.use(express.static("public"));
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({ extended: true }));
const user_controller = require("../controllers/userController");

//register api
user_route.post(
  "/register",
  utils.uploadImage.single("image"),
  user_controller.register_user
);

// login api
user_route.post("/login", user_controller.user_login);

//update password route
user_route.post("/update-password", auth, user_controller.update_password);

//forget password route
user_route.post("/forget-password", user_controller.forget_password);

//reset password 
user_route.get("/reset-password", user_controller.reset_password);


// get users api
user_route.get("/getUsers", auth, user_controller.get_users);



module.exports = user_route;
