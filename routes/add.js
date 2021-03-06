const { Router } = require("express");
const { validationResult } = require("express-validator");
const router = Router();
const Course = require("../models/course");
const auth = require("../middleware/auth");
const { courseValidators } = require("../utils/validators");

router.get("/", auth, (req, res) => {
    res.render("add", {
        title: "Добавить Курс",
        isAdd: true,
    });
});

router.post("/", auth, courseValidators, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status("422").render("add", {
            title: "Добавить Курс",
            isAdd: true,
            error: errors.array()[0].msg,
            data: {
                title: req.body.title,
                price: req.body.price,
                image: req.body.image,
            },
        });
    }
    // const coures = new Course(req.body.title, req.body.price, req.body.image);
    const course = new Course({
        title: req.body.title,
        price: req.body.price,
        image: req.body.image,
        userId: req.user,
    });

    try {
        await course.save();
        res.redirect("/courses");
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
