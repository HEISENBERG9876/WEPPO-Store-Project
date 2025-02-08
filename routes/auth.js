const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../config/db");

const router = express.Router();


router.post("/register", async (req, res) => {
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            console.error("❌ Validation Error: Missing username or password");
            return res.status(400).json({ error: "Username and password are required" });
        }

        const result = await pool.query("SELECT * FROM Users WHERE Username = $1", [username]);
        
        if (result.rows.length > 0) {
            return res.status(409).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const insertResult = await pool.query(
            "INSERT INTO Users (Username, Password, Is_Admin) VALUES ($1, $2, $3) RETURNING *",
            [username, hashedPassword, username === 'admin']
        );
        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});


router.post("/login", async (req, res) => {
    console.log("Request body:", req.body);
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        const result = await pool.query("SELECT * FROM Users WHERE Username = $1", [username]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        console.log("User.password:" + user.password)
        if (!password || !user.password) {
            return res.status(400).json({ error: "Missing password data" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        req.session.user = { id: user.id, username: user.username, isLoggedIn: true, isAdmin: user.is_admin };

        res.status(200).json({ 
            message: "Login successful", 
            isAdmin: user.is_admin 
        });

    } catch (err) {
        res.status(500).json({ error: "Error logging in" + err });
    }
});


router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: "Error logging out" });
        }
        res.redirect("/");
    });
});

router.get("/isLoggedIn", (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, username: req.session.user.username });
    } else {
        res.json({ loggedIn: false });
    }
});

module.exports = router;
