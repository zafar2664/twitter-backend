import express from "express"
import { bookmarks, follow, getMyProfile, getOtherUsers, Login, Logout, Register, unfollow } from "../controllers/userController.js";
import isAuthenticated from "../config/auth.js";

//express ko use karenge routes ke andar
const router = express.Router();

router.route("/register").post(Register); // post use karte hain data send karne ke liye
router.route("/login").post(Login);  // usercontroller me login ka pura function bna diya
router.route("/logout").get(Logout);
router.route("/bookmark/:id").put(isAuthenticated, bookmarks); //put means pdate 
router.route("/profile/:id").get(isAuthenticated,getMyProfile);
router.route("/otheruser/:id").get(isAuthenticated, getOtherUsers);
router.route("/follow/:id").post(isAuthenticated, follow);
router.route("/unfollow/:id").post(isAuthenticated, unfollow);

export default router;