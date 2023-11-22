const cartController = require("../controllers/carts.controller");
const auth = require("../middlewares/auth");
const express = require("express");
const router = express.Router();

// CREATE
router.post("/addproductInCart/:productId",auth.authenticateToken,cartController.createCart, cartController.addProductItemInCart);
router.delete("/delproductInCart/:id/:productId", cartController.deleteProductItemInCart);
router.post("/updproductInCart/:cartID", cartController.updateQuantityProductItemInCart);
router.get("/getAll",auth.authenticateToken,  cartController.getCartByID);



module.exports = router;