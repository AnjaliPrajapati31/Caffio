import express from "express";
import {
    placeOrder,
    getAllOrders,
    assignOrder,
    updateOrderStatus,
    getMyOrders,
    getStaffOrders
} from "../controllers/order.controller.js";

import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authenticateToken, placeOrder);

router.get("/", authenticateToken, getAllOrders);

router.patch("/:id/assign", authenticateToken, assignOrder);

router.patch("/:id/status", authenticateToken, updateOrderStatus);

router.get("/myorders", authenticateToken, getMyOrders);

router.get("/staff", authenticateToken, getStaffOrders);

export default router;