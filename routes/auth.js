const { Router } = require("express");
const User = require("../models/user");
const router = Router();

router.get("/login", async (req, res) => {
    res.render("auth/login", {
        title: "Авторизация",
        isLogin: true,
    });
});

router.get("/logout", async (req, res) => {
    // req.session.isAuthenticated = false;
    req.session.destroy(() => {
        res.redirect("/auth/login#login");
    });
});

router.post("/login", async (req, res) => {
    const user = await User.findById("5fc7a9249236f2305f36a48b");
    req.session.user = user;
    req.session.isAuthenticated = true;
    req.session.save((error) => {
        if (error) throw error;
        res.redirect("/");
    });
});

module.exports = router;
