const reviewController = require("../controllers/reviews.controller");
const auth = require("../middlewares/auth");
const express = require("express");
const router = express.Router();

// CREATE
router.post("/new/:productId",auth.authenticateToken, reviewController.createReview);
router.get("/:productId", reviewController.getReview);

// // GET ALL REVIEW BY SHOE ID
// router.get("/getAll/:reviewID", reviewController.getAllReviewByShoeID);


module.exports = router;