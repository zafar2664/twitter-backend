import mongoose from "mongoose";

import dotenv from "dotenv";
//const PORT = 8080; iske badle env file bnaayi hai
// .env ki path define karni hai index me
dotenv.config({
    path:"../config/.env"
})


const databaseConnection = () => {
    mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log("Connected to mongoDB");
    }).catch((error) => {
        console.log(error);
        
    })
}
export default databaseConnection;