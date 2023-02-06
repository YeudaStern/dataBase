const mongoose = require("mongoose");
const Joi = require("joi")

const CommentsSchema = new mongoose.Schema({
    name: String,
    title: String,
    user_id: String,
    project_id: String,
    image: String,
    info: String,
    date_created: {
        type: Date, default: Date.now
    }
})

exports.CommentsModel = mongoose.model("comments", CommentsSchema);

exports.validateComments = (_reqBody) => {
    let joiSchema = Joi.object({
        name: Joi.string().min(2).max(150).required(),
        title: Joi.string().min(2).max(150).required(),
        image: Joi.string().min(2).max(9999).allow(null, ""),
        info: Joi.string().min(2).max(2000).allow(null, "")
    })

    return joiSchema.validate(_reqBody);
}
