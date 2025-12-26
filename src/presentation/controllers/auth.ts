import { Request, Response } from "express";
import { getDB } from "../../presistence";
import bcrypt from "bcryptjs";

export const login = async (req: Request, res: Response): Promise<Response> => {
  const filter = req.body.filter;

  try {
    // ❌ DANGEROUS: we take the JSON filter *as provided*
    // and pass it straight into findOne().
    const user = await getDB()
      .collection("users")
      .findOne(filter);

    if (!user) {
      return res.status(401).json({ message: "No user found" });
    }

    const { password } = req.body;
    const verified = await bcrypt.compare(password, user.passwordHash);

    if (verified) {
      return res.json({ success: true, username: user.username });
    }

    return res.status(401).json({ message: "Wrong password" });

  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

