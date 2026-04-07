import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { createJwtToken } from "../middlewares/auth.middleware.js";

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
    return res.status(201).json({message:"User registered successfully"});
}

export const loginUser=async(req,res)=>{
    const { email, password } = req.body;
    const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
     
    const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

    const token = createJwtToken(user.role);

    return res.status(200).json({ message: "Login successful", token });
}

