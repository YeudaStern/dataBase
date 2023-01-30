const mongoose = require("mongoose");
const Joi = require("joi");



let ProjectSchema = new mongoose.Schema({
  p_name: String,
  info: String,
  date_created: {
    type: Date, default: Date.now
  },
  users_id:Array,
  user_manager_id:String
})

exports.ProjectModel = mongoose.model("projects", ProjectSchema);

exports.validateProject = (_reqBody) => {
  let joiSchema = Joi.object({
    p_name: Joi.string().min(2).max(50).required(),
    info: Joi.string().min(1).max(2000).required(),
    users_id:Joi.array().min(1).max(999).required(),
    user_manager_id:Joi.string().min(1).max(100).required()
  })
  return joiSchema.validate(_reqBody)
}
// _id
// id_users
// name:String
// info:String
// Date_create:{Date,date.now}
