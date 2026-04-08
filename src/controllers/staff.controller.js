import Staff from "../models/staff.model.js";
import { createJwtToken } from "../middlewares/auth.middleware.js";
import bcrypt from "bcryptjs";

export const loginStaff=async(req,res)=>{
    const { email, password} = req.body;
    const user = await Staff.findOne({ email });
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

