const Company = require("../models/companyModal");
const { ObjectId } = require("mongodb");

module.exports.create_company = async (req, res) => {
  try {
    const name = req.body.name;
    const regex = new RegExp(name, "i"); // 'i' flag makes the search case-insensitive
    const companyExist = await Company.findOne({ name: regex });
    if (companyExist) {
      // Name already exists in the database
      res.status(200).send({
        sucess: false,
        message: `${name} has already exist`,
      });
    } else {

      const create_company = new Company({
        name: name,
      });

      const save_cat = await create_company.save();
      res.status(200).send({
        sucess: true,
        message: `Company ${name} has been create successfully`,
        data: save_cat,
      });
    }
  } catch (error) {
    res.status(400).send({ sucess: false, message: error.message });
  }
};
