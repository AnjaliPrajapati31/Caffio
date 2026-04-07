import { Router } from "express";
import { getAllStaff,addStaff,updateStaff,deleteStaff } from "../controllers/staff.controller.js";
import { authenticateToken,authorizeAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/",authenticateToken,authorizeAdmin,getAllStaff);
router.post("/",authenticateToken,authorizeAdmin,addStaff);
router.put("/:id",authenticateToken,authorizeAdmin,updateStaff);
router.delete("/:id",authenticateToken,authorizeAdmin,deleteStaff);

export default router;