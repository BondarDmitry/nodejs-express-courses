const { Router } = require("express");
const router = Router();
const Course = require("../models/course");

router.get("/", (req, res) => {
    res.render("add", {
        title: "Добавить Курс",
        isAdd: true,
    });
});

router.post("/", async (req, res) => {
    const coures = new Course(req.body.title, req.body.price, req.body.image);
    await coures.save();
    res.redirect("/courses");
});

module.exports = router;
