import { Router } from "express";
import { optionalAuth } from "../../middleware/session";
import { getUserNameController } from "../controllers/me";

const router = Router();

router.get("/getUserName", optionalAuth, getUserNameController);

export default router;
