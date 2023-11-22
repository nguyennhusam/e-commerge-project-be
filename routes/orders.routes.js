const orderController = require("../controllers/orders.controller");
const auth = require("../middlewares/auth");
const express = require("express");
const router = express.Router();

// CREATE
router.post("/createOrder",auth.authenticateToken, orderController.createOrder);




module.exports = router;