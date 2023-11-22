const bcryptjs =require("bcryptjs");
const User = require("../models/users.model");
const auth = require("../middlewares/auth");



exports.register = async (req, res, next) => {
    try {
        const {username , password, email } = req.body;

        const salt = bcryptjs.genSaltSync(10);

        req.body.password = bcryptjs.hashSync(password, salt);

        if(username ===  undefined || username === ""){
            return res.status(404).send({
                success: false,
                message:"Vui lòng nhập username để đăng kí"
            })
        };

        const user = await User.findOne({ username });

        if (user) {
            return res.status(201).send({
                success: false,
                message: "Username đã tồn tại vui lòng đăng kí mới"
            })
        };

        const newUser = new User({
            username: username,
            password: req.body.password,
            email: email,
        });
        const saveUser = await newUser.save();
        if (!saveUser) {
            return res.status(404).send({
                success: false,
                message: "Đăng Ký User Mới Không Thành Công!"
            });
        }
        res.status(200).send({
            success: true,
            message: "Đăng Ký User Mới Thành Công!",
            data: newUser
        });
    } catch (err) {
        next(err);
    }
};


exports.login = async (req, res, next) => {
    try {
        const {username, password} = req.body;
        if (username === "" || password === ""){
            return res.status(201).send({
                success: false,
                message:" Vui lòng nhập đầy đủ các trường!"
            });
        }
        
        const resultUser = await User.findOne({username});
        console.log(resultUser.role);
        if (!resultUser) {
            return res.status(201).send({
                success: false,
                message: "Người dùng không tồn tại!"
            });
        }

        const isCorrectPassword = bcryptjs.compareSync(req.body.password, resultUser.password);
        console.log(isCorrectPassword)
        if (!isCorrectPassword) return res.status(201).send({
            success: false,
            message: "Sai mật khẩu!"
        });

        if (isCorrectPassword && resultUser){
            const access_token = auth.generateAccessToken(resultUser._id); 
            // const { password, createdAt, updatedAt, _v , role , ...others} = resultUser._doc;
            return res.status(200).json({ ...resultUser.toJSON(), access_token });
            
        }

            
    } catch (err) {
        return next(err);
    }
};
