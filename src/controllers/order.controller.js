import Order from "../models/order.model.js";
import Menu from "../models/menu.model.js";
import Staff from "../models/staff.model.js";

export const placeOrder = async (req, res) => {
    try {
        const { items } = req.body;

        let total = 0;

        for (let item of items) {
            const menuItem = await Menu.findById(item.menuItem);

            if (!menuItem) {
                return res.status(404).json({ message: "Menu item not found" });
            }

            total += menuItem.price * item.quantity;
        }

        const order = await Order.create({
            customerId: req.user.id,
            items,
            totalAmount: total
        });

        res.status(201).json(order);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllOrders = async (req, res) => {
    const orders = await Order.find()
        .populate("customerId", "name email")
        .populate("assignedStaffId", "name email");

    res.json(orders);
};

export const assignOrder = async (req, res) => {
    try {
        const { staffId } = req.body;
        const { id: orderId } = req.params;

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

export const getMyOrders = async (req, res) => {
    const orders = await Order.find({ customerId: req.user.id });

    res.json(orders);
};