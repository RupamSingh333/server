const express = require("express");
const user_route = express();
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const auth = require("../middleware/auth");

user_route.use(express.static("public"));
// console.log(path.join(__dirname, "../public/userImages"));

user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      path.join(__dirname, "../public/userImages"),
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

const upload = multer({ storage: storage });

const user_controller = require("../controllers/userController");

//register api
user_route.post(
  "/register",
  upload.single("image"),
  user_controller.register_user
);

// login api
user_route.post("/login", user_controller.user_login);

// get users api
user_route.get("/getUsers", auth, user_controller.get_users);

//update password route
user_route.post("/update-password", auth, user_controller.update_password);

//forget password route
user_route.post("/forget-password", user_controller.forget_password);

module.exports = user_route;
