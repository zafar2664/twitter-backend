import express from "express"

import { createTweet, deleteTweet, getAllTweets, getFollowingTweets, likeOrDislike } from "../controllers/tweetController.js";
import isAuthenticated from "../config/auth.js";

//express ko use karenge routes ke andar
const router = express.Router();

router.route("/create").post(isAuthenticated,createTweet); // iss new route ko index.js me use karna prega
//router.route("/create").post(isAuthenticated,createTweet);
router.route("/delete/:id").delete(isAuthenticated, deleteTweet);
 // yaha par id param se aayega
router.route("/like/:id").put(isAuthenticated, likeOrDislike); // put method update karne ke liye use karte hain
router.route("/alltweet/:id").get(isAuthenticated, getAllTweets);
router.route("/followingtweet/:id").get(isAuthenticated, getFollowingTweets);

export default router;