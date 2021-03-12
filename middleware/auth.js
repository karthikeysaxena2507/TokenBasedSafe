const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    if(!authorization) {
        return res.status(401).json({error:"you must be logged in"});
    }
    const token = authorization;
    jwt.verify(token, process.env.JWT_SECRET, async(err, payload) => {
        if(err) {
         return res.status(401).json({error:"you must be logged in"})
        }
        const { id } = payload;
        const user = await User.findOne({where: {id}});
        req.user = user.dataValues;
        next();
    });
}