const { Router } = require("express");
const Order = require("../models/order");
const router = Router();
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
    try {
        const orders = await Order.find({
            "user.userId": req.user._id,
        }).populate("user.userId");

        res.render("orders", {
            isOrder: true,
            title: "Заказы",
            orders: orders.map((o) => ({
                ...o._doc,
                price: o.courses.reduce((total, c) => {
                    return (total += c.count * c.course.price);
                }, 0),
            })),
        });
    } catch (error) {
        console.log(error);
    }
});

router.post("/", auth, async (req, res) => {
    try {
        const user = await req.user
            .populate("cart.items.courseId")
            .execPopulate();
        const courses = user.cart.items.map((c) => ({
            count: c.count,
            course: { ...c.courseId._doc },
        }));
        const order = new Order({
            user: {
                name: req.user.name,
                userId: req.user,
            },
            courses,
        });
        await order.save();
        await req.user.clearCart();
        res.redirect("/orders");
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
