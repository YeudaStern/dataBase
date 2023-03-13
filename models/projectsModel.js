const mongoose = require("mongoose");
const Joi = require("joi");



let ProjectSchema = new mongoose.Schema({
  p_name: String,
  info: String,
  user_id:Array,
  user_manager_id:String,
  date_created: {
    type: Date, default: Date.now
  }
})

exports.ProjectModel = mongoose.model("projects", ProjectSchema);

exports.validateProject = (_reqBody) => {
  let joiSchema = Joi.object({
    p_name: Joi.string().min(2).max(50).required(),
    info: Joi.string().min(1).max(2000).required(),
    user_id:Joi.array().min(1).max(999).allow(null,""),
    user_manager_id:Joi.string().min(1).max(100).allow(null,"")
  })
  return joiSchema.validate(_reqBody)
}
// _id
// id_users
// name:String
// info:String
// Date_create:{Date,date.now}

