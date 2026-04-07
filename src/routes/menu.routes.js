import express from "express";
import {
    getMenu,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem
} from "../controllers/menu.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
const router = express.Router();

const isAdmin = (req, res, next) => {
   if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
   }
   next();
};
router.get("/", getMenu);
router.post("/",authenticateToken,isAdmin,addMenuItem);
router.put("/:id",authenticateToken,isAdmin, updateMenuItem);
router.delete("/:id",authenticateToken,isAdmin, deleteMenuItem);

export default router;