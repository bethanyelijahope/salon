const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/profile", authMiddleware, userController.getUserProfile);
router.put("/profile/email", authMiddleware, userController.updateEmail);
router.put("/profile/password", authMiddleware, userController.updatePassword);

module.exports = router;
