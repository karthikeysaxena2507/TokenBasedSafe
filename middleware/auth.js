const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const fs = require("fs");
const path = require("path");

let publicKey = fs.readFileSync(path.resolve("./public.key"), "utf-8");

let accessTokenVerifyOptions = {
    issuer:  "KS",
    subject:  "jwt",
    audience:  "users",
    expiresIn: 900,
    algorithm:  ["RS256"]
};

module.exports = (req, res, next) => {
    const token = req.cookies.token;
    if(!token)
    {
        req.user = null;
        next();
    } 
    else 
    {
        jwt.verify(token, publicKey, accessTokenVerifyOptions, async(err, payload) => {
            if(err)
            {
                console.log("Error: ", err);
                req.user = null;
            } 
            else 
            {
                const { id } = payload;
                const user = await User.findOne({where: {id}});
                req.user = user.dataValues;
            }
            next();
        });
    }
}