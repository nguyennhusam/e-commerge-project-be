const express = require('express');
const mongoose = require('mongoose');
const dbConfig = require('./config/db.config');
const auth=require('./middlewares/auth');
// const errors = require('./middlewares/errors');
const {unless} = require('express-unless');
const dotenv = require('dotenv');
const app = express();

const cors = require("cors");


app.use(
    cors({
        credentials: true,
        origin: true,
    }),
);

app.options('*', cors({ credentials: true, origin: true }));

dotenv.config();
mongoose.Promise = global.Promise;
// mongoose.connect(process.env.MONGO,{
//     useNewUrlParser: true,
//     useUnifiedTopology: true,

// }).then(
//     ()=>{
//         console.log('Database Connected');
//     },(error) =>{
//         console.log("Database can't be connected: "+ error);
//     }
// );

mongoose.connect(dbConfig.db,{
    useNewUrlParser: true,
    useUnifiedTopology: true,

}).then(
    ()=>{
        console.log('Database Connected');
    },(error) =>{
        console.log("Database can't be connected: "+ error);
    }
);

app.use(express.json());
app.use("/users", require("./routes/users.routes"));
app.use("/products", require("./routes/products.routes"));
app.use("/review", require("./routes/reviews.routes"));
app.use("/orders", require("./routes/orders.routes"));
app.use("/carts", require("./routes/carts.routes"));


auth.authenticateToken.unless = unless;
app.use(
    (req, res, next) => {
        auth.authenticateToken.unless({
            path: [
                {url: "/users/login", methods:["POST"]},
                {url: "/users/register", methods:["POST"]},
                {url: "/review/new/:productId", methods:["POST"]},
                {url: "/products/getallproduct", methods:["GET"]},
                {url: "/products/getproductbyid/:id", methods:["GET"]},
                

                {url: "carts/updproductInCart/:cartID", methods:["POST"]},
                {url: "/carts/delproductInCart/:id/:productId", methods:["DELETE"]},
                
            ],
        })(req, res, next);
    }
);










app.use((err, req, res, next) => {
    const statusCode = err.status || 500;  
    console.error('Error:', err.message);
    res.status(statusCode).json({
        message: err.message
    });
});

// app.use(errors.errorHandler);
app.listen(process.env.port || 4000 , function(){
    console.log("Ready!");
});





// index -> route -> controller -> service -> model 
