import { Request, Response, NextFunction } from "express";
import authService from "./auth.service";
import { RegisterUserDto } from "./dtos/register.dto";
import { LoginUserDto } from "./dtos/login.dto";

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = (req as any).validatedData as RegisterUserDto;
      const result = await authService.register(userData);
      res.status(201).json(result);
    } catch (error) {
      // HINT: Pass errors to the global error handling middleware (if you set one up).
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const loginData = (req as any).validatedData as LoginUserDto;
      const result = await authService.login(loginData);
      // HINT: Send a success response (e.g., 200 OK) with user data and tokens.
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
