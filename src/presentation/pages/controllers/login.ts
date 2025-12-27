import { Request, Response } from "express";

export const showLoginPage = (req: Request, res: Response): void => {
  res.render('login');
};
