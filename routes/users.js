'use strict';


const express = require("express");
// 
const bcrypt = require("bcrypt");
// password encryption
const { auth, authAdmin } = require("../middlewares/auth")

const { UserModel, validateUser, validateLogin, createToken } = require("../models/userModel")

const router = express.Router();


// Geting the massege :
router.get("/", async (req, res) => {
  res.json({ msg: "Users work" });
})

// Geting the user info 
router.get("/userInfo", auth, async (req, res) => {
  try {
    let user = await UserModel.findOne({ _id: req.tokenData._id }, { password: 0 });
    res.json(user);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})



router.get("/allUsers", authAdmin, async (req, res) => {

  let perPage = Math.min(req.query.perPage, 20) || 5;
  let page = req.query.page - 1 || 0;
  let sort = req.query.sort || "_id"

  let reverse = req.query.reverse == "yes" ? 1 : -1
  try {
    let data = await UserModel
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


// Add new user 
// by the user schema
router.post("/", async (req, res) => {
  let validBody = validateUser(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let user = new UserModel(req.body);

    // Hide the password and encryption level :
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();

    // show the "***" insted the passwords
    user.password = "***"
    res.json(user);
  }
  catch (err) {
    if (err.code == 11000) {
      return res.status(400).json({ msg: "Email already in system", code: 11000 })
    }
    console.log(err);
    res.status(502).json({ err })
  }
})


// User log in 
router.post("/logIn", async (req, res) => {
  let validBody = validateLogin(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }

  try {
    // check if the email is in the sistem
    let user = await UserModel.findOne({ email: req.body.email })
    if (!user) {
      return res.status(401).json({ msg: "Email Worng." })
    }
    // Check if the password is correct
    let validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(401).json({ msg: "Password Worng." })
    }
    req.session.user = user;

    // create a token key for the user
    let token = createToken(user._id, user.role)

    res.json({ token })
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})


module.exports = router;