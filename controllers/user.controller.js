const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const redis = require("../helper/index");

const registerUser = async(req, res, next) => {
    try {
        let {username, email, password} = req.body;
        const foundUser = await User.findOne({where: {username}});
        if(foundUser) res.json("Username Already Exists");
        else {
            const existingUser = await User.findOne({where: {email}});
            if(existingUser) res.json("Email Already Exists");
            else {
                bcrypt.genSalt(10, (err, salt) => {
                    if(!err) 
                    {
                        bcrypt.hash(password, salt, async(err, hash) => {
                            if(err) res.json(next(err));
                            else 
                            {
                                password = hash;
                                const user = await User.create({username, email, password});
                                res.json(user);
                            }
                        });
                    }
                });
            }
        }
    }
    catch(error) {
        res.json(next(error));
    }
}

const loginUser = async(req, res, next) => {
    try {
        let { email, password } = req.body;
        const user = await User.findOne({where: {email}});
        if(user)
        {
            bcrypt.compare(password, user.dataValues.password)
            .then((isMatch) => {
                if(!isMatch) res.json("Password is not correct");
                else 
                {
                    const accessToken = jwt.sign({id: user.dataValues.id}, process.env.JWT_SECRET, {expiresIn: 900}); // 15 mins
                    const refreshToken = jwt.sign({id: user.dataValues.id}, process.env.JWT_SECRET, {expiresIn: 3900}); // 65 mins 
                    redis.setAccessToken(accessToken, refreshToken);
                    redis.setRefreshToken(refreshToken);
                    res.cookie("token", accessToken, {
                        httpOnly: true,
                        secure: true,
                        sameSite: true,
                    });
                    res.json({username: user.dataValues.username, email});
                }
            })
            .catch((error) => {
                res.json(next(error));
            })
        }
        else res.json("Account Doesn't Exists");
    }
    catch(error) {
        res.json(next(error));
    }
}

const checkAuth = async(req, res, next) => {
    try {
        if(req.user === null) {
            res.clearCookie("token");
            res.json("INVALID")
        }
        else {
            res.json({username: req.user.username, email: req.user.email});            
        }
    }
    catch(err) {
        res.json(next(error));
    }
}

const logoutUser = async(req, res, next) => {
    try {
        console.log("MIDDLEWARE USERNAME => ", req.user.username);
        console.log("WEBSITE USERNAME => ", req.body.username);
        const user = req.user.username;
        if(user === null || user !== req.body.username) {
            res.status(401).json({Error: "You Are Not Logged In"});
        }
        else {
            const accessToken = req.cookies.token;
            console.log("ACCESS TOKEN => ", accessToken);
            const refreshToken = await redis.getRefreshTokenFromAccessToken(accessToken);
            console.log("REFRESH TOKEN => ", refreshToken);
            redis.deleteToken(accessToken);
            redis.deleteToken(refreshToken);
            res.clearCookie("token");
            res.json("Successfully Logged Out");
        }
    }
    catch(err) {
        res.json(next(err));
    }
}

const renewAccessToken = async(req, res, next) => {
    try {
        console.log("MIDDLEWARE USERNAME => ", req.user.username);
        console.log("WEBSITE USERNAME => ", req.body.username);
        const user = req.user.username;
        if(user === null || user !== req.body.username || user === undefined) {
            res.status(401).json({Error: "You Are Not Logged In"});
        }
        else {
            const accessToken = req.cookies.token;
            console.log("OLD ACCESS TOKEN => ", accessToken);
            const refreshToken = await redis.getRefreshTokenFromAccessToken(accessToken);
            console.log("REFRESH TOKEN => ", refreshToken);
            jwt.verify(refreshToken, process.env.JWT_SECRET, async(err, payload) => {
                if(err) return err;
                else 
                {
                    const { id } = payload;
                    console.log("USER ID => ", id);
                    const newAccessToken = jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: 900}); // 15 mins
                    console.log("NEW ACCESS TOKEN => ", newAccessToken);
                    redis.deleteToken(accessToken);
                    res.clearCookie("token");
                    redis.setAccessToken(newAccessToken, refreshToken);
                    res.cookie("token", newAccessToken, {
                        httpOnly: true,
                        secure: true,
                        sameSite: true
                    });
                    res.json("Successfully Renewed Access Token");
                }
            });
        }
    }
    catch(err) {
        res.json(next(err));
    }
}

module.exports = { registerUser, loginUser, checkAuth, logoutUser, renewAccessToken }