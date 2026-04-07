import { Router } from "express";
import { validateSignup,validateLogin } from "../middlewares/auth.validation.js";
import { loginUser, registerUser } from "../controllers/auth.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router= Router(); 

router.post("/register",validateSignup,registerUser);
router.post("/login",validateLogin,loginUser);

export default router;