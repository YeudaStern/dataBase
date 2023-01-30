const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  company:String,
  date_created: {
    type: Date, default: Date.now
  },
  role: {
    type: String, default: "user"
  }
})


exports.UserModel = mongoose.model("users", userSchema);


exports.createToken = (user_id, role) => {
  let token = jwt.sign({ _id: user_id, role: role }, "monkeysSecret", { expiresIn: "600mins" })
  return token;
}


exports.validateUser = (_reqBody) => {
  let joiSchema = Joi.object({
    name: Joi.string().min(2).max(150).required(),
    email: Joi.string().min(2).max(150).email().required(),
    phone: Joi.string().min(2).max(150).required(),
    password: Joi.string().min(3).max(150).required(),
    date_created: {
      type: Date, default: Date.now
    },
    company: Joi.string().min(2).max(150).allow(null,"")
  })
  return joiSchema.validate(_reqBody);
}

exports.validateLogin = (_reqBody) => {
  let joiSchema = Joi.object({
    email: Joi.string().min(2).max(150).email().required(),
    password: Joi.string().min(3).max(150).required()
  })
  return joiSchema.validate(_reqBody);
}