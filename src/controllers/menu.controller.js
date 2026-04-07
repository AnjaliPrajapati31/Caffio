import Menu from "../models/menu.model.js";

// GET all menu items
export const getMenu = async (req, res) => {
    const items = await Menu.find();
    res.json(items);
};

// ADD item (admin)
export const addMenuItem = async (req, res) => {
    const item = await Menu.create(req.body);
    res.json(item);
};

// UPDATE item
export const updateMenuItem = async (req, res) => {
    const item = await Menu.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.json(item);
};

// DELETE item
export const deleteMenuItem = async (req, res) => {
    await Menu.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted" });
};