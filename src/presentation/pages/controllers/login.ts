import { Request, Response } from "express";

export const showLoginPageController = (req: Request, res: Response): void => {
  res.render('login');
};
