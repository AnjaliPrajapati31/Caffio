import { Router } from "express";
import {
    checkIn,
    checkOut,
    getAllStaffAttendance
} from "../controllers/attendance.controller.js";
import { authenticateToken, authorizeAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/checkin", authenticateToken, checkIn);
router.post("/checkout", authenticateToken, checkOut);
router.get("/all", authenticateToken, authorizeAdmin, getAllStaffAttendance);

export default router;
