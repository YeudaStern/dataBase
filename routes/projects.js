const express = require("express");
const { authAdmin } = require("../middlewares/auth");
const { validateProject, ProjectModel } = require("../models/projectsModel")
const router = express.Router();

router.get("/", async (req, res) => {
  res.json({ msg: "Project info work" });
})


//TODO:לעשות גט וחיפוש של משתמשים

// Create a new projecrs, and only "admin" can add new.
router.post("/", authAdmin, async (req, res) => {
  if (!req.session.user) {
    return res.status(301).json({ msg: "user not valid" })
  }
  else {
    let validBody = validateProject(req.body);
    if (validBody.error) {
      return res.status(400).json(validBody.error.details);
    }
    try {
      req.body.admin_id = req.session.user._id;

      let info = new ProjectModel(req.body);

      await info.save();
      res.status(201).json(info);
    }
    catch (err) {
      console.log(err);
      res.status(502).json({ err })
    }
  }

})


// All the users can edit the projects
router.put("/:id", async (req, res) => {
  if (!req.session.user) {
    return res.status(301).json({ msg: 'user is nod log in...' })
  }
  let validBody = validateProject(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let id = req.params.id;
    let project = await ProjectModel.findOne({ _id: id });
    if (project.admin_id != req.session.user.id) {
      return res.status(301).json({ msg: 'user is not aloud of this project' })
    }
    let data = await ProjectModel.updateOne({ _id: id }, req.body);

    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})


// Just admin can deleted the project
router.delete("/:id", authAdmin, async (req, res) => {
  try {
    let id = req.params.id;
    let data = await ProjectModel.deleteOne({ _id: id });
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})




module.exports = router;