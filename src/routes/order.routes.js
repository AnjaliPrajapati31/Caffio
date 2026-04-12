import express from "express";
import {
    placeOrder,
    getAllOrders,
    assignOrder,
    getMyOrders
} from "../controllers/order.controller.js";

import { authenticateToken, authorizeAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authenticateToken, placeOrder);

router.get("/", authenticateToken, getAllOrders);

router.patch("/:id/assign", authenticateToken, authorizeAdmin, assignOrder);

router.get("/myorders", authenticateToken, getMyOrders);

export default router;