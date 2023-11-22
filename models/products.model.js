const mongoose = require("mongoose");
const {Schema} = mongoose;
const productSchema = new Schema ({
    name:{
        type: String,
        required: true,
        trim : true ,
    },
    price:{
        type: Number,
        required : true,
    },
    description:{
        type: String,
    },
    images:{
        type: [String],
        required: true
    },
    countInStock:{
        type: Number,
        required: true,
        // validate: {
        //     validator: function (countInStock) {
        //         return countInStock > 0;
        //     },
        //     message: 'Cần ít nhất có 1 sản phẩm trong cửa hàng',
        // },
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    numReviews: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Review",
        },
    ],



},{ timestamps: true }
);

const Product = mongoose.model("Product",productSchema);

module.exports= Product;