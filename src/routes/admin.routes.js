import { Router } from "express";
import { getAllStaff,addStaff,updateStaff,deleteStaff,assignOrderToStaff,markOrderCompletedByAdmin } from "../controllers/admin.controller.js";
import { authenticateToken,authorizeAdmin } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(authenticateToken,authorizeAdmin);
router.get("/allStaff",getAllStaff);
router.post("/add-staff",addStaff);
router.put("/update-staff/:id",updateStaff);
router.delete("/delete-staff/:id",deleteStaff);
router.patch("/assign-order/:orderId",assignOrderToStaff);
router.patch("/complete-order/:orderId",markOrderCompletedByAdmin);

export default router;