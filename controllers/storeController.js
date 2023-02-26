const Store = require("../models/storeModal");
const User = require("../models/userModal");
const path = require("path");
const fs = require("fs");

module.exports.create_store = async (req, res) => {
  try {
    const vender_id= req.body.vender_id;
    const email= req.body.email;
    const address= req.body.address;
    const pin= req.body.pin;
    const latitude= req.body.latitude;
    const longitude= req.body.longitude;
    const logo= req.file.filename;
    const userExist = await User.findOne({ _id: req.body.vender_id });
    if (userExist) {
      if (!req.body.latitude ||  !req.body.longitude) {
        // Delete the uploaded image if the user already exists
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        res.status(200).send({
          sucess: false,
          message: "latitude and longitude is required",
        });
      } else {
        const storeExist = await Store.findOne({
          vender_id: req.body.vender_id,
        });
        if (storeExist) {
          // Delete the uploaded image if the user already exists
          if (req.file) {
            fs.unlinkSync(req.file.path);
          }
          
          res
          .status(400)
          .send({ sucess: false, message: "Vender already exists." });
        } else {
          const createStore = new Store({
            vender_id: vender_id,
            email: email,
            logo: logo,
            address: address,
            pin: pin,
            location: {
              type: "Point",
              coordinates: [
                parseFloat(longitude),
                parseFloat(latitude),
              ],
            },
          });


          const saveStore = await createStore.save();
          res.status(200).send({
            sucess: true,
            message: "Store has been create successfully",
            data: saveStore,
          });
        }
      }
    } else {
      // Delete the uploaded image if the user already exists
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      res
        .status(400)
        .send({ sucess: false, message: "Vender id does not exists." });
    }
  } catch (error) {
    res.status(400).send({ sucess: false, message: error.message });
  }
};
