import { Router } from "express";
import { login, logout, getSession } from "../controllers/auth";
import { optionalAuth } from "../middleware/session";

const router = Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/session", optionalAuth, getSession);

export default router;
