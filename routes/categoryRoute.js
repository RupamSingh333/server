const express = require('express');
const category_route = express();
const bodyParser = require("body-parser");
const auth = require("../middleware/auth");
const helper = require("../utils/helper");
category_route.use(bodyParser.json());
category_route.use(bodyParser.urlencoded({ extended: true }));
const category_controller = require("../controllers/categoryController");

//create store route
category_route.post(
  "/create-category",
  auth,
  category_controller.create_category
);

module.exports = category_route;