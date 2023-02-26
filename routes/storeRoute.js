const express = require("express");
const store_route = express();
const bodyParser = require("body-parser");
const auth = require("../middleware/auth");
const utils = require("../utils/helper");
store_route.use(express.static("public"));
store_route.use(bodyParser.json());
store_route.use(bodyParser.urlencoded({ extended: true }));
const store_controller = require("../controllers/storeController");

//create store route
store_route.post(
  "/create-store",
  auth,
  utils.uploadImage.single("logo"),
  store_controller.create_store
);

module.exports = store_route;