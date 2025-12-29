import { Router } from "express";
import { optionalAuth } from "../../middleware/session";
import { getSessionController, loginController, logoutController, registerController } from "../controllers/auth";

const router = Router();

router.post("/login", loginController);
router.post("/register", registerController);
router.post("/logout", logoutController);
router.get("/session", optionalAuth, getSessionController);

export default router;
