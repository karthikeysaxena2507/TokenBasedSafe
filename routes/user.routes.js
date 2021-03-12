const router = require("express").Router();
const userCtrl = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth");

router.get("/", authMiddleware ,userCtrl.getAllUsers);

router.post("/register", userCtrl.registerUser);

router.post("/login", userCtrl.loginUser);

router.post("/auth", authMiddleware , userCtrl.checkAuth);

router.post("/logout", userCtrl.logoutUser);

module.exports = router;