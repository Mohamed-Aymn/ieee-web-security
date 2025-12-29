import { Request, Response } from "express";

export const showRegisterPage = (req: Request, res: Response): void => {
  res.render('registration');
};
