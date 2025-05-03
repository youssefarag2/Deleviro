import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import { Role } from "@prisma/client";

export interface AuthenticatedUserPayload {
  userId: number;
  role: Role;
  iat?: number;
  exp?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUserPayload;
    }
  }
}

export const authGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res
        .status(401)
        .json({ message: "Unauthorized: No token provided or Invalid Token" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decodedPyaload = jwt.verify(
      token,
      config.jwt.secret
    ) as AuthenticatedUserPayload;

    if (
      !decodedPyaload ||
      typeof decodedPyaload.userId !== "number" ||
      !decodedPyaload.role
    ) {
      throw new jwt.JsonWebTokenError("Invalid token payload structure");
    }

    req.user = {
      userId: decodedPyaload.userId,
      role: decodedPyaload.role,
    };

    next();
  } catch (error) {
    let message = "Unauthorized: Invalid Token";
    if (error instanceof jwt.TokenExpiredError) {
      message = "Unauthorized: Token Expired";
    } else if (error instanceof jwt.JsonWebTokenError) {
      message = `Unauthorized: ${error.message}`;
    } else {
      console.error("Unexpected error in authGuard:", error);
      message = "Internal server error during authentication.";
      res.status(500).json({ message });
      return;
    }
    res.status(401).json({ message });
  }
};
