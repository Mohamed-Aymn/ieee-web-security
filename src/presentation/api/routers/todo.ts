import { Router } from "express";
import { requireAuth } from "../../middleware/session";
import { exportXML, importXML } from "../controllers/todo";

const router = Router();

router.post("/exportXML", requireAuth, exportXML);
router.post("/importXML", requireAuth, importXML);

export default router;
