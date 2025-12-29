import { Request, Response } from "express";

export const showHomePageController = async (req: Request, res: Response): Promise<void> => {

  const response = await fetch("http://localhost:3000/api/me/getUserName", {
    headers: {
      'Cookie': req.headers.cookie || '',
    },
  });
  const data = await response.json();
  const name = data.message;

  res.render('home', { name });
};
