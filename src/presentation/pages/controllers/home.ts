import { Request, Response } from "express";

export const showHomePage = (req: Request, res: Response): void => {
  const name = req.query.name || 'Guest';
  res.render('home', { name });
};
