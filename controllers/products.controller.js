const createError = require("../middlewares/error");
const Product = require("../models/products.model");
const Review = require("../models/reviews.model");
const cloudinary = require('cloudinary').v2;
const mongoose = require("mongoose");


exports.getAllProduct = async (req, res, next) => {
    try {
        
        const listProduct = await Product.find().select('-__v -createdAt -updatedAt');
        
        return res.status(200).send({
            success: true,
            message: "Thành công",
            data: listProduct,
        });
    } catch (err) {
        next(err);
    }
};

exports.getProductByID = async (req, res, next) => {
    try {
        const productID = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(productID)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID'
            });
        }
        const productInfo = await Product.findById(productID);
        if (!productInfo) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm'
            });
        }
        return res.status(200).json({
            success: true,
            message: productInfo});
    } catch (err) {
        next(err);
    }
};

exports.createProduct = async (req,res,next)=>{
    try {
        if(req.body.countInStock <= 0 ){
            return res.status(500).json({
                success: false,
                message:"Yêu cầu sản phẩm từ 1 trở lên",
            })
        }
        // Lấy link ảnh từ Cloudinary (đã upload trc đó)
        req.body.images = req.files.map((file) => file.path);

        const existProduct = await Product.findOne({ name: req.body.name })
        if (existProduct) {
            const updatedProduct = await Product.findByIdAndUpdate(
                existProduct._id,
                {
                    price: req.body.price,
                    description: req.body.description,
                    colors: req.body.colors,
                    images: req.body.images
                },
                { new: true }
            )
            return res.status(200).json({
                success: true,
                message: "Tạo sản phẩm thành công",
                data: updatedProduct});
        }

        const newProduct = new Product(req.body);

        const saveProduct = await newProduct.save();

        return res.status(200).json({
            success: true,
            data: saveProduct
        });
    } catch (err) {
        next(err);
    }
};
exports.updateProduct = async (req,res,next)=>{
    try {
        const productID = req.params.id;

        if (req.files) {
            req.body.images = req.files.map((file) => file.path);
        }

        const saveProduct = await Product.findByIdAndUpdate(productID, { $set: req.body }, { new: true });

        return res.status(200).send({
            success: true, 
            message: "Update thành công",
            data: saveProduct});
    } catch (err) {
        next(err);
    }
};

exports.deleteProduct = async (req,res,next)=>{
    try {
        const Productid = req.params.id;
        const productInfo = await Product.findById(Productid);
        if (!productInfo) {
            return next(createError(404, 'Sản phẩm cần xóa không tồn tại!'));
        
        }

        // await Promise.all(productInfo.reviews.map((review) => Review.findByIdAndDelete(review)));
        if (productInfo.reviews && productInfo.reviews.length > 0) {
            await Promise.all(productInfo.reviews.map(async (review) => {
                await Review.findByIdAndDelete(review);
            }));
        }
        const deleteproduct = await Product.findByIdAndDelete(Productid);
         return res.status(200).send({
            success: true,
            message: 'Sản phẩm đã được xóa thành công!'});
       
    } catch (err) {
        next(err);
    }
};






