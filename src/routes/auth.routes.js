import { Router } from "express";
import { validateSignup } from "../middlewares/auth.validation.js";
import { registerUser } from "../controllers/auth.controller.js";

const router= Router(); 

router.post("/register",validateSignup,registerUser);
router.post("/login",)

export default router;