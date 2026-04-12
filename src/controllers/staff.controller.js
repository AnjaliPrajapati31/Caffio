import Staff from "../models/staff.model.js";
import Order from "../models/order.model.js";
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

export const getAssignedOrders=async(req,res)=>{
    const staffId=req.user.id;  
    try{
        const staff=await Staff.findById(staffId);
        if(!staff){
            return res.status(404).json({message:"Staff not found"});
        }

        const assignedOrders = await Order.find({ assignedStaffId: staffId })
            .populate("customerId", "name email")
            .populate("items.menuItem", "name price")
            .sort({ createdAt: -1 });

        if(!assignedOrders.length){
            return res.status(200).json({message:"No assigned orders found"});
        }

        return res.status(200).json({assignedOrders});
    }catch(error){
        return res.status(500).json({message:error.message});
    }
}

export const updateOrderStatus=async(req,res)=>{
    const staffId=req.user.id;
    const { orderId, status } = req.body;
    try{
        const staff=await Staff.findById(staffId);
        if(!staff){
            return res.status(404).json({message:"Staff not found"});
        }

        if(!orderId || !status){
            return res.status(400).json({message:"orderId and status are required"});
        }

        const normalizedStatusMap = {
            placed: "Placed",
            assigned: "Assigned",
            preparing: "Preparing",
            processing: "Preparing",
            ready: "Ready",
            completed: "Completed"
        };

        const normalizedStatus = normalizedStatusMap[String(status).toLowerCase()];

        if(!normalizedStatus){
            return res.status(400).json({
                message:"Invalid status. Use one of: Placed, Assigned, Preparing, Ready, Completed"
            });
        }

        const order = await Order.findOne({ _id: orderId, assignedStaffId: staffId });

        if(!order){
            return res.status(404).json({message:"Order not found or not assigned to this staff"});
        }

        const allowedTransitions = {
    Assigned: ["Preparing"],
    Preparing: ["Ready"],
    Ready: ["Completed"],
    Completed: []
};

if (!allowedTransitions[order.status].includes(normalizedStatus)) {
    return res.status(400).json({
        message: `Cannot change status from ${order.status} to ${normalizedStatus}`
    });
}

order.status = normalizedStatus;
await order.save();

        return res.status(200).json({message:"Order status updated successfully", order});
    }catch(error){
        return res.status(500).json({message:error.message});
    }
}

export const getStaffProfile = async (req, res) => {
  try {
    const staffId = req.user.id;

    const staff = await Staff.findById(staffId).select("-password");

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    return res.status(200).json(staff);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};