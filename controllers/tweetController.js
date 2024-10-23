import {Tweet} from "../models/tweetSchema.js"
import { User } from "../models/userSchema.js";
//ye tweet kon likh rha hai aur kyu likh raha hai
export const createTweet = async (req, res) => {
    try {
        const {description, id} = req.body;
        if(!description || !id){
            return res.status(401).json({
                message:"Fields are required.",
                success:false
            });
        };
        //const user = await User.findById(id).select("-password");
        // create tweet
        const user = await User.findById(id).select("-password");
        await Tweet.create({
            description,
            userId:id,
            userDetails:user
        });
        return res.status(201).json({
            message:"Tweet created successfully.",
            success:true,
        })
    } catch (error) {
        console.log(error);
        
    }
}
// delete tweet

export const deleteTweet = async (req,res) => {
    
    
    try {
        const {id} = req.params;
        await Tweet.findByIdAndDelete(id);
        return res.status(200).json({
            message:"Tweet deleted successfully.",
            success:true
        })
    } catch (error) {
        
        console.log(error);
        
    }
}

//update like and dislike, kon sa user tweet kar rha hai aur kon sa user like kar rha hai
export const likeOrDislike = async (req, res) => {
    try {
        const loggedInUserId = req.body.id;
        const tweetId = req.params.id;
        const tweet = await Tweet.findById(tweetId);
        if(tweet.like.includes(loggedInUserId)){
            //dislike
            await Tweet.findByIdAndUpdate(tweetId, {$pull:{like:loggedInUserId}});
            return res.status(200).json({
                message:"User disliked your tweet.",

            })
        } else{
            // like
            await Tweet.findByIdAndUpdate(tweetId, {$push:{like:loggedInUserId}});
            return res.status(200).json({
                message:"User liked your tweet.",
                
            })
        }
    } catch (error) {
        console.log(error);
        
    }
} // isko router me use krenge

// GET TWEETS
export const getAllTweets = async (req,res) => {
    //loggedinuser ka tweet + following user ka tweet
    try {
        const id = req.params.id;
        const loggedInUser = await User.findById(id);
        const loggedInUserTweets = await Tweet.find({userId:id});
        const followingUserTweet = await Promise.all(loggedInUser.following.map((otherUserId) => {
            return Tweet.find({userId:otherUserId});
        }));
        return res.status(200).json({
            tweets:loggedInUserTweets.concat(...followingUserTweet)
        })
    } catch (error) {
        console.log(error);
        
    }
}

//FOLLOWERS TWEET
export const getFollowingTweets = async (req, res) => {
    try {
        const id = req.params.id;
        const loggedInUser = await User.findById(id);
        const followingUserTweet = await Promise.all(loggedInUser.following.map((otherUserId) => {
            return Tweet.find({userId:otherUserId});
        }));
        return res.status(200).json({
            tweets:[].concat(...followingUserTweet)
        })
    } catch (error) {
        console.log(error);
        
    }
}