import { User } from "../models/userSchema.js";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"

// user Register
export const Register = async ( req, res) => {
    try {
        const {name, username, email, password} = req.body;
        // basic validation
        if(!name || !username || !email || !password){
            return res.status(401).json({
                message:"All fields are required.",
                success:false
            })
        }
        // user validation / same user or not, not create multiple user from one email
        const user =  await User.findOne({email} );
        if(user){
            return res.status(401).json({
                message:"User already exist.",
                success:false
            })
        }

        const hashedPassword = await bcryptjs.hash(password, 16);
        await User.create({
            name,
            username,
            email,
            password:hashedPassword //hashedpassword means no one can see password
        });

        return res.status(201).json({
            message:"Account created successfully.",
            success:true
        })

    } catch (error) {
        console.log(error);
    }
}

//isko chalane ke liye api chahiye, jo routes ke andar humlog bnayenge

// for Login
export const Login = async (req,res) => {
    try {
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(401).json({
                message:"All fields are required.",
                success:false
            })
        };
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                message:"Incorrect email or password.",
                success:false
            })
        }
        // password matching
        const isMatch = await bcryptjs.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({
                message:"Incorrect email or password",
                success:false
            })
        }
        //if matched then generate token
        const tokenData = {
            userId:user._id
        }
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, {expiresIn:"1d"})
        return res.status(201).cookie("token", token, {expiresIn:"1d", httpOnly:true, secure:true, path:"/"}).json({
            message:`Welcome back ${user.name}`,
            user,
            success:true
        })

    } catch (error) {
        console.log(error);
        
    }
}
// ab route ke andar jaa kar 

// let implement LOGOUT
export const Logout = (req,res) => {
    return res.clearCookie("token").json({
        message:"user logged out successfully.",
        success:true
    })
}
//ab isko router me use karna hai

// bookmarks
export const bookmarks = async (req, res)=> {
    try {
        const loggedInUserId = req.body.id;
        const tweetId = req.params.id;
        const user = await User.findById(loggedInUserId);
        if(user.bookmarks.includes(tweetId)){
            //remove
            await User.findByIdAndUpdate(loggedInUserId,{$pull:{bookmarks:tweetId}});
            return res.status(200).json({
                message:"Removed from bookmarks."
            });
        } else {
            //bookmark
            await User.findByIdAndUpdate(loggedInUserId,{$push:{bookmarks:tweetId}});
            return res.status(200).json({
                message:"Saved to bookmarks."
            });
        }
    } catch (error) {
        console.log(error);
        
    }
} // isko use karna hai router me

// create profile 
export const getMyProfile = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id).select("-password"); // select("-password")- password hidden ke liye
        return res.status(200).json({
            user,
        })
    } catch (error) {
        console.log(error);
        
    }
}

// other user display ke liye
export const getOtherUsers = async (req, res) => {
    try {
        const {id} = req.params;
        const otherUsers = await User.find({_id:{$ne:id}});
        if(!otherUsers) {
            return res.status(401).json({
                message:"Currently do not have any users."
            })
        };
        return res.status(200).json({
            otherUsers
        })
    } catch (error) {
        console.log(error);
        
    }
}
// followers and following
export const follow = async (req, res) => {
    try {
        const loggedInUserId = req.body.id;
        const userId = req.params.id;

        // Fetch the user objects from the database
        const loggedInUser = await User.findById(loggedInUserId); // first uder
        const user = await User.findById(userId); // second user

        // Check if the logged-in user is already following the other user
        if(!user.followers.includes(loggedInUserId)) {

            // Update both users to reflect the follow action
            await user.updateOne({$push:{followers:loggedInUserId}});
            await loggedInUser.updateOne({$push:{following:userId}});
        } else {
            // If already following, send a message indicating that
            return res.status(400).json({
                message:`User already followed to ${user.name}`
            })
        };
        return res.status(200).json({
            message:`${loggedInUser.name} just follow to ${user.name}`,
            success:true
        })


    } catch (error) {
        console.log(error);
        
    }
} 

// FOLLOWING
export const unfollow = async (req, res) => {
    try {
        const loggedInUserId = req.body.id;
        const userId = req.params.id;

        // Fetch the user objects from the database
        const loggedInUser = await User.findById(loggedInUserId); // first uder
        const user = await User.findById(userId); // second user

        // Check if the logged-in user is already following the other user
        if(loggedInUser.following.includes(userId)) {

            // Update both users to reflect the follow action
            await user.updateOne({$pull:{followers:loggedInUserId}});
            await loggedInUser.updateOne({$pull:{following:userId}});
        } else {
            // If already following, send a message indicating that
            return res.status(400).json({
                message:`User has not followed yet.`
            })
        };
        return res.status(200).json({
            message:`${loggedInUser.name} unfollow to ${user.name}`,
            success:true
        })
    } catch (error) {
        console.log(error);
        
    }
}