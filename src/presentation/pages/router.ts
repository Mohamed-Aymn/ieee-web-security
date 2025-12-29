import { Router } from "express";
import { requireAuth } from "../middleware/session";
import { showHomePageController } from "./controllers/home";
import { showLoginPageController } from "./controllers/login";
import { showRegisterPageController } from "./controllers/register";
import { showTodoPageController } from "./controllers/todo";

const pagesRouter = Router();

pagesRouter.get("/", showHomePageController);
pagesRouter.get("/login", showLoginPageController);
pagesRouter.get("/register", showRegisterPageController);
pagesRouter.get("/todo", requireAuth, showTodoPageController);

export default pagesRouter;
