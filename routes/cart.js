const express = require("express");
const pool = require("../config/db");

const router = express.Router();


router.post("/add", async (req, res) => {
    const {productId, quantity, price } = req.body;

    if (quantity <= 0) {
        return res.status(400).json({ error: "Quantity must be greater than 0" });
    }

    try {
        console.log("User id: " + req.session.user.id)
        const result = await pool.query(
            "INSERT INTO cart_items (user_id, product_id, quantity, price) VALUES ($1, $2, $3, $4) RETURNING *",
            [req.session.user.id, productId, quantity, price]
        );
        res.redirect("/");
    } catch (err) {
        console.error("Error adding item to cart:", err);
        res.status(500).json({ error: "Error adding item to cart" });
    }
});


router.get("/view", async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    const userId = req.session.user.id;
    try {
        const result = await pool.query(
            `SELECT p.*, c.Quantity 
            FROM Cart_Items c 
            JOIN Products p ON c.Product_Id = p.Id 
            WHERE c.User_Id = $1`, 
            [userId]
        );
        const cartItems = result.rows;
        res.render("cart", { cartItems, user: req.session.user });
    } catch (err) {
        console.error("Error fetching cart items:", err);
        res.status(500).send("Error fetching cart.");
    }
});


module.exports = router;
