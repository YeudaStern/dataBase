const express = require("express");
const { authAdmin, authConstructor, auth } = require("../middlewares/auth");
const { validateProject, ProjectModel } = require("../models/projectsModel")
const router = express.Router();

router.get("/", async (req, res) => {
  res.json({ msg: "Project info work" });
})


//?Only admin can see all projects 
router.get("/allProjects", authAdmin, async (req, res) => {

  let perPage = Math.min(req.query.perPage, 20) || 5;
  let page = req.query.page - 1 || 0;
  let sort = req.query.sort || "_id"

  let reverse = req.query.reverse == "yes" ? 1 : -1
  try {
    let data = await ProjectModel
      .find({})

      .limit(perPage)

      .skip(page * perPage)

      .sort({ [sort]: reverse })


    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})

//?Costumer can see only his projects
router.get("/costumerProjects", auth, async (req, res) => {

  let perPage = Math.min(req.query.perPage, 20) || 5;
  let page = req.query.page - 1 || 0;
  let sort = req.query.sort || "_id"
  
  const costumerId = req.session.user._id;

  let reverse = req.query.reverse == "yes" ? 1 : -1
  try {
    let data = await ProjectModel
      .find({users_id : costumerId})

      .limit(perPage)

      .skip(page * perPage)

      .sort({ [sort]: reverse })


    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})



// ?Construcror can see only his projects
router.get("/constructorProjects", authConstructor, async (req, res) => {

  let perPage = Math.min(req.query.perPage, 20) || 5;
  let page = req.query.page - 1 || 0;
  let sort = req.query.sort || "_id"

  const constructorId = req.session.user._id;

  let reverse = req.query.reverse == "yes" ? 1 : -1
  try {
    let data = await ProjectModel
      .find({user_manager_id : constructorId})

      .limit(perPage)

      .skip(page * perPage)

      .sort({ [sort]: reverse })


    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})

//? Create a new projecrs, and only "admin" can add new.
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


//? All the users can edit the projects
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

//! edit project by user id 


//? Just admin can deleted the project
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