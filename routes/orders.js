const express = require("express");
const pool = require("../config/db");

const router = express.Router();


router.get("/place", async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    const userId = req.session.user.id;

    try {
        const result = await pool.query(
            `SELECT * FROM Cart_Items WHERE User_Id = $1`, [userId]
        );
        const cartItems = result.rows;

        if (cartItems.length === 0) {
            return res.redirect('/cart/view');
        }

        const totalPrice = cartItems.reduce((sum, item) => {
            return sum + (item.quantity * item.price);
        }, 0);


        const orderResult = await pool.query(
            `INSERT INTO orders (user_Id, total_Price) 
             VALUES ($1, $2) RETURNING id`, [userId, totalPrice]
        );
        const orderId = orderResult.rows[0].id;

        for (let item of cartItems) {
            await pool.query(
                `INSERT INTO order_items (order_id, product_id, quantity, price) 
                 VALUES ($1, $2, $3, $4)`,
                [orderId, item.product_id, item.quantity, item.price]
            );
        }

        await pool.query(`DELETE FROM cart_items WHERE user_id = $1`, [userId]);

        res.redirect('/');
    } catch (err) {
        console.error("Error placing order:", err);
        res.status(500).send("Error placing order.");
    }
});


module.exports = router;
