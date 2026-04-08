import Staff from "../models/staff.model.js";
import bcrypt from "bcryptjs";

export const getAllStaff = async (req, res) => {
    const staffMembers = await Staff.find();
    res.json(staffMembers);
}

export const addStaff = async (req,res)=> {
    const { name, email, password} = req.body;
    const salt = await bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hashSync(password, salt);
    req.body.password = hashedPassword;
    const newStaff = await Staff.create(req.body);
    res.json(newStaff);
}

export const updateStaff = async (req,res) => {
    const { password } = req.body;
    if (password) {
        const salt = await bcrypt.genSaltSync(10);  
        const hashedPassword = await bcrypt.hashSync(password, salt);
        req.body.password = hashedPassword;
    }
    const updatedStaff = await Staff.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true}
    );
    res.json(updatedStaff);
}

export const deleteStaff = async (req,res) => {
    await Staff.findByIdAndDelete(req.params.id);
    res.json({ message: "Staff member deleted" });
}


