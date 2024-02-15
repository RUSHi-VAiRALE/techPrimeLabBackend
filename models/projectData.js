const mongoose = require("mongoose")

const projectSchema = new mongoose.Schema({
    ProjectTheme : String,
    Reason : String,
    Type : String,
    Division : String,
    Category : String,
    Priority : String,
    Department : String,
    StartDate : Date,
    EndDate : Date,
    ProjectLoc : String,
    Status : String
})

module.exports = mongoose.model("ProjectDetails",projectSchema)