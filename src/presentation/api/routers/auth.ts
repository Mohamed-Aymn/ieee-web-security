import { Router } from "express";
import { login, logout, getSession, register } from "../controllers/auth";
import { optionalAuth } from "../../middleware/session";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.get("/session", optionalAuth, getSession);

export default router;
