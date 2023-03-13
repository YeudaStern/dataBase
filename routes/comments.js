const express = require("express");
const { auth, authAdmin } = require("../middlewares/auth");
const { CommentsModel, validateComments } = require("../models/commentsModel")
const router = express.Router();

router.get("/", async (req, res) => {
    res.json({ msg: "Comments work" });
})


//! Show all comments by project

router.get("/allComments", auth, async (req, res) => {

    let perPage = Math.min(req.query.perPage, 20) || 5;
    let page = req.query.page - 1 || 0;
    let sort = req.query.sort || "_id"

    const projectId = req.session.project._id;

    let reverse = req.query.reverse == "yes" ? 1 : -1
    try {
        let data = await CommentsModel
            .find({ project_id: projectId })

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



router.post("/", auth, async (req, res) => {
    let validBody = validateComments(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let comment = new CommentsModel(req.body);

        comment.user_id = req.tokenData._id;
        await comment.save();
        res.status(201).json(comment);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})


router.put("/:id", auth, async (req, res) => {
    let validBody = validateComments(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let id = req.params.id;

        let data;
        if (req.tokenData.role == "admin") {
            data = await CommentsModel.updateOne({ _id: id }, req.body);
        }

        else {
            data = await CommentsModel.updateOne({ _id: id, user_id: req.tokenData._id }, req.body);
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
            data = await CommentsModel.deleteOne({ _id: id }, req.body);
        }
        else {
            data = await CommentsModel.deleteOne({ _id: id, user_id: req.tokenData._id }, req.body.data);
        }
        res.json(data)
    }

    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})


module.exports = router;