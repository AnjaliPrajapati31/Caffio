import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
{
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    items: [
        {
            menuItem: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Menu"
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],

    totalAmount: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        enum: ["Placed", "Assigned", "Preparing", "Ready", "Completed"],
        default: "Placed"
    },

    assignedStaffId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Staff",
        default: null
    },

    paymentStatus: {
        type: String,
        enum: ["Pending", "Paid"],
        default: "Pending"
    }

},
{ timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;