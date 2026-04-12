import { Router } from "express";
import { loginStaff, getAssignedOrders, updateOrderStatus } from "../controllers/staff.controller.js";
import { validateLogin } from "../middlewares/auth.validation.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";


const router = Router();

router.post("/",validateLogin,loginStaff)
router.get("/assigned-orders",authenticateToken,getAssignedOrders)
router.patch("/update-status",authenticateToken,updateOrderStatus)

export default router;
