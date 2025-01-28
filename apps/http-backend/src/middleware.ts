import { NextFunction, Request, Response } from "express";
import jwt, { decode, JsonWebTokenError } from "jsonwebtoken";
const { JWT_SECRET } = require('@repo/backend-common/config');
const { prismaClient }: any = require("@repo/db/client");

export const checkUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const header = req.headers["authorization"];

  if (!header) {
    res.status(403).send({ error: "Authorization header is missing" });
    return;
  }

  try {
    const decoded = jwt.verify(header as string, JWT_SECRET);
    console.log(decoded);
    //@ts-ignore
    const id = decoded.id;
    if (decoded) {
      const user = await prismaClient.user.findFirst({
        where: { id }
      });

      if (!user) {
        res.status(404).send({ error: "User not found" });
      }

      //@ts-ignore
      req.userId = user.id;
      //@ts-ignore
      console.log("User ObjectId:", req.userId);
      next();
    } else {
      res.status(403).send({ error: "Not logged in" });
    }
  } catch (err) {
    console.error(err);
    res.status(403).send({ error: "Invalid or expired token" });
  }
};





