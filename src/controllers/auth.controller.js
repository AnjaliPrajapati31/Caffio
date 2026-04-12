import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { createJwtToken } from "../middlewares/auth.middleware.js";
import Staff from "../models/staff.model.js";

export const registerUser=async (req,res)=>{
    const { name, email, password, role} = req.body;
    const existingUser =await User.findOne({email});
    if(existingUser){
        return res.status(400).json({message:"User already exists"});
    } 
    const salt =await bcrypt.genSaltSync(10);
    const hashedPassword =await bcrypt.hashSync(password,salt);
    const newUser = await User.create({
        name,
        email,
        password:hashedPassword,
        role
    });
    return res.status(201).json({message:"User registered successfully",role:newUser.role});
}

export const loginUser=async(req,res)=>{
    const { email, password,role} = req.body;
    const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
     
    const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

    const token = createJwtToken(user._id, user.role);

    return res.status(200).json({ message: "Login successful", token, role: user.role });
}

export const loginStaff = async (req, res) => {
    try {
        console.log("BODY RECEIVED:", req.body);

        const { email, password } = req.body;

        const user = await Staff.findOne({ email });

        console.log("USER FOUND:", user);

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        console.log("PASSWORD MATCH:", isPasswordValid);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = createJwtToken(user._id, user.role);

        console.log("TOKEN CREATED");

        return res.status(200).json({
            message: "Login successful",
            token,
            role: user.role
        });

    } catch (error) {
        console.log("LOGIN ERROR:", error.message);
        return res.status(500).json({ message: error.message });
    }
};
