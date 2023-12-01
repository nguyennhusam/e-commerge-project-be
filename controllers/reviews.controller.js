const Product = require("../models/products.model");
const User = require("../models/users.model");
const Review = require("../models/reviews.model");
const { createError } = require("../middlewares/error");


exports.getReview = async (req, res) =>{
  try {
    const productId = req.params.productId;
    const product = await Product.findOne({ _id: productId}).populate({
      path: 'reviews',
      populate: {
        path: 'owner',
        select: 'username'
      }
    })
    if (!product) return createError(404, "Không tìm thấy sản phẩm");
    
    return res.json(product);
  } catch (error) {
    return res.json(error.message);
  }
}
exports.createReview = async (req, res) => {
  const ProductId = req.params.productId;
  const { content, rating } = req.body;
  const userId = req.user._id;


  const product = await Product.findOne({ _id: ProductId});
  if (!product) return createError(404, "Không tìm thấy sản phẩm");

  const isAlreadyReview = await Review.findOne({
    owner: userId,
    parentProduct: ProductId,
  });
  if (isAlreadyReview)
  {return res.status(200).json({
    success: false,
    message: "Sản phẩm bạn đã được đánh giá"
  });}

  const newReview = new Review({
    owner: userId,
    parentProduct: ProductId,
    content: content ,
    rating: rating,
  });

  //updating product review
  product.reviews.push(newReview._id);
  await product.save();

  //saving new review
  await newReview.save();
  const productInfo = await Product.findById(req.params.productId);

  let averageRating = 0;
      const listReviews = await Promise.all(productInfo.reviews.map((review) => Review.findById(review)));
      const totalRating = await listReviews.reduce((total, review) => total + review.rating, 0);
      const totalReview = listReviews.length;
      if (totalReview !== 0) {
          averageRating = (totalRating / totalReview).toFixed(2);
      }

      const saveProduct = await Product.findByIdAndUpdate(
          ProductId,
          {
              $set: {
                  rating: averageRating,
                  numReviews: totalReview,
              },
          },
          { new: true },
      );

  return res.status(200).json({
    message: "Sản phẩm đã thêm thành công",
    data: newReview,
  });
};