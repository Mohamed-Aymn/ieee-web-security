import { Request, Response } from "express";
const ejs = require('ejs');

export const getUserNameController = async (req: Request, res: Response): Promise<Response> => {
    // Session is attached by optionalAuth middleware if valid
    if (req.session) {
        const username = req.session.username;
        console.log(username)

        const template = `Welcome! ${username}`;

        const output = ejs.render(template);
        return res.status(200).json({ message: output });
    }

    return res.status(401).json({ message: 'Welcome! Guest' });
};