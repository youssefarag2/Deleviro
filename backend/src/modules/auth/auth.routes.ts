import { Router } from "express";
import authController from "./auth.controller";
import { validateRequest } from "../../middleware/request.validator";
import { RegisterUserDto } from "./dtos/register.dto";
import { LoginUserDto } from "./dtos/login.dto";

const router = Router();

router.post(
  "/register",
  validateRequest(RegisterUserDto, "body"),
  authController.register
);

router.post(
  "/login",
  validateRequest(LoginUserDto, "body"),
  authController.login
);

export default router;
