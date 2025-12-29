import { Router } from "express";
import { requireAuth } from "../../middleware/session";
import { exportXMLController, importXMLController } from "../controllers/todo";

const router = Router();

router.post("/exportXML", requireAuth, exportXMLController);
router.post("/importXML", requireAuth, importXMLController);

export default router;
