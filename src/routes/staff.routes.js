import { Router } from "express";
import { loginStaff } from "../controllers/staff.controller.js";
import { validateLogin } from "../middlewares/auth.validation.js";

const router = Router();

export default router.post("/",validateLogin,loginStaff)