import { Request, Response } from "express";

export const showTodoPageController = (req: Request, res: Response): void => {
  res.render('todo');
};
