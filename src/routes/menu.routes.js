import express from "express";
import {
    getMenu,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem
} from "../controllers/menu.controller.js";
import { authenticateToken, authorizeAdmin } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.get("/", getMenu);
router.post("/",authenticateToken,authorizeAdmin,addMenuItem);
router.put("/:id",authenticateToken,authorizeAdmin, updateMenuItem);
router.delete("/:id",authenticateToken,authorizeAdmin, deleteMenuItem);

export default router;