import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String
    },
    image: {
        type: String
    }
}, { timestamps: true });

const Menu = mongoose.model("Menu", menuSchema);

export default Menu;