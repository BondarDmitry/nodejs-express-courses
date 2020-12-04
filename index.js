// import express from "express";
const express = require("express");
const path = require("path");
const Handlebars = require("handlebars");
const exphbs = require("express-handlebars");
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const homeRoutes = require("./routes/home");
const addRoutes = require("./routes/add");
const coursesRoutes = require("./routes/courses");
const cardRoutes = require("./routes/card");
const ordersRoutes = require("./routes/orders");
const authRoutes = require("./routes/auth");
const mongoose = require("mongoose");
const {
    allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const User = require("./models/user");
const varMiddleware = require("./middleware/variables");
const userMiddleware = require("./middleware/user");

const MONGODB_URI = `mongodb+srv://dmitry:${pass}@cluster0.hzxmo.mongodb.net/shop`;

const app = express();

const hbs = exphbs.create({
    defaultLayout: "main",
    extname: "hbs",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
});

const store = new MongoStore({
    collection: "sessions",
    uri: MONGODB_URI,
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
// app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: "some secret value",
        resave: false,
        saveUninitialized: false,
        store,
    })
);

app.use(varMiddleware);
app.use(userMiddleware);

app.use("/", homeRoutes);
app.use("/add", addRoutes);
app.use("/courses", coursesRoutes);
app.use("/card", cardRoutes);
app.use("/orders", ordersRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 4000;

async function start() {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        });

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
}

start();
