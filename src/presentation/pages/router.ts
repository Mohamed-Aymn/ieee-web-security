import { Router } from "express";
import { showHomePage } from "./controllers/home";
import { showLoginPage } from "./controllers/login";
import { showTodoPage } from "./controllers/todo";

const pagesRouter = Router();

pagesRouter.get("/", showHomePage);
pagesRouter.get("/login", showLoginPage);
pagesRouter.get("/todo", showTodoPage);

export default pagesRouter;
