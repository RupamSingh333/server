const mongoose = require("mongoose");

const companySchems = mongoose.Schema({
    name:{
        type:String,
        require:true,
        trim:true,
        unique:true,
        min:3,
        max:30
    }
},{timestamps:true});

module.exports = mongoose.model('Company',companySchems);