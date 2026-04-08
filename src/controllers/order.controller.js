import Order from "../models/order.model.js";
import Menu from "../models/menu.model.js";

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
    const { staffId } = req.body;

    const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
            assignedStaffId: staffId,
            status: "Assigned"
        },
        { new: true }
    );

    res.json(order);
};

export const updateOrderStatus = async (req, res) => {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
    );

    res.json(order);
};

export const getMyOrders = async (req, res) => {
    const orders = await Order.find({ customerId: req.user.id });

    res.json(orders);
};

export const getStaffOrders = async (req, res) => {
    const orders = await Order.find({ assignedStaffId: req.user.id });

    res.json(orders);
};