import Staff from "../models/staff.model.js";
import Order from "../models/order.model.js";
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

export const assignOrderToStaff = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { staffId } = req.body;

        if (!staffId) {
            return res.status(400).json({ message: "staffId is required" });
        }

        const [order, staff] = await Promise.all([
            Order.findById(orderId),
            Staff.findById(staffId)
        ]);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (!staff) {
            return res.status(404).json({ message: "Staff not found" });
        }

        const previousStaffId = order.assignedStaffId ? order.assignedStaffId.toString() : null;
        const nextStaffId = staff._id.toString();

        if (previousStaffId && previousStaffId !== nextStaffId) {
            await Staff.findByIdAndUpdate(previousStaffId, {
                $pull: { assignedOrders: order._id }
            });
        }

        order.assignedStaffId = staff._id;
        order.status = "Assigned";
        await order.save();

        await Staff.findByIdAndUpdate(staff._id, {
            $addToSet: { assignedOrders: order._id }
        });

        const populatedOrder = await Order.findById(order._id)
            .populate("customerId", "name email")
            .populate("assignedStaffId", "name email");

        return res.status(200).json(populatedOrder);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const markOrderCompletedByAdmin = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.status === "Completed") {
            return res.status(200).json({ message: "Order is already completed", order });
        }

        order.status = "Completed";
        await order.save();

        return res.status(200).json({
            message: "Order marked as completed",
            order
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


