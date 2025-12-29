import { Router } from "express";
import { getUserName } from "../controllers/me";
import { optionalAuth } from "../../middleware/session";

const router = Router();

router.get("/getUserName", optionalAuth, getUserName);

export default router;
