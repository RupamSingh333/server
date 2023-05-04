const Product = require("../models/productModal");
const Category = require("../models/categoryModal");
const Company = require("../models/companyModal");

const { ObjectId } = require("mongodb");
const path = require("path");
const fs = require("fs");

module.exports.add_product = async (req, res) => {
  try {
    const { name, price, categoryId, colors, companyId, description } =
      req.body;
    const image = req.file.filename;
    // const regex = new RegExp(name, "i");
    const regex = new RegExp('^' + name + '$', 'i');
    const productExist = await Product.findOne({ name: regex });

    if (productExist) {
      // Name already exists in the database
      res.status(200).send({
        sucess: false,
        message: `${name} has already exist`,
      });

      // Delete the uploaded image if the user already exists
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
    } else {
      const add_product = new Product({
        name,
        price,
        categoryId,
        colors,
        companyId,
        description,
        image,
      });

      const save_product = await add_product.save();
      res.status(200).send({
        sucess: true,
        message: `Product ${name} has been add successfully`,
        data: save_product,
      });
    }
  } catch (error) {
    // Delete the uploaded image if the user already exists
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(400).send({ sucess: false, message: error.message });
  }
};

// find all products
module.exports.get_all_products = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 })
      .select("-__v")
      .populate({ path: "companyId", select: "name" })
      .populate({ path: "categoryId", select: "name" });

    const productsWithImageUrls = products.map((product) => {
      return {
        ...product.toObject(),
        image:
          req.protocol +
          "://" +
          req.get("host") +
          "/api/uploads/" +
          product.image,
        categoryName: product.categoryId.name,
        companyName: product.companyId.name,
      };
    });

    res.status(200).send({
      success: true,
      message: "All products",
      data: productsWithImageUrls,
    });
  } catch (error) {
    res.status(400).send({ sucess: false, message: error.message });
  }
};
