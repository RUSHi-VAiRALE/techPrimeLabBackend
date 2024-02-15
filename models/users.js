const mongoose = require("mongoose")

const userSchemaDemo = new mongoose.Schema({
    email : String,
    password : String
})

module.exports = mongoose.model("UserDemo",userSchemaDemo)