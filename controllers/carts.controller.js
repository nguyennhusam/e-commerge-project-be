const createError = require("../middlewares/error");
const User = require("../models/users.model");
const Cart = require("../models/carts.model");
const Order = require("../models/orders.model");
const Product = require("../models/products.model");

exports.addProductItemInCart = async (req,res,next)=>{
    try {

        const userID = req.user._id;
        const productID = req.params.productId;

        const cartExist = await Cart.findOne({user: userID});

        const productExist = await Cart.findOne(
            {
                _id: cartExist._id,
                productItem: { $elemMatch: { id: productID } }
            }
        );
        // ADD ITEM
        let addItem = null;
        if (productExist) {
            addItem = await Cart.findOneAndUpdate(
                { _id: cartExist._id, productItem: { $elemMatch: { id: productID } } },
                { $set: { "productItem.$": req.body } },
                { new: true }
            );
        } else {
            addItem = await Cart.findByIdAndUpdate(
                cartExist._id,
                { $push: { productItem: req.body } },
                { new: true }
            );
        }

        if (!addItem) return next(createError(404, "Thêm sản phẩm vào Giỏ hàng thất bại!"));

        res.status(200).send("Thêm sản phẩm vào Giỏ hàng thành công!");
    } catch (err) {
        next(err);
    } 
};

exports.updateQuantityProductItemInCart = async (req, res, next) => {
    try {
        const cartID = req.params.cartID;
        const productID = req.body.productId;
        const quantity = req.body.quantity;

        const saveCart = await Cart.findOneAndUpdate(
            { _id: cartID, productItem: { $elemMatch: { id: productID } } },
            { $set: { "productItem.$.quantity": quantity } },
            { new: true }
        );

        res.status(200).send({
            success: true,
            data: saveCart
        })
    } catch (err) {
        next(err);
    }
}


exports.deleteProductItemInCart = async (req, res, next) => {
    try {
        const cartID = req.params.id;
        const productID = req.params.productId;
        const cartExist = await Cart.findById(cartID);
        if (!cartExist) return next(createError(404, "Giỏ hàng không tồn tại!"));

        const deleteItem = await Cart.findByIdAndUpdate(
            cartID,
            { $pull: { productItem: { id: productID } } },
            { new: true }
        );

        if (!deleteItem) return next(createError(404, "Sản phẩm muốn xóa, không tồn tại trong Giỏ hàng!"));

        res.status(200).send("Xóa sản phẩm ra khỏi Giỏ hàng thành công!");
    } catch (err) {
        next(err);
    }
}






exports.createCart = async (req,res, next) =>{
    try{
        const userID = req.user._id;
        const productID = req.params.productId;
        //create cart
        const cartExist = await Cart.findOne({user: userID});
        if (!cartExist) {
            const newCart = new Cart({user: req.user._id});
            const saveCart = await newCart.save();
        }
        next();

    }catch(err){
        next(err);
    }

}

exports.updateCart = async (req, res, next) => {
    try {
        const cartID = req.params.id;
        const cartExist = await Cart.findById(cartID);

        if (!cartExist) return next(createError(404, "Giỏ hàng không tồn tại!"));

        const saveCart = await Cart.findByIdAndUpdate(
            cartID,
            { $set: req.body },
            { new: true }
        );

        res.status(200).send(saveCart);
    } catch (err) {
        next(err);
    }
}



exports.getCartByID = async (req, res, next) => {
    try {
        const cartID = req.params.id;
        const cartExist = await Cart.findById(cartID);

        if (!cartExist) return next(createError(404, "Giỏ hàng không tồn tại!"));

        res.status(200).send(cartExist);
    } catch (err) {
        next(err);
    }
}