const createError = require("../middlewares/error");
const User = require("../models/users.model");
const Cart = require("../models/carts.model");
const Order = require("../models/orders.model");
const Product = require("../models/products.model");


exports.createOrder = async (req,res,next)=>{
    try {
        const userID = req.user._id;
        const listProductCheckout = req.body.listProduct;
        const listIDProduct = listProductCheckout.map((product) => product.id);
        console.log("ListProduct " + listIDProduct);
        const shipAddress = req.body.shipAddress;

        const listProduct = await Promise.all(listProductCheckout.map((product) => Product.findById(product.id)));
        for (let i = 0; i < listProduct.length; i++) {
            console.log("ListProduct " , listProductCheckout);
            if (listProduct[i].countInStock < listProductCheckout[i].quantity) {
                return res.status(422).send({
                    success: false,
                    message: "Số lượng sản phẩm trong kho không đủ để đáp ứng nhu cầu của bạn!"
                })
            }
            await Product.findByIdAndUpdate(
                listProduct[i]._id,
                {
                    $inc: {
                        countInStock: -listProductCheckout[i].quantity
                    }
                },
                { new: true }
            );

        }
        const totalPrice = listProductCheckout.reduce((acc, product, index) => {
            return acc + product.quantity * listProduct[index].price;
        }, 0);
        

        // CART INFO OF USER
        const cartByUser = await Cart.findOne({
            user: userID
        });

        const newOrder = new Order({
            user: userID,
            productItem: listProductCheckout,
            shipAddress: shipAddress,
            total: totalPrice
        });
        const saveOrder = await newOrder.save();

        const newCart = await Cart.findByIdAndUpdate(
            cartByUser._id,
            { $pull: { productItem: { id: { $in: listIDProduct } } } },
            { new: true }
        )
        newCart.total = newCart.productItem.reduce((acc, cur) => cur.quantity * cur.price, 0);
        await newCart.save();

        res.status(200).send({
            success: true,
            data: saveOrder
        });
    } catch (err) {
        next(err);
    }
};
