import { Router } from "express";
import { showHomePage } from "./controllers/home";
import { showLoginPage } from "./controllers/login";

const pagesRouter = Router();

pagesRouter.get("/", showHomePage);
pagesRouter.get("/login", showLoginPage);

export default pagesRouter;
