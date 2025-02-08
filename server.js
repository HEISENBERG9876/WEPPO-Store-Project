const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const session = require("express-session");
const path = require('path');

const indexRoutes = require("./routes/index");
const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");
const adminRoutes = require("./routes/admin");

const app = express();
const pool = require("./config/db");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "12234fgwegwergerrge43afwewrgx54",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.get('/login', (req, res) => {
    res.render('login', { user: req.session.user });
});


app.get('/register', (req, res) => {
    res.render('register', { user: req.session.user });
});

app.use('/', indexRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 8500;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
