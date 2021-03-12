const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

module.exports = (req, res, next) => {
    const token = req.cookies.token;
    if(!token) req.user = null;
    jwt.verify(token, process.env.JWT_SECRET, async(err, payload) => {
        if(err) req.user = null;
        else 
        {
            const { id } = payload;
            const user = await User.findOne({where: {id}});
            req.user = user.dataValues;
        }
        next();
    });
}