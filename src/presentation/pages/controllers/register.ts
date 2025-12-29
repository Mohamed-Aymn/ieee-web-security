import { Request, Response } from "express";

export const showRegisterPageController = (req: Request, res: Response): void => {
  res.render('registration');
};
