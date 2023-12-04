const productController = require("../controllers/products.controller");
const express = require("express");
const router = express.Router();
const uploadCloud = require("../middlewares/multer");
const auth = require("../middlewares/auth");


router.get("/getallproduct", productController.getAllProduct);
router.get("/getproductbyid/:id", productController.getProductByID);

router.post("/cre-product",auth.verifyTokenAndAdmin,uploadCloud.array('images'), productController.createProduct);
router.post("/upd-product/:id",auth.verifyTokenAndAdmin,uploadCloud.array('images'), productController.updateProduct);
router.delete("/del-product/:id", auth.verifyTokenAndAdmin, productController.deleteProduct);



module.exports = router;