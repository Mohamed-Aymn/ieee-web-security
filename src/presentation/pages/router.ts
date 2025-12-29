import { Router } from "express";
import { showHomePage } from "./controllers/home";
import { showLoginPage } from "./controllers/login";
import { showTodoPage } from "./controllers/todo";
import { showRegisterPage } from "./controllers/register";
import { requireAuth } from "../middleware/session";

const pagesRouter = Router();

pagesRouter.get("/", showHomePage);
pagesRouter.get("/login", showLoginPage);
pagesRouter.get("/register", showRegisterPage);
pagesRouter.get("/todo", requireAuth ,showTodoPage);

export default pagesRouter;
