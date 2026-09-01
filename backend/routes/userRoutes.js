import express from "express";
const router = express.Router();
import registerController from "../controllers/registerController.js";
import loginController from "../controllers/loginController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import fetchProfile from "../controllers/fetchProfileController.js";
import { likePost, unlikePost } from "../controllers/likePostController.js";
import { uploadDP } from "../cloudinary-config.js";

router.post("/register", uploadDP.single("image"), registerController);
router.post("/login", loginController);
router.get("/profile", isAuthenticated, fetchProfile);
export default router;
