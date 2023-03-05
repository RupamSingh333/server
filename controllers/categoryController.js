const Category = require("../models/categoryModal");
const { ObjectId } = require("mongodb");

module.exports.create_category = async (req, res) => {
  try {
    const name = req.body.name;
    const regex = new RegExp(name, "i"); // 'i' flag makes the search case-insensitive
    const categoryExist = await Category.findOne({ name: regex });
    if (categoryExist) {
      // Name already exists in the database
      res.status(200).send({
        sucess: false,
        message: `${name} has already exist`,
      });
    } else {

      const create_cat = new Category({
        name: name,
      });

      const save_cat = await create_cat.save();
      res.status(200).send({
        sucess: true,
        message: `Category ${name} has been create successfully`,
        data: save_cat,
      });
    }
  } catch (error) {
    res.status(400).send({ sucess: false, message: error.message });
  }
};
