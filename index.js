// import express from "express";
const express = require("express");
const path = require("path");
const Handlebars = require("handlebars");
const exphbs = require("express-handlebars");
const homeRoutes = require("./routes/home");
const addRoutes = require("./routes/add");
const coursesRoutes = require("./routes/courses");
const cardRoutes = require("./routes/card");
const ordersRoutes = require("./routes/orders");
const mongoose = require("mongoose");
const {
    allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const User = require("./models/user");

const app = express();

const hbs = exphbs.create({
    defaultLayout: "main",
    extname: "hbs",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

app.use(async (req, res, next) => {
    try {
        const user = await User.findById("5fc7a9249236f2305f36a48b");
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
    }
});

app.use(express.static(path.join(__dirname, "public")));
// app.use("/public", express.static(__dirname + "/public"));

app.use(express.urlencoded({ extended: true }));

app.use("/", homeRoutes);
app.use("/add", addRoutes);
app.use("/courses", coursesRoutes);
app.use("/card", cardRoutes);
app.use("/orders", ordersRoutes);

const PORT = process.env.PORT || 4000;

async function start() {
    try {
        const pass = "eTZiVn69r8IVDo9J";
        const url = `mongodb+srv://dmitry:${pass}@cluster0.hzxmo.mongodb.net/shop`;
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        });

        const candidate = await User.findOne();
        if (!candidate) {
            const user = new User({
                email: "dmitry@gmail.com",
                name: "Dmitry",
                cart: {
                    items: [],
                },
            });

            await user.save();
        }
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
}

start();
