const express = require('express');
const company_route = express();
const bodyParser = require("body-parser");
const auth = require("../middleware/auth");
company_route.use(bodyParser.json());
company_route.use(bodyParser.urlencoded({ extended: true }));
const companyController = require("../controllers/companyController");

//create store route
company_route.post(
  "/create-comapny",
  auth,
  companyController.create_company
);

module.exports = company_route;