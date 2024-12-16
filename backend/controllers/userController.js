import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import pkg from 'firebase-admin';
const {auth}=pkg;
import admin from 'firebase-admin'

admin.initializeApp({
    credential: admin.credential.cert("C:\\Users\\ATUL\\Desktop\\tomato_food_delivery_app\\backend\\foodweb.json")
  });
  

  //console.log(process.env.GOOGLE_APPLICATION_CREDENTIALS);

//create token
const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET);
}

//login user
const loginUser = async (req,res) => {
    const {email, password} = req.body;
    try{
        const user = await userModel.findOne({email})

        if(!user){
            return res.json({success:false,message: "User does not exist"})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.json({success:false,message: "Invalid credentials"})
        }

        const token = createToken(user._id)
        res.json({success:true,token})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

//register user
const registerUser = async (req,res) => {
    const {name, email, password} = req.body;
    try{
        //check if user already exists
        const exists = await userModel.findOne({email})
        if(exists){
            return res.json({success:false,message: "User already exists"})
        }

        // validating email format & strong password
        if(!validator.isEmail(email)){
            return res.json({success:false,message: "Please enter a valid email"})
        }
        if(password.length<8){
            return res.json({success:false,message: "Please enter a strong password"})
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({name, email, password: hashedPassword})
        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({success:true,token})

    } catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}



const googlelogin = async (req, res) => {
    const { token: authToken } = req.body; // Rename the token from req.body to authToken

    try {
        // Verify the Google ID token
        const decodedToken = await admin.auth().verifyIdToken(authToken); // Use authToken here
        const { uid, email, name } = decodedToken;

        // Check if the user exists in the userModel using googleId
        let user = await userModel.findOne({ googleId: uid });

        if (!user) {
            // If user doesn't exist, create a new user
            user = new userModel({
                name,
                email,
                googleId: uid, // Set the googleId field to the uid from Google
            });

            // Save the user in the database
            await user.save();
        }

        // Create a JWT token for the user
        const jwtToken = createToken(user._id); // Rename the new token variable to jwtToken
        res.json({ success: true, token: jwtToken }); // Return the JWT token in the response

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error during Google login" });
    }
};

export {loginUser, registerUser , googlelogin}