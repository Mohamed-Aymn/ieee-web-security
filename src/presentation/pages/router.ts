import { Router } from "express";
import { showLoginPage } from "./controllers/login";

const pagesRouter = Router();

pagesRouter.get("/login", showLoginPage);

export default pagesRouter;
