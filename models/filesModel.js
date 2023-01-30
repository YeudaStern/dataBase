const mongoose = require("mongoose");
const Joi = require("joi")

const FileSchema = new mongoose.Schema({
  name: String,
  project_id:String,
  date_created: {
    type: Date, default: Date.now
  }
})

exports.FileModel = mongoose.model("files", FileSchema);

exports.validateFile = (_reqBody) => {
  let joiSchema = Joi.object({
    name: Joi.string().min(2).max(150).required()
  })

  return joiSchema.validate(_reqBody);
}