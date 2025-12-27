import { Request, Response } from "express";

export const showTodoPage = (req: Request, res: Response): void => {
  res.render('todo');
};
