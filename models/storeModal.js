const mongoose = require("mongoose");

const storeScema = mongoose.Schema({
  vender_id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  logo: {
    type: String,
    required: true,
  },
  pin: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  location: {
    type:{type: String,
    required: true},
    coordinates:[]
  },
});

storeScema.index({location:"2dspher"});

module.exports = mongoose.model("Store", storeScema);
