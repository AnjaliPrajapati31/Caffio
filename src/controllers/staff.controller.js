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

    const token = createJwtToken(user._id, "staff");

    return res.status(200).json({ message: "Login successful", token, role: "staff" });
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

export const updateOrderStatus = async (req, res) => {
    const userId = req.user.id;
    const userRole = req.user.role;

    const { orderId, status } = req.body;

    try {
        if (!orderId || !status) {
            return res.status(400).json({ message: "orderId and status are required" });
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

        if (!normalizedStatus) {
            return res.status(400).json({
                message: "Invalid status. Use one of: Placed, Assigned, Preparing, Ready, Completed"
            });
        }

        let order;

        // 🔹 STAFF LOGIC
        if (userRole === "staff") {

            // ❌ Staff cannot mark as completed
            if (normalizedStatus === "Completed") {
                return res.status(403).json({
                    message: "Only admin can mark order as Completed"
                });
            }

            // Staff can update only their assigned orders
            order = await Order.findOne({
                _id: orderId,
                assignedStaffId: userId
            });

            if (!order) {
                return res.status(404).json({
                    message: "Order not found or not assigned to this staff"
                });
            }

            order.status = normalizedStatus;
            await order.save();
        }

        // 🔹 ADMIN LOGIC
        else if (userRole === "admin") {

            order = await Order.findById(orderId);

            if (!order) {
                return res.status(404).json({ message: "Order not found" });
            }

            // Enforce workflow sequence: completion is allowed only after the order is Ready.
            if (normalizedStatus === "Completed" && order.status !== "Ready") {
                return res.status(400).json({
                    message: "Order can be marked Completed only when current status is Ready"
                });
            }

            order.status = normalizedStatus;
            await order.save();

            // ✅ If admin marks completed → remove from staff
            if (normalizedStatus === "Completed" && order.assignedStaffId) {
                await Staff.findByIdAndUpdate(order.assignedStaffId, {
                    $pull: { assignedOrders: order._id }
                });

                // optional: unassign staff
                order.assignedStaffId = null;
                await order.save();
            }
        }

        else {
            return res.status(403).json({ message: "Unauthorized role" });
        }

        return res.status(200).json({
            message: "Order status updated successfully",
            order
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};