import { Router } from "express";
import { getAllStaff,addStaff,updateStaff,deleteStaff } from "../controllers/admin.controller.js";
import { authenticateToken,authorizeAdmin } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(authenticateToken,authorizeAdmin);
router.get("/",getAllStaff);
router.post("/",addStaff);
router.put("/:id",updateStaff);
router.delete("/:id",deleteStaff);

export default router;