const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getAllUsers = async(req, res, next) => {
    try {
        const users = await User.findAll({});
        res.json(users);
    }   
    catch(error) {
        res.json(next(error));
    }
}

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
            console.log(user.dataValues.password, password);
            bcrypt.compare(password, user.dataValues.password)
            .then((isMatch) => {
                if(!isMatch) res.json("Password is not correct");
                else 
                {
                    const token = jwt.sign({id: user.dataValues.id}, process.env.JWT_SECRET);
                    console.log(token);
                    res.json({username: user.dataValues.username, email, token});
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

    }
    catch(err) {
        res.json(next(error));
    }
}

const logoutUser = async(req, res, next) => {
    try {

    }
    catch(err) {
        res.json(next(error));
    }
}

module.exports = { getAllUsers, registerUser, loginUser, checkAuth, logoutUser }