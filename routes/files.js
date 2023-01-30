const express = require("express");
const { auth } = require("../middlewares/auth");
const { FileModel, validateFile } = require("../models/filesModel")
const router = express.Router();

router.get("/", async (req, res) => {
  res.json({ msg: "files work" });
})


router.post("/", auth, async (req, res) => {
  let validBody = validateFile(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let file = new FileModel(req.body);

    file.user_id = req.tokenData._id;
    await file.save();
    res.status(201).json(file);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})


router.put("/:id", auth, async (req, res) => {
  let validBody = validateFile(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let id = req.params.id;

    let data;
    if (req.tokenData.role == "admin") {
      data = await FileModel.updateOne({ _id: id }, req.body);
    }
  
    else {
      data = await FileModel.updateOne({ _id: id, user_id: req.tokenData._id }, req.body);
    }
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }

})

router.delete("/:id", auth, async (req, res) => {
  try {
    let id = req.params.id;

    let data;
    if (req.tokenData.role == "admin") {
      data = await FileModel.deleteOne({ _id: id }, req.body);
    }
    else {
      data = await FileModel.deleteOne({ _id: id, user_id: req.tokenData._id }, req.body.data);
    }
    res.json(data)
  }

  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})


module.exports = router;