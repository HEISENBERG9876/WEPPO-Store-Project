const express = require("express");
const pool = require("../config/db");

const router = express.Router();


router.get("/products", async (req, res) => {
    if (!req.session.user || !req.session.user.isAdmin) {
        return res.status(403).send("Unauthorized");
    }

    try {
        const result = await pool.query("SELECT * FROM products");
        res.render("admin/products", { products: result.rows, user: req.session.user });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("Error fetching products.");
    }
});


router.get('/products/add', async (req, res) => {
    res.render('admin/add_product', { user: req.user });
});

router.post('/products/add', async (req, res) => {
    const { name, description, price } = req.body;
    console.log('Request Body:', req.body);

    try {
        await pool.query(
            'INSERT INTO products (name, description, price) VALUES ($1, $2, $3)',
            [name, description, price]
        );
        res.redirect('/api/admin/products');
    } catch (err) {
        console.error('Error adding product:', err);
        res.status(500).send('Server error');
    }
});


router.get("/products/edit/:id", async (req, res) => {
    if (!req.session.user || !req.session.user.isAdmin) {
        return res.status(403).send("Unauthorized");
    }

    const productId = req.params.id;

    try {
        const result = await pool.query("SELECT * FROM Products WHERE Id = $1", [productId]);
        const product = result.rows[0];

        if (!product) {
            return res.status(404).send("Product not found");
        }

        res.render("admin/edit_product", { product: product, user: req.session.user });
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).send("Error fetching product.");
    }
});


router.post("/products/edit/:id", async (req, res) => {
    const productId = req.params.id;
    const { name, description, price } = req.body;

    try {
        const result = await pool.query(
            "UPDATE products SET name = $1, description = $2, price = $3 WHERE id = $4 RETURNING *",
            [name, description, price, productId]
        );

        if (!result.rows[0]) {
            return res.status(404).send("Product not found");
        }

        res.redirect("/api/admin/products");
    } catch (err) {
        console.error("Error updating product:", err);
        res.status(500).send("Error updating product");
    }
});


router.post("/products/delete/:id", async (req, res) => {
    if (!req.session.user || !req.session.user.isAdmin) {
        return res.status(403).send("Unauthorized");
    }

    const productId = req.params.id;

    try {
        await pool.query("DELETE FROM Products WHERE Id = $1", [productId]);
        res.redirect("/api/admin/products");
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).send("Error deleting product.");
    }
});

router.post("/products", async (req, res) => {
    const { name, description, price } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO Products (Name, Description, Price) VALUES ($1, $2, $3) RETURNING *",
            [name, description, price]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Error adding product" });
    }
});


router.put("/products/:id", async (req, res) => {
    const { id } = req.params;
    const { name, description, price } = req.body;
    try {
        const result = await pool.query(
            "UPDATE Products SET Name = $1, Description = $2, Price = $3 WHERE Id = $4 RETURNING *",
            [name, description, price, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Error updating product" });
    }
});


router.delete("/products/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("DELETE FROM Products WHERE Id = $1", [id]);
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Error deleting product" });
    }
});


router.get("/users", async (req, res) => {
    if (!req.session.user || !req.session.user.isAdmin) {
        return res.status(403).send("Unauthorized");
    }

    try {
        const result = await pool.query("SELECT * FROM Users");
        res.render("admin/users", { users: result.rows, user: req.session.user });
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).send("Error fetching users.");
    }
});


router.get("/users/edit/:id", async (req, res) => {
    if (!req.session.user || !req.session.user.isAdmin) {
        return res.status(403).send("Unauthorized");
    }

    const userId = req.params.id;

    try {
        const result = await pool.query("SELECT * FROM Users WHERE id = $1", [userId]);
        const user = result.rows[0];

        if (!user) {
            return res.status(404).send("User not found");
        }

        res.render("admin/edit_user", { user: user, currentUser: req.session.user });
    } catch (err) {
        console.error("Error fetching user:", err);
        res.status(500).send("Error fetching user.");
    }
});


router.post("/users/edit/:id", async (req, res) => {
    const userId = req.params.id;
    const { username, isAdmin } = req.body;

    try {
        await pool.query(
            "UPDATE Users SET username = $1, is_admin = $2 WHERE id = $3",
            [username, isAdmin === 'on', userId]
        );
        res.redirect("/api/admin/users");
    } catch (err) {
        console.error("Error updating user:", err);
        res.status(500).send("Error updating user.");
    }
});


router.post("/users/delete/:id", async (req, res) => {
    if (!req.session.user || !req.session.user.isAdmin) {
        return res.status(403).send("Unauthorized");
    }

    const userId = req.params.id;

    try {
        await pool.query("DELETE FROM Users WHERE id = $1", [userId]);
        res.redirect("/api/admin/users");
    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).send("Error deleting user.");
    }
});


router.get("/orders", async (req, res) => {
    if (!req.session.user || !req.session.user.isAdmin) {
        return res.status(403).send("Unauthorized");
    }

    try {
        const result = await pool.query(`
            SELECT o.id AS order_id, o.user_id, o.order_date, o.total_price, 
                ARRAY_AGG(p.name) AS product_names, 
                SUM(oi.quantity * oi.price) AS total_price_calculated
            FROM Orders o
            JOIN Order_Items oi ON o.id = oi.order_id
            JOIN Products p ON oi.product_id = p.id
            GROUP BY o.id
        `);

        result.rows.forEach(order => {
            order.total_price = order.total_price || order.total_price_calculated;
        });

        res.render("admin/orders", { orders: result.rows, user: req.session.user });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).send("Error fetching orders.");
    }
});

router.post("/orders/delete/:id", async (req, res) => {
    if (!req.session.user || !req.session.user.isAdmin) {
        return res.status(403).send("Unauthorized");
    }

    const orderId = req.params.id;

    try {
        await pool.query("DELETE FROM Orders WHERE id = $1", [orderId]);
        res.redirect("/api/admin/orders");
    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).send("Error deleting order.");
    }
});




module.exports = router;
