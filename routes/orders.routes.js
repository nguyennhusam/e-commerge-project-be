const orderController = require("../controllers/orders.controller");
const auth = require("../middlewares/auth");
const express = require("express");
const router = express.Router();

// CREATE
router.post("/createOrder/:productId",auth.authenticateToken, orderController.createOrder);

// // UPDATE
// router.post("/updateOrder/:productId",auth.authenticateToken, orderController.updateOrder);

// // DELETE
// router.delete("/deleteOrder/:productId",auth.authenticateToken, orderController.deleteOrder);

// // GET ALL REVIEW BY SHOE ID
// router.get("/getAll/:reviewID", reviewController.getAllReviewByShoeID);


module.exports = router;