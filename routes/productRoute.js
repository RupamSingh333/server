const express = require("express");
const product_route = express();
const bodyParser = require("body-parser");
const auth = require("../middleware/auth");
const helper = require("../utils/helper");
product_route.use(bodyParser.json());
product_route.use(bodyParser.urlencoded({ extended: true }));
const productController = require("../controllers/productController");

//create product route
product_route.post(
  "/add-product",
  auth,
  helper.uploadImage.single("image"),
  productController.add_product
);

//get all product route
product_route.get("/products", productController.get_all_products);

module.exports = product_route;
