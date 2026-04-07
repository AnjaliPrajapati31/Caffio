import Staff from "../models/staff.model.js";

export const getAllStaff = async (req, res) => {
    const staffMembers = await Staff.find();
    res.json(staffMembers);
}

export const addStaff = async (req,res)=> {
    const newStaff = await Staff.create(req.body);
    res.json(newStaff);
}

export const updateStaff = async (req,res) => {
    const updatedStaff = await Staff.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.json(updatedStaff);
}

export const deleteStaff = async (req,res) => {
    await Staff.findByIdAndDelete(req.params.id);
    res.json({ message: "Staff member deleted" });
}


